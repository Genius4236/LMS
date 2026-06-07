import express from "express";
import { signup, login, logout, getMe } from "../controller/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/logout", logout);
authRouter.get("/me", protect, getMe);

export default authRouter;
