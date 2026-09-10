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

app.use((req, res, next) => {
    if (req.path === "/echo" || req.url.includes("echo")) {
        return res.json({
            url: req.url,
            originalUrl: req.originalUrl,
            baseUrl: req.baseUrl,
            path: req.path,
            method: req.method,
            headers: req.headers
        });
    }
    next();
});

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

app.get("/api", (req, res) => {
    res.json({ message: "Backend API is running smoothly!" });
});

app.get("/", (req, res) => {
    res.json({ message: "Backend API is running smoothly!" });
});

// Catch-all to inspect unmatched requests
app.use((req, res) => {
    res.json({
        debug: "Catch-All Hit",
        method: req.method,
        url: req.url,
        originalUrl: req.originalUrl,
        path: req.path
    });
});

module.exports = (req, res) => {
    return app(req, res);
};
