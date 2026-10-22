
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
        },

        sku: {
            type: String,
            required: [true, "Product SKU is required"],
            unique: true,
            trim: true,
            uppercase: true,
        },

        category: {
            type: String,
            required: [true, "Product category is required"],
            trim: true,
        },

        purchasePrice: {
            type: Number,
            required: [true, "Purchase price is required"],
            min: [0, "Purchase price cannot be negative"],
        },

        sellingPrice: {
            type: Number,
            required: [true, "Selling price is required"],
            min: [0, "Selling price cannot be negative"],
        },

        stock: {
            type: Number,
            required: true,
            default: 0,
            min: [0, "Stock cannot be negative"],
            validate: {
                validator: Number.isInteger,
                message: "Stock must be a whole number",
            },
        },

        lowStockThreshold: {
            type: Number,
            default: 5,
            min: [0, "Low stock threshold cannot be negative"],
            validate: {
                validator: Number.isInteger,
                message: "Low stock threshold must be a whole number",
            },
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Product", productSchema);
