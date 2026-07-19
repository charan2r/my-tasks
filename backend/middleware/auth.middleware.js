import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authenticate = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Bearer token is missing.",
    });
  }

  const token = authorizationHeader.slice(7).trim();

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication token is missing.",
    });
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Authentication token has expired. Please log in again.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Authentication token is invalid.",
    });
  }

  const user = await User.findById(decoded.userId);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "The user associated with this token no longer exists.",
    });
  }

  req.user = user;
  next();
};
