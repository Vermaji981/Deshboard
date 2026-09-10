const express = require("express");
const cors = require("cors");

let app;

try {
    app = require("../backend/index.js");
} catch (err) {
    console.error("Failed to load backend server:", err);
    const errApp = express();
    errApp.use(cors());
    errApp.use(express.json());
    errApp.all("*", (req, res) => {
        res.status(500).json({
            error: "Backend Server Initialization Error",
            message: err.message,
            stack: err.stack
        });
    });
    app = errApp;
}

module.exports = app;
