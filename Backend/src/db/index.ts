import mongoose from "mongoose";
import { DB_NAME } from "../constants";
import { Listing } from "../models/listing.model";

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in the environment variables');
        }

        const connectionInstance = await mongoose.connect(process.env.MONGO_URI, {
            dbName: DB_NAME
        });
        
        console.log(`MongoDB connected successfully! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MOngoDB Connection error", error);
        process.exit(1);
    }
}

export default connectDB;