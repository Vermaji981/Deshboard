const mongoose = require("mongoose");
const dns = require("dns");

let isConnected = 0;

const DEFAULT_ATLAS_URI = "mongodb+srv://hv0563163_db_user:97UaSHxzWwrZnrRc@cluster0.faf2mqx.mongodb.net/adminpanel?retryWrites=true&w=majority";

const connectDB = async () => {
    if (isConnected) {
        return;
    }

    const mongoUri = process.env.MONGO_URI || process.env.atlas_URL || DEFAULT_ATLAS_URI;

    try {
        const db = await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 10000
        });
        isConnected = db.connections[0].readyState;
        console.log("MongoDB is connected successfully!");
    } catch (error) {
        // Fallback for Windows local / Serverless DNS SRV lookup issues
        if (error.message.includes("querySrv") || error.message.includes("ECONNREFUSED")) {
            try {
                dns.setServers(["8.8.8.8", "1.1.1.1"]);
                const db = await mongoose.connect(mongoUri, {
                    serverSelectionTimeoutMS: 10000
                });
                isConnected = db.connections[0].readyState;
                console.log("MongoDB connected successfully via DNS fallback!");
                return;
            } catch (fallbackError) {
                console.error("MongoDB fallback connection error:", fallbackError.message);
            }
        }
        console.error("MongoDB connection error:", error.message);
    }
};

module.exports = connectDB;
