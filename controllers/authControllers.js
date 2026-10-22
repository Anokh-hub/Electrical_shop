
const Owner = require("../models/Owner");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (ownerId) => {
    return jwt.sign(
        { id: ownerId },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
};


// Register owner
const registerOwner = async (req, res) => {
    try {
        const setupKey = req.headers["x-owner-setup-key"];

        if (
            !process.env.OWNER_SETUP_KEY ||
            setupKey !== process.env.OWNER_SETUP_KEY
        ) {
            return res.status(403).json({
                success: false,
                message: "Owner registration is not authorized",
            });
        }

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required",
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingOwner = await Owner.findOne({
            email: normalizedEmail,
        });

        if (existingOwner) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const owner = await Owner.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
        });

        return res.status(201).json({
            success: true,
            message: "Owner registered successfully",
            owner: {
                id: owner._id,
                name: owner.name,
                email: owner.email,
            },
            token: generateToken(owner._id.toString()),
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Server error while registering owner",
        });
    }
};

// Login owner
const loginOwner = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const owner = await Owner.findOne({
            email: email.trim().toLowerCase(),
        }).select("+password");

        if (!owner) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            owner.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Login successful",
            owner: {
                id: owner._id,
                name: owner.name,
                email: owner.email,
            },
            token: generateToken(owner._id.toString()),
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error while logging in",
        });
    }
};

module.exports = {
    registerOwner,
    loginOwner,
};
