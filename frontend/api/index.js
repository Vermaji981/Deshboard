const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRouts = require("./Routes/authRouts");
const adminRoutes = require("./Routes/adminRoutes");
const productRoutes = require("./Routes/productRoutes");

const app = express();

// Configure CORS for all origins and headers
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Quick 200 response for OPTIONS preflight
app.options("*", (req, res) => {
    res.sendStatus(200);
});

// Non-blocking DB Connection middleware
app.use(async (req, res, next) => {
    if (req.method === "OPTIONS") {
        return next();
    }
    try {
        await connectDB();
    } catch (err) {
        console.warn("DB Connection warning:", err.message);
    }
    next();
});

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
