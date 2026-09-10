const express = require("express");
const cors = require("cors");
const authRouter = require("../Routes/authRouts");
const connectDB = require("../config/db");

const app = express();
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"] }));
app.use(express.json());

app.use(async (req, res, next) => {
    if (req.method === "OPTIONS") return res.sendStatus(200);
    try { await connectDB(); } catch(e) {}
    next();
});

app.use(authRouter.handleLogin);

module.exports = (req, res) => {
    return app(req, res);
};
