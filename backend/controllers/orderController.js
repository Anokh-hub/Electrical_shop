
const Order = require("../models/Order");
const Product = require("../models/Product");

// 1. Create a new order
const createOrder = async (req, res) => {
    const updatedProducts = [];

    try {
        const {
            customerName,
            customerPhone,
            items,
            paymentMethod,
            paymentStatus,
            amountPaid,
            orderType,
            workStatus,
            notes,
        } = req.body;

        // Validate required fields
        if (!customerName || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Customer name and at least one product are required.",
            });
        }

        // Validate product IDs and quantities
        const quantities = new Map();

        for (const item of items) {
            if (
                !item.product ||
                !/^[a-f\d]{24}$/i.test(String(item.product)) ||
                !Number.isInteger(Number(item.quantity)) ||
                Number(item.quantity) < 1
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Each item needs a valid product ID and positive integer quantity.",
                });
            }

            const id = String(item.product);
            quantities.set(
                id,
                (quantities.get(id) || 0) + Number(item.quantity)
            );
        }

        // Fetch products and calculate prices on the server
        const orderItems = [];
        let totalAmount = 0;

        for (const [productId, quantity] of quantities) {
            const product = await Product.findById(productId);

            if (!product) {
                throw new Error(`Product not found: ${productId}`);
            }

            if (product.stock < quantity) {
                throw new Error(
                    `Insufficient stock for ${product.name}. Available: ${product.stock}`
                );
            }

            const subtotal = product.sellingPrice * quantity;
            totalAmount += subtotal;

            orderItems.push({
                product: product._id,
                name: product.name,
                sku: product.sku,
                quantity,
                unitPrice: product.sellingPrice,
                subtotal,
            });
        }

        // Validate payment details
        const allowedMethods = ["cash", "upi", "credit"];
        const method = paymentMethod || "cash";
        const paid = amountPaid === undefined ? totalAmount : Number(amountPaid);

        if (
            !allowedMethods.includes(method) ||
            !Number.isFinite(paid) ||
            paid < 0 ||
            paid > totalAmount
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment method or amount paid.",
            });
        }

        const status =
            paid === totalAmount ? "paid" : paid > 0 ? "partial" : "pending";

        // Reduce stock; remember changes so they can be rolled back on failure
        for (const item of orderItems) {
            const product = await Product.findOneAndUpdate(
                {
                    _id: item.product,
                    stock: { $gte: item.quantity },
                },
                {
                    $inc: { stock: -item.quantity },
                },
                { new: true }
            );

            if (!product) {
                throw new Error(
                    `Stock changed or insufficient for ${item.name}. Please retry.`
                );
            }

            updatedProducts.push(item);
        }

        const order = await Order.create({
            orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            customerName,
            customerPhone,
            items: orderItems,
            totalAmount,
            paymentMethod: method,
            paymentStatus: status,
            amountPaid: paid,
            orderType: orderType || "sale",
            workStatus: workStatus || "not_required",
            notes,
            createdBy: req.owner._id,
        });

        return res.status(201).json({
            success: true,
            message: "Order created successfully.",
            order,
        });
    } catch (error) {
        // Restore stock if order creation fails
        for (const item of updatedProducts.reverse()) {
            try {
                await Product.updateOne(
                    { _id: item.product },
                    { $inc: { stock: item.quantity } }
                );
            } catch (rollbackError) {
                console.error("Stock rollback failed:", rollbackError.message);
            }
        }

        return res.status(400).json({
            success: false,
            message: error.message || "Unable to create order.",
        });
    }
};

// 2. Get all orders
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to fetch orders.",
        });
    }
};

// 3. Get a single order
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("createdBy", "name email");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }

        return res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid order ID.",
        });
    }
};

// 4. Update work status
const updateWorkStatus = async (req, res) => {
    try {
        const allowedStatuses = [
            "not_required",
            "pending",
            "in_progress",
            "completed",
        ];

        const { workStatus } = req.body;

        if (!allowedStatuses.includes(workStatus)) {
            return res.status(400).json({
                success: false,
                message: "Invalid work status.",
            });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { workStatus },
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Work status updated.",
            order,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Unable to update work status.",
        });
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateWorkStatus,
};
