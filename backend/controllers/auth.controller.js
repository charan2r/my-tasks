import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function generateToken(user) {
  return jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.exists({ email });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "Email is already registered.",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashedPassword });

  return res.status(201).json({
    success: true,
    message: "Registration successful.",
    data: {
      user: formatUser(user),
      token: generateToken(user),
    },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Login successful.",
    data: {
      user: formatUser(user),
      token: generateToken(user),
    },
  });
};

export const logout = (_req, res) => {
  return res.status(204).send();
};
