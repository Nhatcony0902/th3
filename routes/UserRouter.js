const express = require("express");
const User = require("../db/userModel");
const router = express.Router();

// GET /user/list - Trả về danh sách người dùng
router.get("/list", async (req, res) => {
  try {
    const users = await User.find({}, "_id first_name last_name");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send({ message: "Lỗi khi lấy danh sách người dùng", error: err });
  }
});

// GET /user/:id - Trả về thông tin chi tiết của người dùng theo _id
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "_id first_name last_name location description occupation"
    );
    if (!user) {
      return res.status(400).send({ message: "Không tìm thấy người dùng" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(400).send({ message: "ID người dùng không hợp lệ", error: err });
  }
});

module.exports = router;
