const express = require("express");
const mongoose = require("mongoose");
const User = require("../db/userModel");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const jwt = require('jsonwebtoken');
const secretKey = "ltw_spring_2025";

router.get("/list", verifyToken, async function(req, res){
  try {
    const users = await User.find();
    return res.json(users);
  } catch (error) {
    console.log(error);
  }
})

router.get("/:userId", verifyToken, async function(req, res){
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    console.log(error);
  }
})

router.post("/user", async function (req, res) {
   console.log("Dữ liệu nhận được:", req.body);
  const {
    login_name,
    password,
    repassword,
    first_name,
    last_name,
    location,
    description,
    occupation,
  } = req.body;

  if (!login_name || !password || !first_name || !last_name) {
    return res
      .status(400)
      .json({ message: "Missing required fields: login_name, password, first_name, last_name" });
  }

  // Kiểm tra password khớp nhau
  if (password !== repassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    // Kiểm tra login_name đã tồn tại chưa
    const userExists = await User.findOne({ login_name: login_name });
    console.log(userExists);
    if (userExists) {
      return res.status(400).json({ message: "Login name already exists" });
    }

    // Tạo user mới
    const user = new User({
      login_name,
      password,
      first_name,
      last_name,
      location,
      description,
      occupation,
    });

    await user.save();

    const user_id = user._id;

    // Tạo JWT token
    jwt.sign({ user_id }, secretKey, { expiresIn: "1h" }, (err, token) => {
      if (err) {
        console.error("Token generation failed:", err);
        return res.status(500).json({ message: "Failed to generate token" });
      }

      res.status(200).json({
        token,
        id: user_id,
        login_name,
      });
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;