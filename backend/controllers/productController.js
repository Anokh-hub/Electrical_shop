
const Product = require("../models/Product");

// @desc    Create a new product
// @route   POST /api/products
const createProduct = async (req, res) => {
    try {
        const {
            name,
            sku,
            category,
            purchasePrice,
            sellingPrice,
            stock,
            lowStockThreshold,
        } = req.body;

        // Check required fields
        if (
            !name ||
            !sku ||
            !category ||
            purchasePrice === undefined ||
            sellingPrice === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required product fields",
            });
        }

        // Check whether SKU already exists
        const existingProduct = await Product.findOne({ sku });

        if (existingProduct) {
            return res.status(409).json({
                success: false,
                message: "Product with this SKU already exists",
            });
        }

        const product = await Product.create({
            name,
            sku,
            category,
            purchasePrice,
            sellingPrice,
            stock: stock ?? 0,
            lowStockThreshold: lowStockThreshold ?? 5,
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            product,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "SKU already exists",
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get all products
// @route   GET /api/products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: products.length,
            products,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get a single product
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        const status = error.name === "CastError" ? 400 : 500;

        return res.status(status).json({
            success: false,
            message:
                status === 400 ? "Invalid product ID" : error.message,
        });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
    try {
        const allowedFields = [
            "name",
            "sku",
            "category",
            "purchasePrice",
            "sellingPrice",
            "stock",
            "lowStockThreshold",
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide fields to update",
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "SKU already exists",
            });
        }

        const status = error.name === "CastError" ? 400 : 500;

        return res.status(status).json({
            success: false,
            message:
                status === 400 ? "Invalid product ID" : error.message,
        });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        const status = error.name === "CastError" ? 400 : 500;

        return res.status(status).json({
            success: false,
            message:
                status === 400 ? "Invalid product ID" : error.message,
        });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};
