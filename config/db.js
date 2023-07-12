import mongoose from "mongoose";

const connectDB = async () =>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Successfully connect to MongoDB ${conn.connection.host}`);
    }catch(error){
        console.log(`Error in Connecting MongoDB ${error}`);
    }
};

export default connectDB;