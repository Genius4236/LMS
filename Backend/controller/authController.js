import User from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import { generateToken } from "../config/token.js";
import { formatUser } from "../utils/formatUser.js";

const ALLOWED_ROLES = ["student", "educator", "admin"];

const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};





// export const signup = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     if (!name?.trim() || !email || !password) {
//       return res.status(400).json({ message: "Name, email, and password are required" });
//     }

//     const existUser = await User.findOne({ email: email.toLowerCase() });
//     if (existUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     if (!validator.isEmail(email)) {
//       return res.status(400).json({ message: "Invalid email" });
//     }

//     if (password.length < 6) {
//       return res.status(400).json({ message: "Password must be at least 6 characters" });
//     }

//     const userRole = ALLOWED_ROLES.includes(role) ? role : "student";
//     const hashPassword = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       name: name.trim(),
//       email: email.toLowerCase(),
//       password: hashPassword,
//       role: userRole,
//     });

//     const token = generateToken(user._id);
//     setAuthCookie(res, token);

//     return res.status(201).json({
//       message: "User created successfully",
//       user: formatUser(user),
//       token,
//     });
//   } catch (error) {
//     return res.status(500).json({ message: "Signup failed", error: error.message });
//   }
// };

// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: "Email and password are required" });
//     }

//     const user = await User.findOne({ email: email.toLowerCase() });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const token = generateToken(user._id);
//     setAuthCookie(res, token);

//     return res.status(200).json({
//       message: "Login successful",
//       user: formatUser(user),
//       token,
//     });
//   } catch (error) {
//     return res.status(500).json({ message: "Login failed", error: error.message });
//   }
// };

// export const logout = async (req, res) => {
//   try {
//     res.clearCookie("token");
//     return res.status(200).json({ message: "Logout successful" });
//   } catch (error) {
//     return res.status(500).json({ message: "Logout failed", error: error.message });
//   }
// };

// /** Return the currently authenticated user */
// export const getMe = async (req, res) => {
//   try {
//     return res.status(200).json({ user: formatUser(req.user) });
//   } catch (error) {
//     return res.status(500).json({ message: "Failed to fetch profile", error: error.message });
//   }
// };










export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name?.trim() || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // Double check that the User model isn't undefined due to import mapping
    if (!User) {
      return res.status(500).json({ message: "Database User model failed to initialize." });
    }

    const existUser = await User.findOne({ email: email.toLowerCase() });
    if (existUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const userRole = ALLOWED_ROLES.includes(role) ? role : "student";
    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashPassword,
      role: userRole,
    });

    const token = generateToken(user._id);
    
    // Try setting the cookie safely, but catch errors if it fails cross-domain
    try {
      setAuthCookie(res, token);
    } catch (cookieError) {
      console.error("Cookie setting failed:", cookieError.message);
    }

    return res.status(201).json({
      message: "User created successfully",
      user: formatUser(user),
      token, // Frontend can fall back to using this token in localStorage/headers
    });
  } catch (error) {
    // 🔥 TEMPORARY DIAGNOSTIC: Return the actual internal error object to your frontend console!
    return res.status(500).json({ 
      message: "Signup failed internal crash", 
      errorName: error.name,
      errorMessage: error.message 
    });
  }
};