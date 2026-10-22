
const jwt = require("jsonwebtoken");
const Owner = require("../models/Owner");

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. Please login first.",
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const owner = await Owner.findById(decoded.id).select("-password");

        if (!owner) {
            return res.status(401).json({
                success: false,
                message: "Owner account not found.",
            });
        }

        req.owner = owner;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token. Please login again.",
        });
    }
};

module.exports = { protect };
