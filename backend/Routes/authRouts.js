const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require("../models/user");
const Protect = require("../middleware/authMiddleware");

const router = express.Router();

// Memory store fallback if MongoDB Atlas is not yet whitelisted
const memoryUsers = [];

// Register Handler
const handleRegister = async (req, res) => {
    try {
        const { name, email, password, role } = req.body || {};

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please fill all required fields" });
        }

        const normalizedEmail = String(email).toLowerCase().trim();

        try {
            if (mongoose.connection.readyState !== 1) {
                throw new Error("DB connection not ready");
            }
            const existingUser = await User.findOne({ email: normalizedEmail });
            if (existingUser) {
                return res.status(400).json({ message: "User with this email already exists" });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = await User.create({
                name,
                email: normalizedEmail,
                password: hashedPassword,
                role: role || "User"
            });

            const token = jwt.sign(
                { userId: newUser._id, role: newUser.role },
                process.env.JWT_SECRET || "mysecretkey",
                { expiresIn: "1d" }
            );

            return res.status(201).json({
                message: "Registration successful!",
                token,
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role
                }
            });
        } catch (dbErr) {
            console.warn("Using Memory Registration Fallback:", dbErr.message);

            const existingMem = memoryUsers.find(u => u.email === normalizedEmail);
            if (existingMem) {
                return res.status(400).json({ message: "User with this email already exists" });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const memUser = {
                _id: "mem_" + Date.now(),
                name,
                email: normalizedEmail,
                password: hashedPassword,
                role: role || "User"
            };
            memoryUsers.push(memUser);

            const token = jwt.sign(
                { userId: memUser._id, role: memUser.role },
                process.env.JWT_SECRET || "mysecretkey",
                { expiresIn: "1d" }
            );

            return res.status(201).json({
                message: "Registration successful!",
                token,
                user: {
                    id: memUser._id,
                    name: memUser.name,
                    email: memUser.email,
                    role: memUser.role
                }
            });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Login Handler
const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        const normalizedEmail = String(email).toLowerCase().trim();

        // Demo Admin shortcut credentials
        if (normalizedEmail === "admin@gmail.com" && password === "admin123") {
            const token = jwt.sign(
                { userId: "admin_demo_id", role: "Admin" },
                process.env.JWT_SECRET || "mysecretkey",
                { expiresIn: "1d" }
            );
            return res.json({
                message: "Login Successful",
                token,
                user: {
                    id: "admin_demo_id",
                    name: "Admin Manager",
                    email: "admin@gmail.com",
                    role: "Admin"
                }
            });
        }

        try {
            if (mongoose.connection.readyState !== 1) {
                throw new Error("DB connection not ready");
            }
            const user = await User.findOne({ email: normalizedEmail });
            if (user) {
                const passwordMatch = await bcrypt.compare(password, user.password);
                if (passwordMatch) {
                    const token = jwt.sign(
                        { userId: user._id, role: user.role },
                        process.env.JWT_SECRET || "mysecretkey",
                        { expiresIn: "1d" }
                    );
                    return res.json({
                        message: "Login Successful",
                        token,
                        user: {
                            id: user._id,
                            name: user.name,
                            email: user.email,
                            role: user.role
                        }
                    });
                }
            }
        } catch (dbErr) {
            console.warn("DB login fallback:", dbErr.message);
        }

        // Memory store check
        const memUser = memoryUsers.find(u => u.email === normalizedEmail);
        if (memUser) {
            const passwordMatch = await bcrypt.compare(password, memUser.password);
            if (passwordMatch) {
                const token = jwt.sign(
                    { userId: memUser._id, role: memUser.role },
                    process.env.JWT_SECRET || "mysecretkey",
                    { expiresIn: "1d" }
                );
                return res.json({
                    message: "Login Successful",
                    token,
                    user: {
                        id: memUser._id,
                        name: memUser.name,
                        email: memUser.email,
                        role: memUser.role
                    }
                });
            }
        }

        return res.status(401).json({ message: "Invalid email or password" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Attach handlers directly to router for serverless function use
router.handleRegister = handleRegister;
router.handleLogin = handleLogin;

// Register Routes
router.post("/register", handleRegister);

// Login Routes
router.post("/login", handleLogin);

// Get current user profile
router.get("/me", Protect, async (req, res) => {
    try {
        if (req.user.userId === "admin_demo_id") {
            return res.json({
                _id: "admin_demo_id",
                name: "Admin Manager",
                email: "admin@gmail.com",
                role: "Admin"
            });
        }

        try {
            const user = await User.findById(req.user.userId).select("-password");
            if (user) {
                return res.json(user);
            }
        } catch (dbErr) {
            console.warn("DB profile lookup fallback:", dbErr.message);
        }

        const memUser = memoryUsers.find(u => u._id === req.user.userId);
        if (memUser) {
            const { password, ...userWithoutPass } = memUser;
            return res.json(userWithoutPass);
        }

        return res.status(404).json({ message: "User not found" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router;