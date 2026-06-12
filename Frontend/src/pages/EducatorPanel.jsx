import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { FaPlus, FaTrash, FaEdit, FaTimes, FaBook, FaList, FaPaperclip } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

function EducatorPanel() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editCourseId = searchParams.get("edit");

  // Course Details Form States
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [category, setCategory] = useState("Programming");
  const [price, setPrice] = useState(0);

  // General loading states
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Full course object when editing
  const [course, setCourse] = useState(null);

  // Lecture Form States (Modal/Inline)
  const [showLectureForm, setShowLectureForm] = useState(false);
  const [editLectureId, setEditLectureId] = useState(null);
  const [lectureTitle, setLectureTitle] = useState("");
  const [lectureDesc, setLectureDesc] = useState("");
  const [lectureVideo, setLectureVideo] = useState("");
  const [lectureDuration, setLectureDuration] = useState("");
  
  // Attachments state inside lecture
  const [attachments, setAttachments] = useState([]);
  const [newAttachName, setNewAttachName] = useState("");
  const [newAttachUrl, setNewAttachUrl] = useState("");

  const categories = [
    "Programming",
    "UI/UX Design",
    "Business & Marketing",
    "Photography & Media",
    "Web Development",
    "Data Science"
  ];

  // Fetch course details if in edit mode
  useEffect(() => {
    if (!editCourseId) {
      // Clear states if changing to creation mode
      setTitle("");
      setSubtitle("");
      setDescription("");
      setThumbnail("");
      setCategory("Programming");
      setPrice(0);
      setCourse(null);
      return;
    }

    const fetchCourseData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${serverUrl}/api/courses/details/${editCourseId}`);
        const c = res.data.course;
        setCourse(c);
        setTitle(c.title || "");
        setSubtitle(c.subtitle || "");
        setDescription(c.description || "");
        setThumbnail(c.thumbnail || "");
        setCategory(c.category || "Programming");
        setPrice(c.price || 0);
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load course details for editing");
        navigate("/dashboard");
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [editCourseId, navigate]);

  // Handle Course creation or update details
  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !category) {
      toast.error("Please fill in the required course details");
      return;
    }

    setSaveLoading(true);
    try {
      if (editCourseId) {
        // Update course details
        const res = await axios.put(
          `${serverUrl}/api/courses/${editCourseId}`,
          { title, subtitle, description, thumbnail, category, price },
          { withCredentials: true }
        );
        toast.success(res.data.message || "Course details updated!");
      } else {
        // Create new course
        const res = await axios.post(
          `${serverUrl}/api/courses`,
          { title, subtitle, description, thumbnail, category, price },
          { withCredentials: true }
        );
        toast.success("Course created successfully!");
        // Navigate to edit details panel of new course
        navigate(`/creator?edit=${res.data.course._id}`);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Operation failed. Please check parameters.");
    } finally {
      setSaveLoading(false);
    }
  };

  // Add attachment to list
  const handleAddAttachment = () => {
    if (!newAttachName || !newAttachUrl) {
      toast.error("Attachment name and URL are required");
      return;
    }
    setAttachments([...attachments, { name: newAttachName, url: newAttachUrl }]);
    setNewAttachName("");
    setNewAttachUrl("");
  };

  // Remove attachment from list
  const handleRemoveAttachment = (idx) => {
    setAttachments(attachments.filter((_, i) => i !== idx));
  };

  // Save or edit a Lecture
  const handleLectureSubmit = async (e) => {
    e.preventDefault();
    if (!lectureTitle || !lectureVideo) {
      toast.error("Lecture title and video URL are required");
      return;
    }

    setSaveLoading(true);
    try {
      if (editLectureId) {
        // Edit existing lecture
        const res = await axios.put(
          `${serverUrl}/api/courses/${editCourseId}/lectures/${editLectureId}`,
          {
            title: lectureTitle,
            description: lectureDesc,
            videoUrl: lectureVideo,
            duration: lectureDuration,
            attachments,
          },
          { withCredentials: true }
        );
        toast.success("Lecture updated successfully!");
        
        // Update local course details UI list
        setCourse({
          ...course,
          lectures: course.lectures.map((l) => (l._id === editLectureId ? res.data.lecture : l)),
        });
      } else {
        // Add new lecture
        const res = await axios.post(
          `${serverUrl}/api/courses/${editCourseId}/lectures`,
          {
            title: lectureTitle,
            description: lectureDesc,
            videoUrl: lectureVideo,
            duration: lectureDuration,
            attachments,
          },
          { withCredentials: true }
        );
        toast.success("Lecture added successfully!");
        
        // Push new lecture to list
        setCourse({
          ...course,
          lectures: [...(course.lectures || []), res.data.lecture],
        });
      }
      resetLectureForm();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save lecture module");
    } finally {
      setSaveLoading(false);
    }
  };

  // Reset lecture form inputs
  const resetLectureForm = () => {
    setShowLectureForm(false);
    setEditLectureId(null);
    setLectureTitle("");
    setLectureDesc("");
    setLectureVideo("");
    setLectureDuration("");
    setAttachments([]);
  };

  // Trigger editing values for a specific lecture
  const startEditLecture = (lecture) => {
    setEditLectureId(lecture._id);
    setLectureTitle(lecture.title || "");
    setLectureDesc(lecture.description || "");
    setLectureVideo(lecture.videoUrl || "");
    setLectureDuration(lecture.duration || "");
    setAttachments(lecture.attachments || []);
    setShowLectureForm(true);
  };

  // Delete lecture
  const handleDeleteLecture = async (lectureId) => {
    if (!window.confirm("Are you sure you want to delete this lecture?")) return;

    try {
      await axios.delete(`${serverUrl}/api/courses/${editCourseId}/lectures/${lectureId}`, {
        withCredentials: true,
      });
      toast.success("Lecture removed successfully");
      
      // Update UI list
      setCourse({
        ...course,
        lectures: course.lectures.filter((l) => l._id !== lectureId),
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete lecture");
    }
  };

  // Delete entire course
  const handleDeleteCourse = async () => {
    if (!window.confirm("CRITICAL WARNING: This will permanently delete this course and all uploaded lectures. Are you sure?")) return;

    try {
      await axios.delete(`${serverUrl}/api/courses/${editCourseId}`, {
        withCredentials: true,
      });
      toast.success("Course deleted successfully");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete course");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <ClipLoader color="#99e1d9" size={50} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Left Pane: Course Details Form */}
        <div className="w-full lg:w-3/5 bg-white border border-gray-100 p-8 rounded-3xl shadow-sm space-y-8 h-fit">
          <div>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-extrabold text-gray-900">
                {editCourseId ? "Edit Course Configurations" : "Create New Course Workspace"}
              </h2>
              {editCourseId && (
                <button
                  onClick={handleDeleteCourse}
                  className="bg-red-50 text-red-600 hover:bg-red-100 font-bold px-3 py-2 rounded-xl text-xs transition cursor-pointer"
                >
                  Delete Course
                </button>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">Configure parameters for display on search grids.</p>
          </div>

          <form onSubmit={handleCourseSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5 col-span-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Course Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Master React in 30 Days"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5 col-span-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Subtitle</label>
                <input
                  type="text"
                  placeholder="e.g. Hooks, Context, Redux, and Deployment strategies."
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5 col-span-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Description *</label>
                <textarea
                  placeholder="Provide a detailed roadmap of lessons, tools, and project specifications..."
                  value={description}
                  rows={4}
                  onChange={(e) => setDescription(e.target.value)}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm bg-white focus:outline-none"
                >
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Price ($) *</label>
                <input
                  type="number"
                  placeholder="0 (Free)"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5 col-span-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Thumbnail Image URL</label>
                <input
                  type="text"
                  placeholder="https://example.com/thumbnail.png"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saveLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl transition cursor-pointer"
            >
              {saveLoading ? <ClipLoader color="white" size={20} /> : editCourseId ? "Save Changes" : "Create & Add Modules"}
            </button>
          </form>
        </div>

        {/* Right Pane: Course Lectures list (only visible when course has been created) */}
        <div className="w-full lg:w-2/5 space-y-6">
          {!editCourseId ? (
            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-3xl p-12 text-center text-gray-400 space-y-3">
              <FaBook className="text-4xl mx-auto text-gray-300 animate-pulse" />
              <h3 className="font-bold text-gray-700 text-sm">Modules are currently locked</h3>
              <p className="text-[11px] max-w-[240px] mx-auto leading-relaxed">
                Save the course details on the left first to enable the lecture builder workspace.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-extrabold text-gray-900">Syllabus Builder</h2>
                <button
                  onClick={() => {
                    resetLectureForm();
                    setShowLectureForm(true);
                  }}
                  className="inline-flex items-center text-indigo-600 bg-indigo-50 hover:bg-indigo-100 font-bold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer"
                >
                  <FaPlus className="mr-1" />
                  Add Lecture
                </button>
              </div>

              {/* Lecture list */}
              <div className="space-y-3">
                {course?.lectures && course.lectures.length > 0 ? (
                  course.lectures.map((lec, index) => (
                    <div
                      key={lec._id}
                      className="p-4 bg-gray-50 hover:bg-indigo-50/20 border border-gray-100 rounded-2xl flex items-center justify-between group transition"
                    >
                      <div className="flex items-center space-x-3 overflow-hidden pr-4">
                        <div className="w-6 h-6 rounded-md bg-white border border-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                          {index + 1}
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="font-bold text-gray-800 text-xs truncate max-w-[150px] sm:max-w-[200px]">
                            {lec.title}
                          </h4>
                          <span className="text-[9px] text-gray-400 font-semibold">{lec.duration || "00:00"}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => startEditLecture(lec)}
                          className="p-1.5 hover:bg-white text-gray-500 hover:text-indigo-600 rounded-lg transition"
                        >
                          <FaEdit className="text-xs" />
                        </button>
                        <button
                          onClick={() => handleDeleteLecture(lec._id)}
                          className="p-1.5 hover:bg-white text-gray-500 hover:text-red-600 rounded-lg transition"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 bg-gray-50/50 border border-dashed border-gray-100 rounded-2xl text-center text-gray-400 text-xs">
                    No lectures uploaded to this syllabus yet.
                  </div>
                )}
              </div>

              {/* Add/Edit Lecture Overlay Form */}
              {showLectureForm && (
                <div className="pt-6 border-t border-gray-100 space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <h3 className="font-extrabold text-gray-900 text-sm">
                      {editLectureId ? "Edit Lecture Module" : "Configure New Lecture"}
                    </h3>
                    <button onClick={resetLectureForm} className="text-gray-400 hover:text-gray-600">
                      <FaTimes className="text-sm" />
                    </button>
                  </div>

                  <form onSubmit={handleLectureSubmit} className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">Lecture Title *</label>
                      <input
                        type="text"
                        placeholder="e.g. Introduction to JSX"
                        value={lectureTitle}
                        onChange={(e) => setLectureTitle(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">Lecture Notes / Description</label>
                      <textarea
                        placeholder="Topics discussed or summary instructions..."
                        value={lectureDesc}
                        rows={2}
                        onChange={(e) => setLectureDesc(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5 col-span-2">
                        <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">Video Source URL *</label>
                        <input
                          type="text"
                          placeholder="YouTube/Direct MP4 Link"
                          value={lectureVideo}
                          onChange={(e) => setLectureVideo(e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 col-span-2">
                        <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">Duration</label>
                        <input
                          type="text"
                          placeholder="e.g. 12:45"
                          value={lectureDuration}
                          onChange={(e) => setLectureDuration(e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                        />
                      </div>
                    </div>

                    {/* Lecture Attachments management */}
                    <div className="space-y-3 pt-3 border-t border-gray-50">
                      <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">Attachments</h4>
                      
                      {attachments.length > 0 && (
                        <div className="space-y-2">
                          {attachments.map((file, idx) => (
                            <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg border border-gray-100 text-[11px]">
                              <span className="font-semibold text-gray-700 truncate max-w-[200px]">{file.name}</span>
                              <button type="button" onClick={() => handleRemoveAttachment(idx)} className="text-red-500 hover:text-red-700">
                                <FaTimes />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="grid grid-cols-12 gap-2">
                        <input
                          type="text"
                          placeholder="Name (e.g. Slides)"
                          value={newAttachName}
                          onChange={(e) => setNewAttachName(e.target.value)}
                          className="col-span-4 px-2 py-1.5 border border-gray-200 rounded-lg text-[11px] focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="URL (e.g. link)"
                          value={newAttachUrl}
                          onChange={(e) => setNewAttachUrl(e.target.value)}
                          className="col-span-6 px-2 py-1.5 border border-gray-200 rounded-lg text-[11px] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleAddAttachment}
                          className="col-span-2 bg-gray-800 text-white rounded-lg flex items-center justify-center hover:bg-gray-900 transition text-[11px] font-bold cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={saveLoading}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl text-xs transition cursor-pointer"
                    >
                      {saveLoading ? <ClipLoader color="white" size={14} /> : editLectureId ? "Save Lecture" : "Upload Lecture"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EducatorPanel;
