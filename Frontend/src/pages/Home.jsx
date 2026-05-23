import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaCode, FaPaintBrush, FaChartLine, FaCamera, FaLaptopCode, FaDatabase } from "react-icons/fa";

function Home() {
  const categories = [
    { name: "Programming", icon: <FaCode className="text-indigo-600" />, count: "120+ Courses", color: "bg-indigo-50 border-indigo-100" },
    { name: "UI/UX Design", icon: <FaPaintBrush className="text-pink-600" />, count: "85+ Courses", color: "bg-pink-50 border-pink-100" },
    { name: "Business & Marketing", icon: <FaChartLine className="text-emerald-600" />, count: "95+ Courses", color: "bg-emerald-50 border-emerald-100" },
    { name: "Photography & Media", icon: <FaCamera className="text-amber-600" />, count: "40+ Courses", color: "bg-amber-50 border-amber-100" },
    { name: "Web Development", icon: <FaLaptopCode className="text-sky-600" />, count: "150+ Courses", color: "bg-sky-50 border-sky-100" },
    { name: "Data Science", icon: <FaDatabase className="text-violet-600" />, count: "70+ Courses", color: "bg-violet-50 border-violet-100" },
  ];

  return (
    <div className="space-y-24 pb-20 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-br from-indigo-50 via-white to-pink-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-800 animate-pulse">
                {/* New! Interactive Learning Experience */}
              </span>
              <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight leading-none">
                Master New Skills with{" "}
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Interactive Classes
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                AegisLMS provides a gorgeous learning experience. Browse expert-led video lectures, track your milestones, and build real projects.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4">
                <Link
                  to="/courses"
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-indigo-600 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Explore Catalog
                  <FaArrowRight className="ml-2 text-sm" />
                </Link>
                <Link
                  to="/signup"
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-white border border-gray-200 text-gray-800 font-bold px-8 py-4 rounded-2xl shadow-sm hover:bg-gray-50 transition-all duration-300"
                >
                  Join as Student
                </Link>
              </div>
              {/* Trust Indicators */}
              <div className="pt-6 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
                <div>
                  <p className="text-3xl font-extrabold text-indigo-600">15k+</p>
                  <p className="text-xs text-gray-500 font-medium">Students enrolled</p>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-indigo-600">200+</p>
                  <p className="text-xs text-gray-500 font-medium">Premium courses</p>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-indigo-600">99.8%</p>
                  <p className="text-xs text-gray-500 font-medium">Success rating</p>
                </div>
              </div>
            </div>

            {/* Right Graphics (Glassmorphic Mockup) */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-300 to-pink-300 rounded-full blur-3xl opacity-20 transform scale-110"></div>
              <div className="relative bg-white/40 backdrop-blur-xl border border-white/60 shadow-2xl p-6 rounded-3xl w-full max-w-sm sm:max-w-md transform hover:rotate-2 hover:scale-105 transition-all duration-500">
                <div className="h-44 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-black opacity-10"></div>
                  <FaCode className="text-7xl opacity-90 animate-bounce" />
                  <span className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
                    JavaScript Mastery
                  </span>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                      Web Development
                    </span>
                    <span className="text-xs text-gray-500">12 Lectures</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-gray-900">
                    Full-Stack Javascript Sandbox
                  </h3>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-xs">
                      MK
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-700">Khizer Md</p>
                      <p className="text-[10px] text-gray-400">Senior Dev Educator</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xl font-black text-gray-900">$49.00</span>
                    <button className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-indigo-700 transition">
                      View Course
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Explore Top Categories
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            Find structured paths taught by qualified educators to kickstart your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <Link
              to={`/courses?category=${cat.name}`}
              key={idx}
              className={`p-6 rounded-2xl border flex items-center space-x-4 hover:shadow-lg hover:border-transparent transition-all duration-300 group ${cat.color}`}
            >
              <div className="p-4 bg-white rounded-xl text-2xl shadow-sm group-hover:scale-110 transition duration-300">
                {cat.icon}
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 group-hover:text-indigo-600 transition">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">{cat.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Instructor Showcase Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-indigo-900 rounded-3xl text-white p-8 md:p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 transform translate-x-20 -translate-y-20 w-80 h-80 bg-indigo-800 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 transform -translate-x-20 translate-y-20 w-80 h-80 bg-pink-800 rounded-full blur-3xl opacity-20"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-6">
              <h2 className="text-3xl sm:text-5xl font-black leading-tight">
                Are you an educator? Share your knowledge.
              </h2>
              <p className="text-indigo-200 text-lg max-w-xl">
                AegisLMS allows instructors to build rich classes with high-fidelity video playlists, assignments, and detailed learning panels.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/signup?role=educator"
                  className="bg-white text-indigo-900 font-bold px-6 py-3.5 rounded-xl shadow-md hover:bg-indigo-50 transition"
                >
                  Create Educator Account
                </Link>
                <Link
                  to="/courses"
                  className="border border-indigo-400 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-indigo-800 transition"
                >
                  View Existing Courses
                </Link>
              </div>
            </div>
            <div className="lg:col-span-4 hidden lg:flex justify-end">
              <div className="w-56 h-56 bg-indigo-800/80 border border-indigo-700/50 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold">
                    🚀
                  </div>
                  <span className="text-xs bg-indigo-500 px-2 py-0.5 rounded font-medium">
                    New Era
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm">Instructor Panel</h4>
                  <p className="text-[11px] text-indigo-300 mt-1">
                    Manage students, track course revenue, and edit lectures in real time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;