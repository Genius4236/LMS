import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { FaGraduationCap, FaArrowLeft, FaCheckCircle, FaRegCircle, FaDownload, FaVideo } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

function CoursePlayer() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [currentLectureIdx, setCurrentLectureIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progressUpdating, setProgressUpdating] = useState(false);

  useEffect(() => {
    const fetchClassroomData = async () => {
      setLoading(true);
      try {
        // Fetch course details
        const courseRes = await axios.get(`${serverUrl}/api/courses/details/${courseId}`);
        setCourse(courseRes.data.course);

        // Fetch student progress
        const progressRes = await axios.get(`${serverUrl}/api/progress/${courseId}`, {
          withCredentials: true,
        });
        setProgress(progressRes.data.progress);
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load classroom content. Please make sure you are enrolled.");
        navigate(`/courses/${courseId}`);
        setLoading(false);
      }
    };
    fetchClassroomData();
  }, [courseId, navigate]);

  const handleToggleComplete = async (lectureId) => {
    setProgressUpdating(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/progress/${courseId}/toggle`,
        { lectureId },
        { withCredentials: true }
      );
      setProgress(res.data.progress);
      toast.success(res.data.message || "Progress updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update progress status");
    } finally {
      setProgressUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <ClipLoader color="#99e1d9" size={50} />
      </div>
    );
  }

  if (!course || !course.lectures || course.lectures.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 font-sans">No Lectures Uploaded</h2>
        <p className="text-gray-500">This course does not have any lecture content yet.</p>
        <Link to={`/courses/${courseId}`} className="text-indigo-600 font-semibold inline-block">
          Return to details
        </Link>
      </div>
    );
  }

  const activeLecture = course.lectures[currentLectureIdx];

  // Helper to check if URL is YouTube and get Embed URL
  const getEmbedUrl = (url) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0`;
    }
    return "";
  };

  const embedUrl = getEmbedUrl(activeLecture?.videoUrl);
  const completedList = progress?.completedLectures || [];
  const percentComplete = Math.round((completedList.length / course.lectures.length) * 100) || 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row">
      {/* Left side: Main Video Player & Details */}
      <div className="flex-grow lg:w-3/4 flex flex-col p-4 md:p-8 space-y-6">
        
        {/* Breadcrumb Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <Link
            to={`/courses/${courseId}`}
            className="flex items-center text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <FaArrowLeft className="mr-2" />
            Exit Classroom
          </Link>
          <span className="text-xs bg-indigo-500/20 text-indigo-300 font-bold px-3 py-1 rounded-full border border-indigo-500/30">
            {percentComplete}% Complete ({completedList.length}/{course.lectures.length})
          </span>
        </div>

        {/* Video Wrapper (16:9 Aspect Ratio) */}
        <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={activeLecture.title}
              className="w-full h-full border-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : activeLecture?.videoUrl ? (
            <video
              src={activeLecture.videoUrl}
              controls
              className="w-full h-full object-cover"
              autoPlay
            ></video>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <FaVideo className="text-5xl mb-4" />
              <p>No video source found for this lecture</p>
            </div>
          )}
        </div>

        {/* Course Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-2">
          <div
            className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${percentComplete}%` }}
          ></div>
        </div>

        {/* Active Lecture Details */}
        <div className="space-y-4 bg-slate-900 border border-slate-800/80 p-6 rounded-3xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">
                Module {currentLectureIdx + 1}
              </span>
              <h2 className="text-2xl font-black text-white mt-1">{activeLecture?.title}</h2>
            </div>
            <button
              onClick={() => handleToggleComplete(activeLecture._id)}
              disabled={progressUpdating}
              className={`flex items-center justify-center space-x-2 text-sm font-bold px-5 py-3 rounded-2xl transition cursor-pointer ${
                completedList.includes(activeLecture._id)
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {completedList.includes(activeLecture._id) ? (
                <>
                  <FaCheckCircle className="text-white" />
                  <span>Mark Incomplete</span>
                </>
              ) : (
                <>
                  <FaRegCircle />
                  <span>Mark Complete</span>
                </>
              )}
            </button>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            {activeLecture?.description || "No lecture notes or descriptions have been added to this module."}
          </p>

          {/* Attachments Section */}
          {activeLecture?.attachments && activeLecture.attachments.length > 0 && (
            <div className="pt-6 border-t border-slate-800 space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                Resource Downloads
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeLecture.attachments.map((file, idx) => (
                  <a
                    key={idx}
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3.5 bg-slate-950/60 hover:bg-indigo-950/30 border border-slate-800 hover:border-indigo-500/30 rounded-xl transition group"
                  >
                    <span className="text-xs font-bold text-slate-300 group-hover:text-indigo-400 truncate max-w-[180px]">
                      {file.name}
                    </span>
                    <FaDownload className="text-slate-500 group-hover:text-indigo-400 text-xs" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right side: Playlist Sidebar */}
      <div className="w-full lg:w-1/4 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 p-6 flex flex-col space-y-6">
        <div>
          <h3 className="text-lg font-black text-white">Course Syllabus</h3>
          <p className="text-xs text-slate-500 mt-1 truncate">{course.title}</p>
        </div>

        <div className="flex-grow space-y-3 overflow-y-auto max-h-[50vh] lg:max-h-[70vh]">
          {course.lectures.map((lecture, idx) => {
            const isLectureCompleted = completedList.includes(lecture._id);
            const isLectureActive = idx === currentLectureIdx;

            return (
              <div
                key={lecture._id}
                className={`flex items-start justify-between p-4 rounded-2xl border transition group ${
                  isLectureActive
                    ? "bg-indigo-950/40 border-indigo-500 text-white"
                    : "bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-400"
                }`}
              >
                {/* Checkbox button */}
                <button
                  onClick={() => handleToggleComplete(lecture._id)}
                  disabled={progressUpdating}
                  className="mr-3 mt-1 focus:outline-none text-base cursor-pointer"
                >
                  {isLectureCompleted ? (
                    <FaCheckCircle className="text-indigo-500" />
                  ) : (
                    <FaRegCircle className="text-slate-600 hover:text-indigo-400" />
                  )}
                </button>

                {/* Title & info click triggers play */}
                <div
                  className="flex-grow cursor-pointer"
                  onClick={() => setCurrentLectureIdx(idx)}
                >
                  <h4
                    className={`text-xs font-bold leading-tight group-hover:text-white transition ${
                      isLectureActive ? "text-indigo-400" : ""
                    }`}
                  >
                    {idx + 1}. {lecture.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-1 font-semibold">
                    {lecture.duration || "00:00"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CoursePlayer;
