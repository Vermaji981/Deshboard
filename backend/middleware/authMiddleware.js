const jwt = require("jsonwebtoken");

const Protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "No token provided"
            });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                message: "Token format invalid"
            });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET || "mysecretkey");
        req.user = decode;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid Token"
        });
    }
};

module.exports = Protect;