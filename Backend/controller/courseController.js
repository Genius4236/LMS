import Course from "../models/courseModel.js";
import Lecture from "../models/lectureModel.js";
import User from "../models/userModel.js";
import Progress from "../models/progressModel.js";
import { arrayIncludesId } from "../utils/objectId.js";

// Create Course (Educator)
export const createCourse = async (req, res) => {
  try {
    const { title, subtitle, description, thumbnail, category, price } = req.body;
    const educator = req.user._id;

    if (!title || !description || !category) {
      return res.status(400).json({ message: "Title, description, and category are required." });
    }

    const course = await Course.create({
      title,
      subtitle,
      description,
      thumbnail,
      category,
      price: price || 0,
      educator,
    });

    return res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    return res.status(500).json({ message: "Course creation failed", error: error.message });
  }
};

// Update Course (Educator)
export const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, subtitle, description, thumbnail, category, price } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Verify ownership
    if (course.educator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this course" });
    }

    course.title = title || course.title;
    course.subtitle = subtitle || course.subtitle;
    course.description = description || course.description;
    course.thumbnail = thumbnail || course.thumbnail;
    course.category = category || course.category;
    course.price = price !== undefined ? price : course.price;

    await course.save();
    return res.status(200).json({ message: "Course updated successfully", course });
  } catch (error) {
    return res.status(500).json({ message: "Course update failed", error: error.message });
  }
};

// Delete Course (Educator)
export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Verify ownership
    if (course.educator.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this course" });
    }

    // Delete all lectures of this course
    if (course.lectures && course.lectures.length > 0) {
      await Lecture.deleteMany({ _id: { $in: course.lectures } });
    }

    // Delete progress documents associated with this course
    await Progress.deleteMany({ course: courseId });

    await Course.findByIdAndDelete(courseId);
    return res.status(200).json({ message: "Course and associated lectures deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Course deletion failed", error: error.message });
  }
};

// Add Lecture to Course (Educator)
export const addLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, videoUrl, duration, attachments } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.educator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to add lectures to this course" });
    }

    if (!title || !videoUrl) {
      return res.status(400).json({ message: "Lecture title and video URL are required" });
    }

    const lecture = await Lecture.create({
      title,
      description,
      videoUrl,
      duration,
      attachments: attachments || [],
    });

    course.lectures.push(lecture._id);
    await course.save();

    return res.status(201).json({ message: "Lecture added successfully", lecture, course });
  } catch (error) {
    return res.status(500).json({ message: "Adding lecture failed", error: error.message });
  }
};

// Edit Lecture (Educator)
export const updateLecture = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const { title, description, videoUrl, duration, attachments } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.educator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit lectures on this course" });
    }

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    lecture.title = title || lecture.title;
    lecture.description = description || lecture.description;
    lecture.videoUrl = videoUrl || lecture.videoUrl;
    lecture.duration = duration || lecture.duration;
    lecture.attachments = attachments || lecture.attachments;

    await lecture.save();
    return res.status(200).json({ message: "Lecture updated successfully", lecture });
  } catch (error) {
    return res.status(500).json({ message: "Lecture update failed", error: error.message });
  }
};

// Delete Lecture (Educator)
export const deleteLecture = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.educator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete lectures from this course" });
    }

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    await Lecture.findByIdAndDelete(lectureId);
    course.lectures = course.lectures.filter(id => id.toString() !== lectureId);
    await course.save();

    // Also pull from completedLectures in Progress documents
    await Progress.updateMany(
      { course: courseId },
      { $pull: { completedLectures: lectureId } }
    );

    return res.status(200).json({ message: "Lecture deleted successfully", course });
  } catch (error) {
    return res.status(500).json({ message: "Lecture deletion failed", error: error.message });
  }
};

// Get All Courses (Public with search & filter)
export const getAllCourses = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { subtitle: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const courses = await Course.find(query)
      .populate("educator", "name photoUrl description")
      .populate("lectures", "title duration"); // only load basic details for browse listings

    return res.status(200).json({ courses });
  } catch (error) {
    return res.status(500).json({ message: "Fetching courses failed", error: error.message });
  }
};

// Get Course Details
export const getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId)
      .populate("educator", "name photoUrl description email")
      .populate("lectures");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json({ course });
  } catch (error) {
    return res.status(500).json({ message: "Fetching course details failed", error: error.message });
  }
};

// Enroll in Course (Student)
export const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (arrayIncludesId(course.enrolledStudents, studentId)) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    // Add student to course
    course.enrolledStudents.push(studentId);
    await course.save();

    // Add course to student
    const student = await User.findById(studentId);
    student.enrolledCourses.push(courseId);
    await student.save();

    let progress = await Progress.findOne({ student: studentId, course: courseId });
    if (!progress) {
      progress = await Progress.create({
        student: studentId,
        course: courseId,
        completedLectures: [],
      });
    }

    return res.status(200).json({
      message: "Enrolled in course successfully",
      course,
      progress,
    });
  } catch (error) {
    return res.status(500).json({ message: "Enrollment failed", error: error.message });
  }
};

// Get courses the logged-in student is enrolled in
export const getStudentEnrolledCourses = async (req, res) => {
  try {
    const student = await User.findById(req.user._id).populate({
      path: "enrolledCourses",
      populate: [
        { path: "educator", select: "name photoUrl description" },
        { path: "lectures", select: "title duration" },
      ],
    });

    return res.status(200).json({ courses: student?.enrolledCourses || [] });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load enrolled courses", error: error.message });
  }
};

// Get Educator's Created Courses
export const getEducatorCourses = async (req, res) => {
  try {
    const educatorId = req.user._id;
    const courses = await Course.find({ educator: educatorId })
      .populate("lectures")
      .populate("enrolledStudents", "name email");
    return res.status(200).json({ courses });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load creator courses", error: error.message });
  }
};
