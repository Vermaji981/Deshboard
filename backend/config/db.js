const mongoose = require("mongoose");

let isConnected = false;

const DIRECT_SEEDLIST_URI = "mongodb://hv0563163_db_user:97UaSHxzWwrZnrRc@ac-fvgbbcn-shard-00-00.faf2mqx.mongodb.net:27017,ac-fvgbbcn-shard-00-01.faf2mqx.mongodb.net:27017,ac-fvgbbcn-shard-00-02.faf2mqx.mongodb.net:27017/adminpanel?ssl=true&replicaSet=atlas-13w085-shard-0&authSource=admin&retryWrites=true&w=majority";

const connectDB = async () => {
    if (isConnected) {
        return true;
    }

    const mongoUri = process.env.MONGO_URI || process.env.atlas_URL || DIRECT_SEEDLIST_URI;

    try {
        const db = await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 2500
        });
        isConnected = true;
        console.log("MongoDB connected successfully!");
        return true;
    } catch (error) {
        console.warn("MongoDB connection warning:", error.message);
        isConnected = false;
        return false;
    }
};

module.exports = connectDB;