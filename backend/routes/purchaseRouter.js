
const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
    createPurchase,
    getPurchases,
    getPurchaseById,
} = require("../controllers/purchaseController");

router.use(protect);

router.post("/", createPurchase);
router.get("/", getPurchases);
router.get("/:id", getPurchaseById);

module.exports = router;
