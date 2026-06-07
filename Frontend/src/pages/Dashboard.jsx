import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { FaGraduationCap, FaPlus, FaBookOpen, FaUserCircle, FaCheckCircle, FaUsers, FaChartBar, FaTag } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Student specific state
  const [studentCourses, setStudentCourses] = useState([]);
  const [courseProgress, setCourseProgress] = useState({});

  // Educator specific state
  const [educatorCourses, setEducatorCourses] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        if (user.role === "educator") {
          // Fetch educator's created courses
          const res = await axios.get(`${serverUrl}/api/courses/educator/courses`, {
            withCredentials: true,
          });
          setEducatorCourses(res.data.courses || []);
        } else {
          // Fetch all courses to filter enrolled ones
          const res = await axios.get(`${serverUrl}/api/courses`);
          const allCourses = res.data.courses || [];
          
          // Filter courses the student has enrolled in
          const enrolled = allCourses.filter(
            (c) =>
              user.enrolledCourses?.includes(c._id) ||
              c.enrolledStudents?.includes(user._id)
          );
          setStudentCourses(enrolled);

          // Fetch progress for each enrolled course in parallel
          const progressPromises = enrolled.map(async (c) => {
            try {
              const pRes = await axios.get(`${serverUrl}/api/progress/${c._id}`, {
                withCredentials: true,
              });
              return { courseId: c._id, progress: pRes.data.progress };
            } catch (err) {
              return { courseId: c._id, progress: { completedLectures: [] } };
            }
          });

          const progressResults = await Promise.all(progressPromises);
          const progressMap = {};
          progressResults.forEach((r) => {
            progressMap[r.courseId] = r.progress;
          });
          setCourseProgress(progressMap);
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load dashboard statistics");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <ClipLoader color="#4F46E5" size={50} />
      </div>
    );
  }

  // --- STUDENT DASHBOARD ---
  const renderStudentView = () => {
    return (
      <div className="space-y-12">
        {/* Profile Card & Info */}
        <div className="bg-white border border-gray-100 p-6 md:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-600 text-2xl uppercase">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Welcome back, {user.name}!</h1>
              <p className="text-sm text-gray-500 font-medium">Ready to continue your learning journey?</p>
            </div>
          </div>
          <div className="flex space-x-6 text-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-8">
            <div>
              <p className="text-2xl font-black text-indigo-600">{studentCourses.length}</p>
              <p className="text-xs text-gray-400 font-semibold uppercase mt-0.5">Enrolled</p>
            </div>
          </div>
        </div>

        {/* Enrolled Courses Grid */}
        <div className="space-y-6">
          <h2 className="text-xl font-extrabold text-gray-950">Active Courses</h2>
          {studentCourses.length === 0 ? (
            <div className="bg-white border border-gray-100 p-12 rounded-3xl text-center space-y-4 shadow-sm">
              <FaBookOpen className="text-5xl text-gray-300 mx-auto" />
              <h3 className="text-lg font-bold text-gray-800">No Courses Registered</h3>
              <p className="text-gray-500 max-w-sm mx-auto text-sm">
                You haven't enrolled in any courses yet. Browse our catalog and start learning now!
              </p>
              <Link
                to="/courses"
                className="inline-flex items-center bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700 transition text-sm shadow-md shadow-indigo-100"
              >
                Explore Catalog
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studentCourses.map((course) => {
                const prog = courseProgress[course._id];
                const completedCount = prog?.completedLectures?.length || 0;
                const totalModules = course.lectures?.length || 0;
                const percent = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

                return (
                  <div
                    key={course._id}
                    className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition"
                  >
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] bg-indigo-50 text-indigo-600 font-extrabold px-2 py-0.5 rounded-full uppercase">
                          {course.category}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold">
                          {completedCount}/{totalModules} lectures complete
                        </span>
                      </div>
                      <h3 className="font-extrabold text-gray-900 group-hover:text-indigo-600 transition truncate-2-lines h-12">
                        {course.title}
                      </h3>
                      {/* Progress bar */}
                      <div className="space-y-1">
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div
                            className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                        <p className="text-[10px] text-right font-bold text-gray-500">{percent}% Complete</p>
                      </div>
                    </div>
                    <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs text-gray-500 truncate max-w-[130px] font-semibold">
                        Instructor: {course.educator?.name || "Anonymous"}
                      </span>
                      <Link
                        to={`/classroom/${course._id}`}
                        className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
                      >
                        Resume Learning
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  // --- EDUCATOR DASHBOARD ---
  const renderEducatorView = () => {
    // Basic stats math
    const totalEnrollments = educatorCourses.reduce((acc, c) => acc + (c.enrolledStudents?.length || 0), 0);
    const averageCoursePrice =
      educatorCourses.length > 0
        ? (educatorCourses.reduce((acc, c) => acc + (c.price || 0), 0) / educatorCourses.length).toFixed(2)
        : 0;

    return (
      <div className="space-y-12">
        {/* Creator analytics panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Welcome Info */}
          <div className="bg-indigo-900 text-white p-6 rounded-3xl shadow-sm flex flex-col justify-between col-span-1 sm:col-span-2">
            <div>
              <h2 className="text-2xl font-black">Creator Studio</h2>
              <p className="text-xs text-indigo-200 mt-1">
                Manage your syllabus, analyze course metrics, and build lectures.
              </p>
            </div>
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-indigo-800">
              <span className="text-xs font-semibold">Educator: {user.name}</span>
              <span className="text-[10px] bg-indigo-500 px-2 py-0.5 rounded font-extrabold uppercase">
                Creator
              </span>
            </div>
          </div>

          {/* Stat Item */}
          <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm flex items-center space-x-4">
            <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 text-2xl">
              <FaUsers />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{totalEnrollments}</p>
              <p className="text-xs text-gray-400 font-semibold uppercase">Total Enrollments</p>
            </div>
          </div>

          {/* Stat Item */}
          <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm flex items-center space-x-4">
            <div className="p-4 bg-amber-50 rounded-2xl text-amber-600 text-2xl">
              <FaBookOpen />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{educatorCourses.length}</p>
              <p className="text-xs text-gray-400 font-semibold uppercase">Total Courses</p>
            </div>
          </div>
        </div>

        {/* Course management catalog */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-extrabold text-gray-950">Your Created Courses</h2>
            <Link
              to="/creator"
              className="inline-flex items-center bg-indigo-600 text-white font-bold px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition text-xs shadow-md shadow-indigo-100"
            >
              <FaPlus className="mr-1.5" />
              Build Course
            </Link>
          </div>

          {educatorCourses.length === 0 ? (
            <div className="bg-white border border-gray-100 p-12 rounded-3xl text-center space-y-4 shadow-sm">
              <FaBookOpen className="text-5xl text-gray-300 mx-auto" />
              <h3 className="text-lg font-bold text-gray-800">No Courses Built</h3>
              <p className="text-gray-500 max-w-sm mx-auto text-sm">
                Get started as a content creator on Zora! Build modules and configure learning playlist items.
              </p>
              <Link
                to="/creator"
                className="inline-flex items-center bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700 transition text-sm cursor-pointer shadow-md shadow-indigo-100"
              >
                Create First Course
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {educatorCourses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] bg-indigo-50 text-indigo-600 font-extrabold px-2 py-0.5 rounded-full uppercase">
                        {course.category}
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold">
                        {course.lectures?.length || 0} Lectures
                      </span>
                    </div>
                    <h3 className="font-extrabold text-gray-900 group-hover:text-indigo-600 transition truncate-2-lines h-12">
                      {course.title}
                    </h3>
                    <div className="flex justify-between text-xs text-gray-500 font-medium">
                      <span>Enrollments: <strong>{course.enrolledStudents?.length || 0}</strong></span>
                      <span>Price: <strong>${course.price || "Free"}</strong></span>
                    </div>
                  </div>
                  <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-4">
                    <Link
                      to={`/classroom/${course._id}`}
                      className="w-1/2 text-center bg-white border border-gray-200 text-gray-700 text-xs font-semibold py-2 px-3 rounded-xl hover:bg-gray-50 transition"
                    >
                      Pre-view
                    </Link>
                    <Link
                      to={`/creator?edit=${course._id}`}
                      className="w-1/2 text-center bg-indigo-600 text-white text-xs font-bold py-2 px-3 rounded-xl hover:bg-indigo-700 transition"
                    >
                      Configure
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {user.role === "educator" ? renderEducatorView() : renderStudentView()}
    </div>
  );
}

export default Dashboard;
