const { Router } = require("express");
const connect = require("../lib/connect");
const Book = require("../models/Book");
const User = require("../models/User");
const booksRoute = require("./books.route");
const r = Router({ mergeParams: true });

r.use("/books", booksRoute);

r.get("/", async (req, res) => {
  await connect();

  const { user } = req.params;
  const users = await User.find({ userName: user });

  res.json(users);
});

module.exports = r;
