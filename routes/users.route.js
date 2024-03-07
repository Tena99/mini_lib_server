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
  const users = await User.find({ userName: user }).populate("books");

  res.json(users);
});

r.post("/", async (req, res) => {
  await connect();

  const { user } = req.params;
  const exist = await User.findOne({ userName: user });
  if (!exist) {
    await User.addOne({ userName: user });

    res.json(res.status(200).send(`New user ${user} successfully added!`));
  } else {
    res.json(res.status(200).send(`Hello ${user}!`));
  }
});

module.exports = r;
