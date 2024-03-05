const { Router } = require("express");
const connect = require("../lib/connect");
const Book = require("../models/Book");
const User = require("../models/User");
const r = Router({ mergeParams: true });

get("/", async (req, res) => {
  await connect();
  console.log("Looking up book list...");
  const books = await Book.find();
  console.log("Books found: ", books);
  if (!books.length) {
    return res.json({ message: "Book not found" });
  }
  return res.json(books);
});

get("/:id", async (req, res) => {
  const { id } = req.params;
  await connect();
  const book = await Book.findOne({ _id: id });
  if (book) {
    return res.json({ message: "Book not found" });
  }
  return res.json(book);
});

put("/:id", async (req, res) => {
  const { id } = req.params;
  const { user } = req.params;
  await connect();
  const userData = await User.findOne({ name: user });
  await User.updateOne(
    { _id: userData._id },
    { books: [...userData.books, id] }
  );
  const { available } = await Book.findOne({ _id: id });
  if (available)
    await Book.updateOne({ _id: id }, { available: available - 1 });
});

module.exports = r;
