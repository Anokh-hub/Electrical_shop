
const Order = require("../models/Order");
const Product = require("../models/Product");

const getDashboard = async (req, res) => {
    try {
        // Start of today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        // Total orders
        const totalOrders = await Order.countDocuments();

        // Today's orders
        const todayOrders = await Order.countDocuments({
            createdAt: { $gte: startOfDay },
        });

        // Calculate sales and collected payments
        const salesSummary = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$totalAmount" },
                    totalCollected: { $sum: "$amountPaid" },
                },
            },
        ]);

        // Today's sales
        const todaySummary = await Order.aggregate([
            { $match: { createdAt: { $gte: startOfDay } } },
            {
                $group: {
                    _id: null,
                    todaySales: { $sum: "$totalAmount" },
                    todayCollected: { $sum: "$amountPaid" },
                },
            },
        ]);

        // Pending payments
        const pendingPayments = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalPending: {
                        $sum: { $subtract: ["$totalAmount", "$amountPaid"] },
                    },
                },
            },
        ]);

        // Low-stock products
        const lowStockProducts = await Product.find({
            $expr: { $lte: ["$stock", "$lowStockThreshold"] },
        }).select("name sku stock lowStockThreshold category");

        const summary = salesSummary[0] || {
            totalSales: 0,
            totalCollected: 0,
        };

        const today = todaySummary[0] || {
            todaySales: 0,
            todayCollected: 0,
        };

        const pending = pendingPayments[0] || {
            totalPending: 0,
        };

        return res.status(200).json({
            success: true,
            dashboard: {
                totalOrders,
                todayOrders,
                totalSales: summary.totalSales,
                totalCollected: summary.totalCollected,
                todaySales: today.todaySales,
                todayCollected: today.todayCollected,
                pendingPayments: pending.totalPending,
                lowStockCount: lowStockProducts.length,
                lowStockProducts,
            },
        });
    } catch (error) {
        console.error("Dashboard error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to load dashboard data.",
        });
    }
};

module.exports = { getDashboard };
