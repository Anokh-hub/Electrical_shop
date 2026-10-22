
const mongoose = require("mongoose");
const Sale = require("../models/Sale");
const Product = require("../models/Product");
const StockMovement = require("../models/StockMovement");

// Create a new sale / bill
const createSale = async (req, res) => {
    let session;

    try {
        const {
            billNumber,
            customerName,
            customerPhone,
            items,
            amountPaid,
            paymentMethod,
            notes,
        } = req.body;

        // 1. Validate items
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one product is required.",
            });
        }

        // 2. Combine duplicate product IDs
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

            const id = String(item.product);
            const quantity = Number(item.quantity);
            const combined = (quantities.get(id) || 0) + quantity;

            if (!Number.isSafeInteger(combined)) {
                return res.status(400).json({
                    success: false,
                    message: "Combined quantity is too large.",
                });
            }

            quantities.set(id, combined);
        }

        // 3. Fetch products from database
        const productIds = [...quantities.keys()];

        const products = await Product.find({
            _id: { $in: productIds },
        }).lean();

        const productMap = new Map(
            products.map((product) => [String(product._id), product])
        );

        if (products.length !== productIds.length) {
            return res.status(404).json({
                success: false,
                message: "One or more products were not found.",
            });
        }

        // 4. Calculate bill using database selling prices
        const saleItems = [];
        let totalAmount = 0;

        for (const [productId, quantity] of quantities) {
            const product = productMap.get(productId);
            const unitPrice = product.sellingPrice;
            const subtotal = unitPrice * quantity;

            if (
                !Number.isFinite(unitPrice) ||
                unitPrice < 0 ||
                !Number.isFinite(subtotal)
            ) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid selling price for ${product.name}.`,
                });
            }

            totalAmount += subtotal;

            saleItems.push({
                product: product._id,
                name: product.name,
                sku: product.sku,
                quantity,
                unitPrice,
                subtotal,
            });
        }

        if (!Number.isFinite(totalAmount)) {
            return res.status(400).json({
                success: false,
                message: "Invalid bill total.",
            });
        }

        // 5. Validate payment
        const paid = amountPaid === undefined ? totalAmount : Number(amountPaid);
        const method = paymentMethod || "cash";

        if (
            !Number.isFinite(paid) ||
            paid < 0 ||
            paid > totalAmount
        ) {
            return res.status(400).json({
                success: false,
                message: "Amount paid must be between zero and the bill total.",
            });
        }

        if (!["cash", "upi", "other"].includes(method)) {
            return res.status(400).json({
                success: false,
                message: "Payment method must be cash, upi, or other.",
            });
        }

        const paymentStatus =
            paid === totalAmount
                ? "paid"
                : paid > 0
                    ? "partial"
                    : "pending";

        // Generate a bill number if one wasn't provided
        const finalBillNumber =
            typeof billNumber === "string" && billNumber.trim()
                ? billNumber.trim()
                : `BILL-${new mongoose.Types.ObjectId().toString()}`;

        // 6. Start transaction
        // MongoDB must be configured as a replica set or sharded cluster.
        session = await mongoose.startSession();

        await session.withTransaction(async () => {
            const movementData = [];

            for (const item of saleItems) {
                // Atomic stock deduction prevents selling unavailable stock.
                const updatedProduct = await Product.findOneAndUpdate(
                    {
                        _id: item.product,
                        stock: { $gte: item.quantity },
                    },
                    {
                        $inc: { stock: -item.quantity },
                    },
                    {
                        new: true,
                        session,
                        runValidators: true,
                    }
                );

                if (!updatedProduct) {
                    throw new Error(
                        `Insufficient stock for ${item.name}. Please check available quantity.`
                    );
                }

                const newStock = updatedProduct.stock;
                const previousStock = newStock + item.quantity;

                movementData.push({
                    product: item.product,
                    type: "sale",
                    quantity: item.quantity,
                    previousStock,
                    newStock,
                    reference: finalBillNumber,
                    notes: "Stock deducted through sale",
                    createdBy: req.owner._id,
                });
            }

            await Sale.create(
                [
                    {
                        billNumber: finalBillNumber,
                        customerName:
                            typeof customerName === "string" &&
                                customerName.trim()
                                ? customerName.trim()
                                : "Walk-in Customer",
                        customerPhone:
                            typeof customerPhone === "string"
                                ? customerPhone.trim()
                                : "",
                        items: saleItems,
                        totalAmount,
                        amountPaid: paid,
                        paymentMethod: method,
                        paymentStatus,
                        notes:
                            typeof notes === "string" ? notes.trim() : "",
                        createdBy: req.owner._id,
                    },
                ],
                { session }
            );

            await StockMovement.insertMany(movementData, { session });
        });

        const sale = await Sale.findOne({
            billNumber: finalBillNumber,
            createdBy: req.owner._id,
        }).populate("items.product", "name sku");

        return res.status(201).json({
            success: true,
            message: "Sale recorded and stock updated successfully.",
            sale,
        });
    } catch (error) {
        console.error("Create sale error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "This bill number already exists.",
            });
        }

        if (
            error.message &&
            error.message.startsWith("Insufficient stock for")
        ) {
            return res.status(409).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to record sale. Please try again.",
        });
    } finally {
        if (session) {
            await session.endSession();
        }
    }
};

// Get sales history for the logged-in owner
const getSales = async (req, res) => {
    try {
        const sales = await Sale.find({
            createdBy: req.owner._id,
        })
            .sort({ createdAt: -1 })
            .limit(100)
            .populate("items.product", "name sku");

        return res.status(200).json({
            success: true,
            count: sales.length,
            sales,
        });
    } catch (error) {
        console.error("Get sales error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch sales.",
        });
    }
};

// Get one bill by ID
const getSaleById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid sale ID.",
            });
        }

        const sale = await Sale.findOne({
            _id: req.params.id,
            createdBy: req.owner._id,
        }).populate("items.product", "name sku");

        if (!sale) {
            return res.status(404).json({
                success: false,
                message: "Sale not found.",
            });
        }

        return res.status(200).json({
            success: true,
            sale,
        });
    } catch (error) {
        console.error("Get sale error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch sale.",
        });
    }
};

module.exports = {
    createSale,
    getSales,
    getSaleById,
};
