const connectDB = require("../config/db");
const authRouter = require("../Routes/authRouts");

module.exports = async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    try {
        await connectDB();
    } catch (e) {}

    return authRouter.handleLogin(req, res);
};
