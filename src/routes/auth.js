const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validate } = require("../utils/validation");

authRouter.post("/signup", async (req, res) => {
  try {
    validate(req);
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    const savedUser = await user.save();
    const token = await user.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    });
    let userSend = savedUser;
    userSend.password = undefined;
    res.send(userSend);
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user || !(await user.validatePassword(password))) {
      throw new Error("Invalid Credentials");
    }

    if (await user.validatePassword(password)) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      });
      let userSend = user;
      userSend.password = undefined;
      res.send(userSend);
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });
    res.send("Logout successfull!!");
  } catch (error) {}
});
module.exports = authRouter;
