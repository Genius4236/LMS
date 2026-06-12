import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { updateProfile } from "../store/authSlice.js";
import { FaGraduationCap, FaUser, FaClock, FaTags, FaPlay } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrollLoading, setEnrollLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${serverUrl}/api/courses/details/${courseId}`);
        setCourse(res.data.course);
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load course details");
        setLoading(false);
      }
    };
    fetchDetails();
  }, [courseId]);

  const handleEnroll = async () => {
    if (!user) {
      toast.info("Please log in to enroll in this course.");
      navigate("/login");
      return;
    }

    setEnrollLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/courses/enroll/${courseId}`,
        {},
        { withCredentials: true }
      );
      toast.success(res.data.message || "Enrolled successfully!");
      
      // Update user enrolledCourses list in redux
      const updatedEnrolledCourses = [...(user.enrolledCourses || []), courseId];
      dispatch(updateProfile({ enrolledCourses: updatedEnrolledCourses }));

      // Redirect to course classroom player
      navigate(`/classroom/${courseId}`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Enrollment failed. Please try again.");
    } finally {
      setEnrollLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <ClipLoader color="#499e1d9" size={50} />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Course Not Found</h2>
        <Link to="/courses" className="text-indigo-600 font-semibold mt-4 inline-block">
          Return to catalog
        </Link>
      </div>
    );
  }

  const isEnrolled =
    user?.enrolledCourses?.includes(courseId) ||
    course.enrolledStudents?.includes(user?._id) ||
    course.educator?._id === user?._id;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Course Hero banner */}
      <section className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-widest">
                {course.category}
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                {course.title}
              </h1>
              <p className="text-lg text-slate-300 max-w-3xl leading-relaxed">
                {course.subtitle || "Master the core principles of this syllabus with comprehensive modules and assignments."}
              </p>
              
              <div className="flex flex-wrap gap-6 items-center text-sm text-slate-400">
                <div className="flex items-center space-x-2">
                  <FaUser className="text-indigo-400" />
                  <span className="font-semibold text-slate-200">
                    By {course.educator?.name || "Anonymous Educator"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaClock className="text-indigo-400" />
                  <span>{course.lectures?.length || 0} Modules</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaTags className="text-indigo-400" />
                  <span className="capitalize">{course.price === 0 ? "Free Access" : `$${course.price}`}</span>
                </div>
              </div>
            </div>

            {/* Right Card / CTA (Desktop float) */}
            <div className="lg:col-span-4 bg-white text-gray-800 p-8 rounded-3xl shadow-2xl border border-gray-100/10 space-y-6">
              <div className="h-48 bg-gradient-to-br from-indigo-100 to-pink-50 rounded-2xl relative overflow-hidden flex items-center justify-center shadow-inner">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <FaGraduationCap className="text-6xl text-indigo-600 opacity-80 animate-pulse" />
                )}
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Course Price</span>
                <span className="text-3xl font-black text-gray-900">
                  {course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`}
                </span>
              </div>

              {isEnrolled ? (
                <Link
                  to={`/classroom/${courseId}`}
                  className="w-full flex items-center justify-center bg-emerald-600 text-white font-extrabold py-4 px-6 rounded-2xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition"
                >
                  Enter Classroom
                  <FaPlay className="ml-2 text-xs" />
                </Link>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrollLoading}
                  className="w-full flex items-center justify-center bg-indigo-600 text-white font-extrabold py-4 px-6 rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition cursor-pointer"
                >
                  {enrollLoading ? (
                    <ClipLoader color="white" size={24} />
                  ) : user ? (
                    "Enroll Now"
                  ) : (
                    "Login to Enroll"
                  )}
                </button>
              )}
              <p className="text-[11px] text-gray-400 text-center font-medium">
                Instant access. Complete lifetime course outline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Course Curriculum & About */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left pane: Description & Syllabus */}
        <div className="lg:col-span-8 space-y-12 bg-white border border-gray-100 p-8 rounded-3xl shadow-sm">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4">About this Course</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{course.description}</p>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Course Curriculum</h2>
            {course.lectures && course.lectures.length > 0 ? (
              <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-100">
                {course.lectures.map((lecture, index) => (
                  <div
                    key={lecture._id}
                    className="flex items-center justify-between p-5 hover:bg-indigo-50/20 transition group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-xs font-bold text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm group-hover:text-indigo-600 transition">
                          {lecture.title}
                        </h4>
                        <p className="text-xs text-gray-400 truncate max-w-sm sm:max-w-md">
                          {lecture.description || "No description provided"}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 font-semibold">
                      {lecture.duration || "00:00"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 bg-gray-50 border border-dashed border-gray-200 rounded-2xl text-center text-gray-500">
                No modules uploaded yet. Keep checking back!
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Instructor Bio */}
        <div className="lg:col-span-4 bg-white border border-gray-100 p-8 rounded-3xl shadow-sm space-y-6 h-fit">
          <h3 className="text-lg font-bold text-gray-900">Your Instructor</h3>
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-600 text-lg uppercase ring-4 ring-indigo-50">
              {course.educator?.name?.charAt(0) || <FaUser />}
            </div>
            <div>
              <h4 className="font-extrabold text-gray-900 text-base">
                {course.educator?.name || "Anonymous"}
              </h4>
              <p className="text-xs text-gray-400">Educator Platform Partner</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            {course.educator?.description ||
              "This educator is dedicated to providing high-quality lectures and sandbox projects."}
          </p>
        </div>
      </section>
    </div>
  );
}

export default CourseDetail;
