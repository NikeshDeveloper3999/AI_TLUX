import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

console.log(process.env.MONGODB_URL)

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("DB Connected Successfully")
    } catch (error) {
        console.log("DB Error" , error)
    }
}

export default connectDB