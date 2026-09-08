const mongoose = require("mongoose");

const connectDB = async() =>{
    try{
        await mongoose.connect(process.env.MONGO_URI);

        console.log("Mongo DB is connected")
    }

    catch(error){
        console.log("Mongo Db is not connected with Backend", error.message);
        process.exit(1);
    }
};
module.exports = connectDB;