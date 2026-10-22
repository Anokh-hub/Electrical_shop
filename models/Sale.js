
const mongoose = require("mongoose");

const saleItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        sku: {
            type: String,
            required: true,
            trim: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            validate: {
                validator: Number.isInteger,
                message: "Quantity must be a whole number.",
            },
        },
        unitPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        subtotal: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { _id: false }
);

const saleSchema = new mongoose.Schema(
    {
        billNumber: {
            type: String,
            required: true,
            trim: true,
        },
        customerName: {
            type: String,
            trim: true,
            default: "Walk-in Customer",
        },
        customerPhone: {
            type: String,
            trim: true,
            default: "",
        },
        items: {
            type: [saleItemSchema],
            required: true,
            validate: {
                validator: (items) =>
                    Array.isArray(items) && items.length > 0,
                message: "At least one product is required.",
            },
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        amountPaid: {
            type: Number,
            required: true,
            min: 0,
        },
        paymentMethod: {
            type: String,
            enum: ["cash", "upi", "other"],
            required: true,
            default: "cash",
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "partial", "paid"],
            required: true,
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

saleSchema.index(
    { billNumber: 1, createdBy: 1 },
    { unique: true }
);

saleSchema.index({ createdBy: 1, createdAt: -1 });

module.exports = mongoose.model("Sale", saleSchema);
