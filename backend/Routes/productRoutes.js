const express = require("express");
const Product = require("../models/Product");
const Protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

// Get all products (Public - for both Frontend store & Admin panel)
router.get("/", async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

// Get single product details
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create product (Admin only)
router.post("/", Protect, adminOnly, async (req, res) => {
    try {
        const payload = { ...req.body };
        if (payload.category && !payload.catogries) {
            payload.catogries = payload.category;
        }
        const newProduct = await Product.create(payload);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Update product (Admin only)
router.put("/:id", Protect, adminOnly, async (req, res) => {
    try {
        const payload = { ...req.body };
        if (payload.category && !payload.catogries) {
            payload.catogries = payload.category;
        }
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            payload,
            { new: true, runValidators: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete product (Admin only)
router.delete("/:id", Protect, adminOnly, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({
            message: "Product is Deleted.",
            id: req.params.id
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;