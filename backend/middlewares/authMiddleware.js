import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// @desc    Protect Routes
// @access  Private
export const protect = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. No token found.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-key');
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    req.user = user;

    if (typeof next === 'function') {
      return next();
    }

    return res.status(500).json({
      success: false,
      message: "Server middleware error.",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. Invalid or expired token.",
    });
  }
};

// @desc    Admin Authorization
// @access  Private/Admin
export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated.",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only.",
    });
  }

  if (typeof next === 'function') {
    return next();
  }

  return res.status(500).json({
    success: false,
    message: "Server middleware error.",
  });
};