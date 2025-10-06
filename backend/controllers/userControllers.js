const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate a JWT token
const generateToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

// @desc Register a new user
// @route POST /api/users
// @access Public

const signupUser = async (req, res) => {
  const { name, username, password, phone_number, profilePicture, gender, date_of_birth, role, address } = req.body;
  try {
    if (
      !name ||
      !username ||
      !password ||
      !phone_number ||
      !gender ||
      !date_of_birth ||
      !role ||
      !address ||
      !address.street ||
      !address.city ||
      !address.state ||
      !address.zipCode
    ) {
      return res.status(400).json({ message: "Please add all fields" });
    }
    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create user
    const user = await User.create({ name, username, password: hashedPassword, phone_number, profilePicture, gender, date_of_birth, role, address });

    if (user) {
      const token = generateToken(user._id);
      return res.status(201).json({ name, username, token });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user._id);
      res.status(200).json({ name: user.name, username, token });
    } else {
      res.status(400);
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    return res.status(400).json({ message: error.message || "Invalid credentials" });
  }
};

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private

const getMe = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(400);
    throw new Error("Invalid credentials");
  }
};

module.exports = {
  signupUser,
  loginUser,
  getMe,
};