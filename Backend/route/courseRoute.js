import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {
  createCourse,
  updateCourse,
  deleteCourse,
  addLecture,
  updateLecture,
  deleteLecture,
  getAllCourses,
  getCourseDetails,
  enrollInCourse,
  getEducatorCourses,
  getStudentEnrolledCourses,
} from "../controller/courseController.js";

const router = express.Router();

// Public routes
router.get("/", getAllCourses);
router.get("/details/:courseId", getCourseDetails);

// Protected routes — specific paths before parameterized routes
router.get("/student/enrolled", protect, getStudentEnrolledCourses);
router.get("/educator/courses", protect, authorize("educator", "admin"), getEducatorCourses);
router.post("/enroll/:courseId", protect, enrollInCourse);

// Educator/Admin routes
router.post("/", protect, authorize("educator", "admin"), createCourse);
router.put("/:courseId", protect, authorize("educator", "admin"), updateCourse);
router.delete("/:courseId", protect, authorize("educator", "admin"), deleteCourse);

// Lecture routes
router.post("/:courseId/lectures", protect, authorize("educator", "admin"), addLecture);
router.put("/:courseId/lectures/:lectureId", protect, authorize("educator", "admin"), updateLecture);
router.delete("/:courseId/lectures/:lectureId", protect, authorize("educator", "admin"), deleteLecture);

export default router;
