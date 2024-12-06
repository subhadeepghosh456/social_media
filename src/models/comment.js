const mongoose = require("mongoose");
const Post = require("../models/post");

const commentSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  postID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  commentText: {
    type: String,
    required: true,
  },
});

commentSchema.statics.calcTotalComments = async function (postID) {
  const stats = await this.aggregate([
    {
      $match: { postID },
    },
    {
      $group: {
        _id: "$postID",
        nComment: {
          $sum: 1,
        },
      },
    },
  ]);
  console.log(stats);
  await Post.findByIdAndUpdate(postID, {
    numComment: stats[0].nComment,
  });
};

commentSchema.post("save", async function () {
  await this.constructor.calcTotalComments(this.postID);
});

module.exports = mongoose.model("Comment", commentSchema);
