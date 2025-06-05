const express = require("express");
const mongoose = require("mongoose");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const verifyToken = require("../middleware/auth");
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { photoOfUserModel } = require("../modelData/models");
const router = express.Router();

// config storage images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/');
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// api

router.get("/photosOfUser/:userId", verifyToken, async function(req, res) {
  const userId = req.params.userId;
  try {
    return res.json(await Photo.find({user_id: userId}));
  } catch (error) {
    console.log(error);
  }
})

router.post("/commentsOfPhoto/:photo_id", verifyToken, async function(req, res) {
  const photo_id = req.params.photo_id;
  const { user_id, comment } = req.body;
  try {
    if(!comment || !user_id){
      return res.status(400).json({message: "Bad Request"});
    }
    const photo =  await Photo.findById(photo_id);
    if(!photo){
      return res.status(400).json({message: "Bad Request"});
    }
    const newComment = {
      comment: comment,
      user_id: user_id,
    }
    photo.comments.push(newComment);
    await photo.save();
    return res.status(200).json({message: "Succeed"})
  } catch (error) {
    console.log(error);
  }
})
router.delete("/commentsOfPhoto/:commentId", async function (req, res) {
    const commentId = req.params.commentId;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        return res.status(400).send({ message: "Invalid comment ID" });
    }

    try {
        const result = await Photo.updateOne(
            { "comments._id": commentId },
            { $pull: { comments: { _id: commentId } } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).send({ message: "Comment not found" });
        }

        return res.status(200).send({ message: "Comment deleted" });
    } catch (error) {
        console.error("Delete failed:", error);
        return res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
});

router.post("/updatecommentsOfPhoto/:commentId",async function (req,res) {
  const slug=req.params.commentId;
  const { user_id, comment } = req.body;
  console.log()
   try {
           await Photo.updateOne(
            {"comments._id":slug},
            {$set:{comments: { comment:comment }}},
        );
        return res.status(200).send({message:"Edit suscess"})
    
   } catch (error) {
    
   }
})
router.post('/photos/new', verifyToken, upload.single('file'), async function(req, res){
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Bad Request' });
    }

    const newPhoto = new Photo({
      file_name: req.file.filename,
      createdAt: new Date(),
      user_id: req.user_id,
      comments: []

    });

    await newPhoto.save();
    return res.status(200).json({ message: 'Ảnh đã được thêm.', photo: newPhoto });
  } catch (error) {
    console.log(error);
  }
});


module.exports = router;