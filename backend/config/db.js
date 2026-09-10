const mongoose = require("mongoose");

let isConnected = 0;

const DEFAULT_ATLAS_URI = "mongodb+srv://hv0563163_db_user:97UaSHxzWwrZnrRc@cluster0.faf2mqx.mongodb.net/adminpanel?retryWrites=true&w=majority";

const connectDB = async () => {
    if (isConnected === 1) {
        return;
    }

    const mongoUri = process.env.MONGO_URI || process.env.atlas_URL || DEFAULT_ATLAS_URI;

    try {
        const db = await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000
        });
        isConnected = db.connections[0].readyState;
        console.log("MongoDB is connected successfully!");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        throw error;
    }
};

module.exports = connectDB;