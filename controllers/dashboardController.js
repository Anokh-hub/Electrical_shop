
const Sale = require("../models/Sale");
const Product = require("../models/Product");

const getDashboard = async (req, res) => {
    try {
        const ownerId = req.owner._id;

        // Start of today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        // Total sales bills
        const totalSalesCount = await Sale.countDocuments({
            createdBy: ownerId,
        });

        // Today's sales bills
        const todaySalesCount = await Sale.countDocuments({
            createdBy: ownerId,
            createdAt: { $gte: startOfDay },
        });

        // Overall sales and collected payments
        const salesSummary = await Sale.aggregate([
            {
                $match: { createdBy: ownerId },
            },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$totalAmount" },
                    totalCollected: { $sum: "$amountPaid" },
                },
            },
        ]);

        // Today's sales summary
        const todaySummary = await Sale.aggregate([
            {
                $match: {
                    createdBy: ownerId,
                    createdAt: { $gte: startOfDay },
                },
            },
            {
                $group: {
                    _id: null,
                    todaySales: { $sum: "$totalAmount" },
                    todayCollected: { $sum: "$amountPaid" },
                },
            },
        ]);

        // Pending customer payments
        const pendingPayments = await Sale.aggregate([
            {
                $match: { createdBy: ownerId },
            },
            {
                $group: {
                    _id: null,
                    totalPending: {
                        $sum: {
                            $subtract: ["$totalAmount", "$amountPaid"],
                        },
                    },
                },
            },
        ]);

        // Low-stock products
        const lowStockProducts = await Product.find({
            $expr: {
                $lte: ["$stock", "$lowStockThreshold"],
            },
        })
            .select("name sku stock lowStockThreshold category")
            .sort({ stock: 1 })
            .limit(10);

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
                totalSalesCount,
                todaySalesCount,
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
        console.error("Dashboard error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to load dashboard data.",
        });
    }
};

module.exports = { getDashboard };