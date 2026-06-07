import Progress from "../models/progressModel.js";
import Course from "../models/courseModel.js";
import { arrayIncludesId } from "../utils/objectId.js";

// Get course progress for a student
export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user._id;

    let progress = await Progress.findOne({ student: studentId, course: courseId });

    if (!progress) {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      if (!arrayIncludesId(course.enrolledStudents, studentId)) {
        return res.status(403).json({ message: "You are not enrolled in this course" });
      }

      progress = await Progress.create({
        student: studentId,
        course: courseId,
        completedLectures: [],
      });
    }

    return res.status(200).json({ progress });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch progress", error: error.message });
  }
};

// Toggle lecture completion progress
export const toggleLectureProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { lectureId } = req.body;
    const studentId = req.user._id;

    if (!lectureId) {
      return res.status(400).json({ message: "Lecture ID is required" });
    }

    let progress = await Progress.findOne({ student: studentId, course: courseId });

    if (!progress) {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      if (!arrayIncludesId(course.enrolledStudents, studentId)) {
        return res.status(403).json({ message: "You are not enrolled in this course" });
      }

      progress = new Progress({
        student: studentId,
        course: courseId,
        completedLectures: [],
      });
    }

    const isCompleted = arrayIncludesId(progress.completedLectures, lectureId);

    if (isCompleted) {
      progress.completedLectures = progress.completedLectures.filter(
        (id) => String(id) !== String(lectureId)
      );
    } else {
      progress.completedLectures.push(lectureId);
    }

    await progress.save();
    return res.status(200).json({
      message: isCompleted ? "Lecture marked in-complete" : "Lecture marked complete",
      progress,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update progress", error: error.message });
  }
};
