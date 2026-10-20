
const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    createOrder,
    getOrders,
    getOrderById,
    updateWorkStatus,
} = require("../controllers/orderController");

router.post("/", protect, createOrder);
router.get("/", protect, getOrders);
router.get("/:id", protect, getOrderById);
router.patch("/:id/work-status", protect, updateWorkStatus);

module.exports = router;
