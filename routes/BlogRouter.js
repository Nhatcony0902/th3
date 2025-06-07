const express = require("express");
const mongoose = require("mongoose");
const Blog = require("../db/blogModel");

const router = express.Router();

// Lấy các blog theo userId
router.get("/:userId", async function (req, res) {
  const userId = req.params.userId;
  try {
    const blogs = await Blog.find({ user_id: userId });
    return res.json({ blogs: blogs });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error retrieving blogs" });
  }
});

// Tạo blog mới cho userId
router.post("/:userId", async function (req, res) {
  const userId = req.params.userId;
  const { title, description } = req.body;

  try {
    const newBlog = new Blog({
      title,
      description,
      user_id: userId
    });

    await newBlog.save();
    return res.status(200).json({ message: "Succeed", blog: newBlog });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error creating blog" });
  }
});

module.exports = router;
