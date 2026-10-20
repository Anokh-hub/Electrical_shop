
const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    createSale,
    getSales,
    getSaleById,
} = require("../controllers/saleController");

router.use(protect);

router.post("/", createSale);
router.get("/", getSales);
router.get("/:id", getSaleById);

module.exports = router;
