
const Order = require("../models/Order");

const getSalesReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "Please provide startDate and endDate.",
            });
        }

        // Validate date format: YYYY-MM-DD
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

        if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
            return res.status(400).json({
                success: false,
                message: "Dates must use YYYY-MM-DD format.",
            });
        }

        const start = new Date(`${startDate}T00:00:00.000Z`);
        const end = new Date(`${endDate}T00:00:00.000Z`);

        // Reject invalid dates and reversed date ranges
        if (
            Number.isNaN(start.getTime()) ||
            Number.isNaN(end.getTime()) ||
            start.toISOString().slice(0, 10) !== startDate ||
            end.toISOString().slice(0, 10) !== endDate ||
            start > end
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid date range.",
            });
        }

        // Include the entire end date
        end.setUTCDate(end.getUTCDate() + 1);

        const matchStage = {
            createdAt: {
                $gte: start,
                $lt: end,
            },
        };

        const [report] = await Order.aggregate([
            { $match: matchStage },
            {
                $facet: {
                    summary: [
                        {
                            $group: {
                                _id: null,
                                totalOrders: { $sum: 1 },
                                totalSales: { $sum: "$totalAmount" },
                                totalCollected: { $sum: "$amountPaid" },
                                pendingPayments: {
                                    $sum: {
                                        $subtract: ["$totalAmount", "$amountPaid"],
                                    },
                                },
                            },
                        },
                    ],

                    dailySales: [
                        {
                            $group: {
                                _id: {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: "$createdAt",
                                        timezone: "UTC",
                                    },
                                },
                                orders: { $sum: 1 },
                                sales: { $sum: "$totalAmount" },
                                collected: { $sum: "$amountPaid" },
                            },
                        },
                        { $sort: { _id: 1 } },
                    ],

                    paymentMethods: [
                        {
                            $group: {
                                _id: "$paymentMethod",
                                orders: { $sum: 1 },
                                sales: { $sum: "$totalAmount" },
                                collected: { $sum: "$amountPaid" },
                            },
                        },
                        { $sort: { _id: 1 } },
                    ],
                },
            },
        ]);

        return res.status(200).json({
            success: true,
            dateRange: { startDate, endDate: endDate.toISOString().slice(0, 10) },
            summary: report.summary[0] || {
                totalOrders: 0,
                totalSales: 0,
                totalCollected: 0,
                pendingPayments: 0,
            },
            dailySales: report.dailySales,
            paymentMethods: report.paymentMethods,
        });
    } catch (error) {
        console.error("Sales report error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to generate sales report.",
        });
    }
};

module.exports = { getSalesReport };
