import React from "react";
import { Link } from "react-router-dom";
import { FaGraduationCap, FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-white font-bold text-xl">
              <div className="bg-indigo-600 p-2 rounded-xl">
                <FaGraduationCap className="text-xl text-white" />
              </div>
              <span className="bg-gradient-to-r from-indigo-400 to-indigo-300 bg-clip-text text-transparent">
                Zora
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-sm">
              Discover a premium, interactive learning experience. Learn from global creators or share your skills with the world.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-indigo-400 transition duration-200">
                <FaTwitter className="text-xl" />
              </a>
              <a href="#" className="hover:text-indigo-400 transition duration-200">
                <FaGithub className="text-xl" />
              </a>
              <a href="#" className="hover:text-indigo-400 transition duration-200">
                <FaLinkedin className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Explore
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/courses" className="hover:text-indigo-400 transition duration-200">
                  All Courses
                </Link>
              </li>
              <li>
                <Link to="/signup?role=educator" className="hover:text-indigo-400 transition duration-200">
                  Become a Creator
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-indigo-400 transition duration-200">
                  Student Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Policy */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-indigo-400 transition duration-200">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400 transition duration-200">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400 transition duration-200">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Zora. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
