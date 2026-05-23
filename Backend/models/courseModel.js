import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  subtitle: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    default: "", // Image URL
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  educator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  lectures: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lecture",
  }],
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
}, { timestamps: true });

const Course = mongoose.model("Course", courseSchema);
export default Course;
