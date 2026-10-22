
const Supplier = require("../models/Supplier");

// Add supplier
const createSupplier = async (req, res) => {
    try {
        const { name, companyName, phone, email, address, gstNumber, notes } =
            req.body;

        if (!name || !phone) {
            return res.status(400).json({
                success: false,
                message: "Supplier name and phone are required.",
            });
        }

        const supplier = await Supplier.create({
            name,
            companyName,
            phone,
            email,
            address,
            gstNumber,
            notes,
            createdBy: req.owner._id,
        });

        return res.status(201).json({
            success: true,
            message: "Supplier added successfully.",
            supplier,
        });
    } catch (error) {
        console.error("Create supplier:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to add supplier.",
        });
    }
};

// Get suppliers and search by name, company or phone
const getSuppliers = async (req, res) => {
    try {
        const search = (req.query.search || "").trim();
        const filter = { createdBy: req.owner._id };

        if (search) {
            const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            filter.$or = [
                { name: { $regex: escaped, $options: "i" } },
                { companyName: { $regex: escaped, $options: "i" } },
                { phone: { $regex: escaped, $options: "i" } },
            ];
        }

        const suppliers = await Supplier.find(filter).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: suppliers.length,
            suppliers,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to fetch suppliers.",
        });
    }
};

// Get one supplier
const getSupplierById = async (req, res) => {
    try {
        const supplier = await Supplier.findOne({
            _id: req.params.id,
            createdBy: req.owner._id,
        });

        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: "Supplier not found.",
            });
        }

        return res.status(200).json({ success: true, supplier });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid supplier ID.",
        });
    }
};

// Update supplier
const updateSupplier = async (req, res) => {
    try {
        const allowedFields = [
            "name",
            "companyName",
            "phone",
            "email",
            "address",
            "gstNumber",
            "notes",
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        const supplier = await Supplier.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.owner._id },
            updates,
            { new: true, runValidators: true }
        );

        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: "Supplier not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Supplier updated successfully.",
            supplier,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Unable to update supplier.",
        });
    }
};

// Delete supplier
const deleteSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findOneAndDelete({
            _id: req.params.id,
            createdBy: req.owner._id,
        });

        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: "Supplier not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Supplier deleted successfully.",
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Unable to delete supplier.",
        });
    }
};

module.exports = {
    createSupplier,
    getSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier,
};
