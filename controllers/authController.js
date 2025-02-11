const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

// User registration
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists." });
    }

    // Encrypt the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and store the new user
    const newUser = new User({ name, email, password: hashedPassword, role });
    const savedUser = await User.create(newUser);

    res.status(201).json({ userId: savedUser.id });
  } catch (error) {
    next(error);
  }
};

// User login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Validate the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Generate authentication token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};
