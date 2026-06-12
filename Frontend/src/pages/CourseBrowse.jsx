import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { FaSearch, FaBookOpen, FaUser } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

function CourseBrowse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");

  const categories = [
    "Programming",
    "UI/UX Design",
    "Business & Marketing",
    "Photography & Media",
    "Web Development",
    "Data Science"
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const catParam = selectedCategory ? `&category=${selectedCategory}` : "";
        const searchParam = searchQuery ? `&search=${searchQuery}` : "";
        const res = await axios.get(`${serverUrl}/api/courses?${catParam}${searchParam}`);
        setCourses(res.data.courses || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch courses");
        setLoading(false);
      }
    };

    fetchCourses();
  }, [selectedCategory, searchQuery]);

  const handleCategorySelect = (category) => {
    const newCategory = selectedCategory === category ? "" : category;
    setSelectedCategory(newCategory);
    if (newCategory) {
      searchParams.set("category", newCategory);
    } else {
      searchParams.delete("category");
    }
    setSearchParams(searchParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery) {
      searchParams.set("search", searchQuery);
    } else {
      searchParams.delete("search");
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Left Side: Sidebar Filters */}
        <aside className="w-full lg:w-1/4 space-y-8 bg-white border border-gray-100 p-6 rounded-2xl shadow-sm h-fit">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Search Courses</h2>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Find a topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              <FaSearch className="absolute left-3 top-3.5 text-gray-400 text-sm" />
            </form>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Categories</h2>
            <div className="space-y-2">
              <button
                onClick={() => handleCategorySelect("")}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold transition ${
                  selectedCategory === ""
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                All Categories
              </button>
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCategorySelect(cat)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold transition ${
                    selectedCategory === cat
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Side: Main Course Grid */}
        <section className="flex-grow">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <ClipLoader color="#99e1d9" size={40} />
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 text-center">
              {error}
            </div>
          ) : courses.length === 0 ? (
            <div className="bg-white border border-gray-100 p-12 rounded-3xl text-center shadow-sm">
              <FaBookOpen className="text-5xl text-gray-300 mx-auto mb-4 animate-bounce" />
              <h3 className="text-xl font-bold text-gray-800">No Courses Found</h3>
              <p className="text-gray-500 mt-2">
                We couldn't find any courses matching your criteria. Try adjusting your filters or search query.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-gray-500">
                  Showing {courses.length} courses
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div
                    key={course._id}
                    className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden hover:shadow-md hover:border-transparent transition-all duration-300 flex flex-col h-full group"
                  >
                    {/* Thumbnail */}
                    <div className="h-44 bg-gradient-to-br from-indigo-100 to-pink-50 relative overflow-hidden flex items-center justify-center">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <FaBookOpen className="text-5xl text-indigo-400 opacity-60" />
                      )}
                      <span className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm text-indigo-800 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-sm">
                        {course.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[9px] font-bold text-indigo-600">
                            {course.educator?.name?.charAt(0) || <FaUser />}
                          </div>
                          <span className="text-xs text-gray-500 font-semibold truncate max-w-[150px]">
                            {course.educator?.name || "Anonymous"}
                          </span>
                        </div>
                        <h3 className="font-extrabold text-gray-900 leading-snug group-hover:text-indigo-600 transition truncate-2-lines h-12">
                          {course.title}
                        </h3>
                        <p className="text-xs text-gray-400 line-clamp-2">
                          {course.subtitle || course.description}
                        </p>
                      </div>

                      <div className="pt-6 mt-6 border-t border-gray-50 flex items-center justify-between">
                        <span className="text-lg font-black text-gray-900">
                          {course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`}
                        </span>
                        <Link
                          to={`/courses/${course._id}`}
                          className="bg-indigo-50 text-indigo-600 text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-300"
                        >
                          View Syllabus
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default CourseBrowse;
