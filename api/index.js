const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRouts = require("./Routes/authRouts");
const adminRoutes = require("./Routes/adminRoutes");
const productRoutes = require("./Routes/productRoutes");

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Non-blocking DB Connection middleware
app.use(async (req, res, next) => {
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    try {
        await connectDB();
    } catch (err) {
        console.warn("DB Connection warning:", err.message);
    }
    next();
});

// Explicit endpoint handlers
app.post("/api/auth/register", authRouts.handleRegister);
app.post("/api/auth/login", authRouts.handleLogin);
app.post("/api/register", authRouts.handleRegister);
app.post("/api/login", authRouts.handleLogin);

app.post("/auth/register", authRouts.handleRegister);
app.post("/auth/login", authRouts.handleLogin);
app.post("/register", authRouts.handleRegister);
app.post("/login", authRouts.handleLogin);

app.use("/api/auth", authRouts);
app.use("/auth", authRouts);
app.use("/api/admin", adminRoutes);
app.use("/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/products", productRoutes);

app.use("/api", authRouts);
app.use("/", authRouts);

app.get("/api", (req, res) => {
    res.json({ message: "Backend API V100 CLEAN!" });
});

app.get("/", (req, res) => {
    res.json({ message: "Backend API V100 CLEAN!" });
});

module.exports = app;
