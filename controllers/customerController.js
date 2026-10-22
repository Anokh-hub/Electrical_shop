
const Customer = require("../models/Customer");
const Order = require("../models/Order");

// Add customer
const createCustomer = async (req, res) => {
    try {
        const { name, phone, email, address, notes } = req.body;

        if (!name || !phone) {
            return res.status(400).json({
                success: false,
                message: "Customer name and phone are required.",
            });
        }

        const customer = await Customer.create({
            name,
            phone,
            email,
            address,
            notes,
            createdBy: req.owner._id,
        });

        return res.status(201).json({
            success: true,
            message: "Customer created successfully.",
            customer,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to create customer.",
        });
    }
};

// Get all customers and search by name or phone
const getCustomers = async (req, res) => {
    try {
        const search = (req.query.search || "").trim();

        const filter = { createdBy: req.owner._id };

        if (search) {
            const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            filter.$or = [
                { name: { $regex: escapedSearch, $options: "i" } },
                { phone: { $regex: escapedSearch, $options: "i" } },
            ];
        }

        const customers = await Customer.find(filter).sort({
            createdAt: -1,
        });

        return res.status(200).json({
            success: true,
            count: customers.length,
            customers,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to fetch customers.",
        });
    }
};

// Get one customer
const getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findOne({
            _id: req.params.id,
            createdBy: req.owner._id,
        });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found.",
            });
        }

        return res.status(200).json({
            success: true,
            customer,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid customer ID.",
        });
    }
};

// Customer's order history
const getCustomerOrders = async (req, res) => {
    try {
        const customer = await Customer.findOne({
            _id: req.params.id,
            createdBy: req.owner._id,
        });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found.",
            });
        }

        const orders = await Order.find({
            customerPhone: customer.phone,
            createdBy: req.owner._id,
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            customer,
            count: orders.length,
            orders,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Unable to fetch customer order history.",
        });
    }
};

// Update customer
const updateCustomer = async (req, res) => {
    try {
        const allowedFields = ["name", "phone", "email", "address", "notes"];
        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        const customer = await Customer.findOneAndUpdate(
            {
                _id: req.params.id,
                createdBy: req.owner._id,
            },
            updates,
            { new: true, runValidators: true }
        );

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Customer updated successfully.",
            customer,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Unable to update customer.",
        });
    }
};

// Delete customer
const deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findOneAndDelete({
            _id: req.params.id,
            createdBy: req.owner._id,
        });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Customer deleted successfully.",
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Unable to delete customer.",
        });
    }
};

module.exports = {
    createCustomer,
    getCustomers,
    getCustomerById,
    getCustomerOrders,
    updateCustomer,
    deleteCustomer,
};
