
const mongoose = require("mongoose");
const Purchase = require("../models/Purchase");
const Product = require("../models/Product");
const Supplier = require("../models/Supplier");
const StockMovement = require("../models/StockMovement");


const createPurchase = async (req, res) => {
    let session;

    try {
        const { invoiceNumber, supplier, items, amountPaid, notes } = req.body;

        // 1. Validate required fields
        if (
            typeof invoiceNumber !== "string" ||
            !invoiceNumber.trim() ||
            !supplier ||
            !Array.isArray(items) ||
            items.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invoice number, supplier and items are required.",
            });
        }

        const cleanInvoiceNumber = invoiceNumber.trim();

        if (!mongoose.isValidObjectId(supplier)) {
            return res.status(400).json({
                success: false,
                message: "Invalid supplier ID.",
            });
        }

        // 2. Validate supplier belongs to logged-in owner
        const supplierExists = await Supplier.findOne({
            _id: supplier,
            createdBy: req.owner._id,
        }).lean();

        if (!supplierExists) {
            return res.status(404).json({
                success: false,
                message: "Supplier not found.",
            });
        }

        // 3. Validate items and combine duplicate product IDs
        const quantities = new Map();

        for (const item of items) {
            if (
                !item.product ||
                !mongoose.isValidObjectId(item.product) ||
                !Number.isSafeInteger(Number(item.quantity)) ||
                Number(item.quantity) < 1
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Each item needs a valid product ID and positive whole-number quantity.",
                });
            }

            const productId = String(item.product);
            const quantity = Number(item.quantity);
            const combinedQuantity =
                (quantities.get(productId) || 0) + quantity;

            if (!Number.isSafeInteger(combinedQuantity)) {
                return res.status(400).json({
                    success: false,
                    message: "Combined product quantity is too large.",
                });
            }

            quantities.set(productId, combinedQuantity);
        }

        // 4. Fetch products and calculate purchase total
        const productIds = [...quantities.keys()];

        const products = await Product.find({
            _id: { $in: productIds },
        }).lean();

        const productMap = new Map(
            products.map((product) => [String(product._id), product])
        );

        const purchaseItems = [];
        let totalAmount = 0;

        for (const [productId, quantity] of quantities) {
            const product = productMap.get(productId);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${productId}`,
                });
            }

            // Use the first matching item's purchase price.
            const requestedItem = items.find(
                (item) => String(item.product) === productId
            );

            const purchasePrice = Number(requestedItem.purchasePrice);

            if (
                requestedItem.purchasePrice === undefined ||
                requestedItem.purchasePrice === null ||
                requestedItem.purchasePrice === "" ||
                !Number.isFinite(purchasePrice) ||
                purchasePrice < 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: `Valid purchase price is required for ${product.name}.`,
                });
            }

            const subtotal = purchasePrice * quantity;

            if (!Number.isFinite(subtotal)) {
                return res.status(400).json({
                    success: false,
                    message: "Purchase amount is too large.",
                });
            }

            totalAmount += subtotal;

            purchaseItems.push({
                product: product._id,
                name: product.name,
                sku: product.sku,
                quantity,
                purchasePrice,
                subtotal,
            });
        }

        if (!Number.isFinite(totalAmount)) {
            return res.status(400).json({
                success: false,
                message: "Invalid total purchase amount.",
            });
        }

        // 5. Validate payment
        const paid = amountPaid === undefined ? 0 : Number(amountPaid);

        if (
            !Number.isFinite(paid) ||
            paid < 0 ||
            paid > totalAmount
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Amount paid must be between zero and total purchase cost.",
            });
        }

        const paymentStatus =
            paid === totalAmount
                ? "paid"
                : paid > 0
                    ? "partial"
                    : "pending";

        // 6. Start transaction
        // MongoDB must run as a replica set or sharded cluster.
        session = await mongoose.startSession();

        await session.withTransaction(async () => {
            const movementData = [];

            for (const item of purchaseItems) {
                // Atomic update also reads the current stock.
                // The stock increment and movement record share a transaction.
                const updatedProduct = await Product.findOneAndUpdate(
                    { _id: item.product },
                    { $inc: { stock: item.quantity } },
                    {
                        new: true,
                        session,
                        runValidators: true,
                    }
                );

                if (!updatedProduct) {
                    throw new Error(
                        `Could not update stock for ${item.name}.`
                    );
                }

                const newStock = updatedProduct.stock;
                const previousStock = newStock - item.quantity;

                movementData.push({
                    product: item.product,
                    type: "purchase",
                    quantity: item.quantity,
                    previousStock,
                    newStock,
                    reference: cleanInvoiceNumber,
                    notes: notes || "Stock added through purchase",
                    createdBy: req.owner._id,
                });
            }

            await Purchase.create(
                [
                    {
                        invoiceNumber: cleanInvoiceNumber,
                        supplier,
                        items: purchaseItems,
                        totalAmount,
                        amountPaid: paid,
                        paymentStatus,
                        notes,
                        createdBy: req.owner._id,
                    },
                ],
                { session }
            );

            if (movementData.length > 0) {
                await StockMovement.insertMany(movementData, {
                    session,
                });
            }
        });

        // 7. Return saved purchase
        const purchase = await Purchase.findOne({
            invoiceNumber: cleanInvoiceNumber,
            createdBy: req.owner._id,
        }).populate("supplier", "name companyName phone");

        return res.status(201).json({
            success: true,
            message: "Purchase recorded and stock updated successfully.",
            purchase,
        });
    } catch (error) {
        console.error("Create purchase error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "This invoice number already exists.",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to record purchase. Please try again.",
        });
    } finally {
        if (session) {
            await session.endSession();
        }
    }
};

const getPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.find({
            createdBy: req.owner._id,
        })
            .populate("supplier", "name companyName phone")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: purchases.length,
            purchases,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to fetch purchases.",
        });
    }
};

const getPurchaseById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid purchase ID.",
            });
        }

        const purchase = await Purchase.findOne({
            _id: req.params.id,
            createdBy: req.owner._id,
        }).populate("supplier", "name companyName phone");

        if (!purchase) {
            return res.status(404).json({
                success: false,
                message: "Purchase not found.",
            });
        }

        return res.status(200).json({ success: true, purchase });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to fetch purchase.",
        });
    }
};

module.exports = {
    createPurchase,
    getPurchases,
    getPurchaseById,
};
