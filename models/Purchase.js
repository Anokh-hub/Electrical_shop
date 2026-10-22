
const mongoose = require("mongoose");

const purchaseItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        name: { type: String, required: true },
        sku: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        purchasePrice: { type: Number, required: true, min: 0 },
        subtotal: { type: Number, required: true, min: 0 },
    },
    { _id: false }
);

const purchaseSchema = new mongoose.Schema(
    {
        invoiceNumber: {
            type: String,
            required: true,
            trim: true,
        },
        supplier: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Supplier",
            required: true,
        },
        items: {
            type: [purchaseItemSchema],
            required: true,
            validate: {
                validator: (items) => items.length > 0,
                message: "Purchase must contain at least one item.",
            },
        },
        totalAmount: { type: Number, required: true, min: 0 },
        amountPaid: { type: Number, required: true, min: 0, default: 0 },
        paymentStatus: {
            type: String,
            enum: ["pending", "partial", "paid"],
            default: "pending",
        },
        notes: { type: String, trim: true, default: "" },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Owner",
            required: true,
        },
    },
    { timestamps: true }
);

purchaseSchema.index(
    { invoiceNumber: 1, createdBy: 1 },
    { unique: true }
);

module.exports = mongoose.model("Purchase", purchaseSchema);
