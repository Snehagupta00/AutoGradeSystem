const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const router = express.Router();

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }
    res
      .status(200)
      .json({ _id: user._id, fullname: user.fullname, email: user.email });
  } catch (error) {
    res.status(500).json({ msg: "Login failed" });
  }
});

// Register route
router.post("/register", async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ msg: "Email already in use" });

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);
    const newUser = await User.create({ fullname, email, password: hashPass });
    res.status(201).json({
      _id: newUser._id,
      fullname: newUser.fullname,
      email: newUser.email,
    });
  } catch (error) {
    res.status(500).json({ msg: "Registration failed" });
  }
});

module.exports = router;
