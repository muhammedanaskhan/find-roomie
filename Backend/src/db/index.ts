import mongoose from "mongoose";
import { DB_NAME } from "../constants";

const connectDB = async() => {
    try{
        const connectionInstance =  await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log("MondoDB connected successfully!")
    }catch(error){
        console.log("MOngoDB Connection error", error);
        process.exit(1);
    }
}

export default connectDB;