import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/connectdb.js";
import cookieParser from "cookie-parser";
import authRouter from "./route/authRoute.js";
import courseRouter from "./route/courseRoute.js";
import progressRouter from "./route/progressRoute.js";
import cors from "cors";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const port = process.env.port || 8000;
const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
const CLIENT_URL = (process.env.CLIENT_URL || "https://zora-mu.vercel.app").replace(/\/+$/, "");

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

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

app.listen(port, () => {
  console.log(`Zora API listening on port ${port}`);
  connectDB();
});
