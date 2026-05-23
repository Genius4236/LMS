import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getCourseProgress, toggleLectureProgress } from "../controller/progressController.js";

const router = express.Router();

router.get("/:courseId", protect, getCourseProgress);
router.post("/:courseId/toggle", protect, toggleLectureProgress);

export default router;
