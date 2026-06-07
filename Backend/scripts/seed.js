/**
 * Optional demo seed: creates sample educator, student, course, and lectures.
 * Run: npm run seed
 */
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import Course from "../models/courseModel.js";
import Lecture from "../models/lectureModel.js";

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.mongodb_uri);
  console.log("Connected to MongoDB");

  await Promise.all([User.deleteMany({}), Course.deleteMany({}), Lecture.deleteMany({})]);

  const educator = await User.create({
    name: "Demo Educator",
    email: "educator@demo.com",
    password: await bcrypt.hash("demo123", 10),
    role: "educator",
    description: "Full-stack instructor with 10+ years of experience.",
  });

  const student = await User.create({
    name: "Demo Student",
    email: "student@demo.com",
    password: await bcrypt.hash("demo123", 10),
    role: "student",
  });

  const lecture1 = await Lecture.create({
    title: "Welcome & Course Overview",
    description: "Introduction to the LMS platform and course goals.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: "8:30",
  });

  const lecture2 = await Lecture.create({
    title: "Setting Up Your Environment",
    description: "Install tools and configure your workspace.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: "15:00",
    attachments: [{ name: "Setup Checklist", url: "https://example.com/checklist.pdf" }],
  });

  const course = await Course.create({
    title: "Introduction to Web Development",
    subtitle: "HTML, CSS, JavaScript fundamentals for beginners",
    description:
      "Learn the foundations of modern web development. Build responsive pages, understand the DOM, and ship your first project.",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
    category: "Web Development",
    price: 0,
    educator: educator._id,
    lectures: [lecture1._id, lecture2._id],
  });

  console.log("\nSeed complete!\n");
  console.log("Educator: educator@demo.com / demo123");
  console.log("Student:  student@demo.com / demo123");
  console.log(`Course:   ${course.title} (${course._id})\n`);

  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
