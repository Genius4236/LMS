import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  videoUrl: {
    type: String,
    required: true, // We'll support video URL directly (YouTube, Vimeo, direct mp4, etc.)
  },
  duration: {
    type: String, // e.g. "12:34" or "45 mins"
    default: "",
  },
  attachments: [{
    name: String,
    url: String,
  }],
}, { timestamps: true });

const Lecture = mongoose.model("Lecture", lectureSchema);
export default Lecture;
