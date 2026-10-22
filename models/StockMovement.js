
const mongoose = require("mongoose");

const stockMovementSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        type: {
            type: String,
            enum: ["purchase", "sale", "adjustment", "return"],
            required: true,
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
            validate: {
                validator: Number.isInteger,
                message: "Quantity must be a whole number",
            },
        },

        previousStock: {
            type: Number,
            required: true,
            min: 0,
        },

        newStock: {
            type: Number,
            required: true,
            min: 0,
        },

        reference: {
            type: String,
            trim: true,
            default: "",
        },

        notes: {
            type: String,
            trim: true,
            default: "",
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Owner",
            required: true,
        },
    },
    { timestamps: true }
);

stockMovementSchema.index({ product: 1, createdAt: -1 });

module.exports = mongoose.model("StockMovement", stockMovementSchema);
