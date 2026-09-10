const express = require("express");
const Protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const User = require("../models/user");
const Product = require("../models/product");

const router = express.Router();

// Dashboard Stats Handler
const getDashboardStats = async (req, res) => {
    try {
        const usersCount = await User.countDocuments();
        const productsCount = await Product.countDocuments();
        const productsList = await Product.find().sort({ createdAt: -1 }).limit(5);

        // Calculate total inventory value
        const allProducts = await Product.find();
        const totalValue = allProducts.reduce((sum, item) => sum + ((item.price || 0) * (item.stock || 1)), 0);

        res.json({
            users: usersCount,
            products: productsCount,
            orders: 12, // demo orders counter
            totalValue: Math.round(totalValue * 100) / 100,
            recentProducts: productsList
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Route aliases for dashboard stats
router.get("/dashboard", Protect, adminOnly, getDashboardStats);
router.get("/deshboard", Protect, adminOnly, getDashboardStats);

// User Management Routes
router.get("/users", Protect, adminOnly, async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/users/:id", Protect, adminOnly, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/users/:id/role", Protect, adminOnly, async (req, res) => {
    try {
        const { role } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select("-password");
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
