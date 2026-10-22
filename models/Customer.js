
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
            default: "",
        },
        address: {
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

customerSchema.index({ name: 1, phone: 1 });

module.exports = mongoose.model("Customer", customerSchema);
