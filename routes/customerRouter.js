
const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    createCustomer,
    getCustomers,
    getCustomerById,
    getCustomerOrders,
    updateCustomer,
    deleteCustomer,
} = require("../controllers/customerController");

router.use(protect);

router.post("/", createCustomer);
router.get("/", getCustomers);
router.get("/:id/orders", getCustomerOrders);
router.get("/:id", getCustomerById);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);

module.exports = router;
