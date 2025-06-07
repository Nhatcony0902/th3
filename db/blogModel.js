const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: String,
    user_id: mongoose.Schema.Types.ObjectId,
    description: String,
})

const Blog = mongoose.model("Blog", blogSchema, "blog");

module.exports = Blog;