import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/connectdb.js";
import cookieParser from "cookie-parser";
import authRouter from "../route/authRoute.js";
import courseRouter from "../route/courseRoute.js";
import progressRouter from "../route/progressRoute.js";
import cors from "cors";
import { notFound, errorHandler } from "../middleware/errorMiddleware.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;
const CLIENT_URL = "https://lms-zora.vercel.app" || "http://localhost:5173"; // Synced to match your CORS allowance

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// 👉 CRITICAL VERCEL FIX: Connect to DB on incoming requests if not already connected
app.use(async (req, res, next) => {
  try {
    // If mongoose is already connected, skip calling connectDB to save time
    if (mongoose.connection.readyState >= 1) {
      return next();
    }
    await connectDB();
    next();
  } catch (error) {
    console.error("Database initialization failed:", error);
    res.status(500).json({ message: "Internal Database Connection Error" });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Zora API" });
});

app.use("/api/auth", authRouter);
app.use("/api/courses", courseRouter);
app.use("/api/progress", progressRouter);

app.get("/", (req, res) => {
  res.json({ message: "Zora API is running", docs: "/api/health" });
});

app.use(notFound);
app.use(errorHandler);

// Kept purely for your local development terminal environment ('npm run dev')
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Zora API listening locally on port ${port}`);
  });
}

export default app;