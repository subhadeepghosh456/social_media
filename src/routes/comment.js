const express = require("express");
const { userAuth } = require("../middleware/auth");
const Comment = require("../models/comment");
const Post = require("../models/post");
const commentRouter = express.Router();

commentRouter.post("/post/add-comment/:post_id", userAuth, async (req, res) => {
  try {
    const userID = req.user._id;
    const postID = req.params.post_id;
    const { commentText } = req.body;

    // console.log(userID);

    if (!postID) {
      throw new Error("PostID is missing!");
    }

    if (!(await Post.findById({ _id: postID }))) {
      throw new Error("No post found!");
    }

    if (!commentText) {
      throw new Error("Write some thing about this post!");
    }

    const newComment = new Comment({
      userID,
      postID,
      commentText,
    });

    const savedComment = await newComment.save();

    res.send(savedComment);
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

commentRouter.patch(
  "/post/edit-comment/:comment_id",
  userAuth,
  async (req, res) => {
    try {
      const commentID = req.params.comment_id;
      const comment = await Comment.findById({ _id: commentID });

      if (!comment) {
        throw new Error("No comment found with this ID!");
      }
      if (comment.userID.toString() !== req.user._id.toString()) {
        throw new Error("You can not edit others comment");
      }
      Object.keys(req.body).forEach((key) => (comment[key] = req.body[key]));
      const updatedComment = await comment.save();

      res.send(updatedComment);
    } catch (error) {
      res.status(400).send("ERROR: " + error.message);
    }
  }
);

commentRouter.delete(
  "/post/delete-comment/:commentID",
  userAuth,
  async (req, res) => {
    try {
      const { commentID } = req.params;
      const loggedInUserID = req.user._id;
      const savedComment = await Comment.findById({ _id: commentID });

      if (!savedComment) {
        throw new Error("No comment found associated with this ID!");
      }

      if (savedComment.userID.toString() !== loggedInUserID.toString()) {
        throw new Error("Deletion not possible!");
      }

      const postID = savedComment.postID;

      // console.log(postID);

      const savedPost = await Post.findById({ _id: postID });
      savedPost.numComment = savedPost.numComment - 1;
      await savedPost.save();

      await Comment.findByIdAndDelete({ _id: commentID });

      res.send("Comment deleted!!");
    } catch (error) {
      res.status(400).send("ERROR: " + error.message);
    }
  }
);

commentRouter.get("/get/post-comments/:postID", async (req, res) => {
  try {
    const { postID } = req.params;
    if (!postID) {
      throw new Error("Please provide a postID!!");
    }
    const allPost = await Comment.find({ postID: postID });
    if (!allPost.length) {
      throw new Error("No comment found!");
    }

    res.send(allPost);
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = commentRouter;
