const mongoose = require("mongoose");
const validator = require("validator");

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      minLength: 1,
    },
    description: {
      type: String,
      minLength: 1,
    },
    numComment: {
      type: Number,
      default: 0,
    },
    imageURL: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Image URL not valid!!");
        }
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
