import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.mongodb_uri);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  }
};

export default connectDB;