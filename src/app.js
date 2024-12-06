const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const postRouter = require("./routes/post");
const commentRouter = require("./routes/comment");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", postRouter);
app.use("/", commentRouter);

connectDB()
  .then(() => {
    console.log("DB Connection Successfull");

    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((e) => {
    console.log("DB Connection error:", e);
  });
