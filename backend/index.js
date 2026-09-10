const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

const connectDB = require("./config/db");
const authRouts = require("./Routes/authRouts");
const adminRoutes = require("./Routes/adminRoutes");
const productRoutes = require("./Routes/productRoutes");

// Configure CORS for all origins and headers
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));


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

// Direct explicit route handlers for auth endpoints
app.post("/api/auth/register", authRouts.handleRegister);
app.post("/api/auth/login", authRouts.handleLogin);
app.post("/api/register", authRouts.handleRegister);
app.post("/api/login", authRouts.handleLogin);

app.post("/auth/register", authRouts.handleRegister);
app.post("/auth/login", authRouts.handleLogin);
app.post("/register", authRouts.handleRegister);
app.post("/login", authRouts.handleLogin);

// Routes mounted with /api prefix as well as direct prefix for Vercel rewrites
app.use("/api/auth", authRouts);
app.use("/auth", authRouts);
app.use("/api/admin", adminRoutes);
app.use("/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/products", productRoutes);

// Mount authRouts on /api and / so /api/login and /api/register match directly
app.use("/api", authRouts);
app.use("/", authRouts);

app.get("/api/which-file", (req, res) => {
    res.json({ file: "backend/index.js", url: req.url, originalUrl: req.originalUrl, path: req.path });
});

app.get("/api", (req, res) => {
    res.json({ message: "Backend API is running smoothly!" });
});

app.get("/", (req, res) => {
    res.json({ message: "Backend API is running smoothly!" });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server started on PORT ${PORT}`);
    });
}

module.exports = app;