const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path"); // Thêm module path
const fs = require("fs"); // Thêm module fs để kiểm tra thư mục
const dbConnect = require("./db/dbConnect");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
// const CommentRouter = require("./routes/CommentRouter");

dbConnect();

app.use(cors());
app.use(express.json());
app.use("/api/user", UserRouter);
app.use("/api/photo", PhotoRouter);

// Kiểm tra và phục vụ file ảnh tĩnh từ thư mục public/images
const imagesPath = path.join(__dirname, "public/images");
if (!fs.existsSync(imagesPath)) {
  console.warn(`Thư mục ${imagesPath} không tồn tại. Vui lòng tạo thư mục và thêm file ảnh.`);
} else {
  app.use("/images", express.static(imagesPath));
  console.log(`Đang phục vụ file ảnh từ ${imagesPath}`);
}

app.get("/", (request, response) => {
  response.send({ message: "Hello from photo-sharing app API!" });
});

app.listen(8081, () => {
  console.log("server listening on port 8081");
});