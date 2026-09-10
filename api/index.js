const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRouts = require("./Routes/authRouts");
const adminRoutes = require("./Routes/adminRoutes");
const productRoutes = require("./Routes/productRoutes");

const app = express();

// Ensure DB Connection
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error("Database connection error:", err.message);
        return res.status(500).json({
            message: "Database connection error. Please whitelist IP 0.0.0.0/0 in MongoDB Atlas Network Access.",
            error: err.message
        });
    }
});

// Configure CORS
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Routes mounted with /api prefix as well as direct prefix for Vercel rewrites
app.use("/api/auth", authRouts);
app.use("/auth", authRouts);

app.use("/api/admin", adminRoutes);
app.use("/admin", adminRoutes);

app.use("/api/products", productRoutes);
app.use("/products", productRoutes);

app.get("/api", (req, res) => {
    res.json({ message: "Backend API is running smoothly!" });
});

app.get("/", (req, res) => {
    res.json({ message: "Backend API is running smoothly!" });
});

module.exports = app;
