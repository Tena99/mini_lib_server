const { Router } = require("express");
const connect = require("../lib/connect");
const Book = require("../models/Book");
const User = require("../models/User");
const r = Router({ mergeParams: true });

r.get("/", async (req, res) => {
  await connect();

  const { user } = req.params;
  const users = await User.find({ userName: user });

  res.json(users);
});

module.exports = r;
