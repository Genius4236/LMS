import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import CourseBrowse from "./pages/CourseBrowse";
import CourseDetail from "./pages/CourseDetail";
import CoursePlayer from "./pages/CoursePlayer";
import Dashboard from "./pages/Dashboard";
import EducatorPanel from "./pages/EducatorPanel";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const serverUrl = import.meta.env.SERVER_URL || "http://localhost:8000" || "https://lmsbackend-flame.vercel.app";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 antialiased font-sans">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/courses" element={<CourseBrowse />} />
          <Route path="/courses/:courseId" element={<CourseDetail />} />

          {/* Protected Routes - All Roles */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/classroom/:courseId"
            element={
              <ProtectedRoute>
                <CoursePlayer />
              </ProtectedRoute>
            }
          />

          {/* Educator/Admin only */}
          <Route
            path="/creator"
            element={
              <ProtectedRoute allowedRoles={["educator", "admin"]}>
                <EducatorPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
}

export default App;