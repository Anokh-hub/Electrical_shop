
const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
    getStockMovements,
} = require("../controllers/stockmovementController");

router.get("/", protect, getStockMovements);

module.exports = router;
