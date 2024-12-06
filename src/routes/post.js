const express = require("express");
const { userAuth } = require("../middleware/auth");
const Post = require("../models/post");
const postRouter = express.Router();

postRouter.get("/get-post/:_id", async (req, res) => {
  try {
    const id = req.params._id;
    const post = await Post.findById(id);
    if (!post) {
      throw new Error("No post found!");
    }
    res.send(post);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

postRouter.post("/create-post", userAuth, async (req, res) => {
  try {
    const { title, description, imageURL } = req.body;
    if (!title && !description && !imageURL) {
      throw new Error("Sorry, this is not a valid post");
    }
    const loggedInUser = req.user._id;

    const newPost = new Post({
      user: loggedInUser,
      title,
      description,
      imageURL,
    });

    const createdPost = await newPost.save();
    res.send(createdPost);
  } catch (error) {
    res.status(400).send("Error in: " + error.message);
  }
});

postRouter.patch("/create-post/edit/:_id", userAuth, async (req, res) => {
  try {
    const id = req.params;
    if (req.body.user) {
      throw new Error("Unethical changes not allowed!!");
    }

    const post = await Post.findById(id);

    if (!post) {
      throw new Error("No post found associated with this ID!!");
    }

    Object.keys(req.body).forEach((key) => (post[key] = req.body[key]));
    const savedPost = await post.save();

    res.send(savedPost);
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

postRouter.delete("/create-post/delete/:_id", userAuth, async (req, res) => {
  try {
    const id = req.params;
    const post = await Post.findById(id);

    if (!post) {
      throw new Error("No post found associated with this ID!!");
    }

    if (post.user.toString() !== req.user._id.toString()) {
      throw new Error("You are not allowed to delete this!!");
    }
    await Post.findByIdAndDelete(id);

    res.send("Post deleted seccessfully!");
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = postRouter;
