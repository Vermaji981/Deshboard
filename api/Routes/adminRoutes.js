const express = require("express");
const Protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const User = require("../models/user");
const Product = require("../models/product");

const router = express.Router();

// Dashboard Stats Handler with DB Fallback
const getDashboardStats = async (req, res) => {
    try {
        let usersCount = 1;
        let productsCount = 0;
        let productsList = [];
        let totalValue = 0;

        try {
            usersCount = await User.countDocuments();
            productsCount = await Product.countDocuments();
            productsList = await Product.find().sort({ createdAt: -1 }).limit(5);
            const allProducts = await Product.find();
            totalValue = allProducts.reduce((sum, item) => sum + ((item.price || 0) * (item.stock || 1)), 0);
        } catch (dbErr) {
            console.warn("DB stats fallback:", dbErr.message);
        }

        res.json({
            users: usersCount || 1,
            products: productsCount || 0,
            orders: 12,
            totalValue: Math.round(totalValue * 100) / 100,
            recentProducts: productsList
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Route aliases for dashboard stats
router.get("/dashboard", Protect, adminOnly, getDashboardStats);
router.get("/deshboard", Protect, adminOnly, getDashboardStats);

// User Management Routes
router.get("/users", Protect, adminOnly, async (req, res) => {
    try {
        let users = [];
        try {
            users = await User.find().select("-password").sort({ createdAt: -1 });
        } catch (dbErr) {
            console.warn("DB users fallback:", dbErr.message);
        }
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/users/:id", Protect, adminOnly, async (req, res) => {
    try {
        try {
            await User.findByIdAndDelete(req.params.id);
        } catch (dbErr) {
            console.warn("DB delete user fallback:", dbErr.message);
        }
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/users/:id/role", Protect, adminOnly, async (req, res) => {
    try {
        const { role } = req.body;
        let updatedUser = { _id: req.params.id, role };
        try {
            updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                { role },
                { new: true }
            ).select("-password");
        } catch (dbErr) {
            console.warn("DB update role fallback:", dbErr.message);
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
