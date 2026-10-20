
const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
    getSalesReport,
} = require("../controllers/reportController");

router.get("/sales", protect, getSalesReport);

module.exports = router;
