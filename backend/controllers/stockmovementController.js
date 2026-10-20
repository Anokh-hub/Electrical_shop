
const mongoose = require("mongoose");
const StockMovement = require("../models/StockMovement");

const getStockMovements = async (req, res) => {
    try {
        const { productId, type } = req.query;

        const filter = {
            createdBy: req.owner._id,
        };

        if (productId) {
            if (!mongoose.isValidObjectId(productId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid product ID.",
                });
            }

            filter.product = productId;
        }

        if (type) {
            const allowedTypes = [
                "purchase",
                "sale",
                "adjustment",
                "return",
            ];

            if (!allowedTypes.includes(type)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid stock movement type.",
                });
            }

            filter.type = type;
        }

        const movements = await StockMovement.find(filter)
            .populate("product", "name sku category")
            .populate("createdBy", "name")
            .sort({ createdAt: -1 })
            .limit(100);

        return res.status(200).json({
            success: true,
            count: movements.length,
            movements,
        });
    } catch (error) {
        console.error("Stock history error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch stock history.",
        });
    }
};

module.exports = { getStockMovements };
