const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  login_name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  location: { type: String },
  description: { type: String },
  occupation: { type: String },
});

// Đặt tên model là 'User' (đúng số ít, mặc định collection sẽ là 'users')
module.exports = mongoose.models.User || mongoose.model("User", userSchema);
