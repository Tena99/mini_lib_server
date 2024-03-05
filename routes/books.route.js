const { Router } = require("express");
const connect = require("../lib/connect");
const Book = require("../models/Book");
const User = require("../models/User");
const r = Router({ mergeParams: true });

r.get("/", async (req, res) => {
  await connect();
  console.log("Looking up book list...");
  const books = await Book.find();
  console.log("Books found: ", books);
  if (!books.length) {
    return res.json({ message: "Books not found" });
  }
  return res.json(books);
});

r.get("/:id", async (req, res) => {
  await connect();
  const { id } = req.params;

  const book = await Book.findOne({ _id: id });
  if (!book) {
    return res.json({ message: "Book not found" });
  }
  return res.json(book);
});

r.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { user } = req.params;
  user = req.body.user;
  await connect();
  //   const userData = await User.findOne({ name: user });
  //   await User.updateOne(
  //     { _id: userData._id },
  //     { books: [...userData.books, id] }
  //   );
  //   const { available } = await Book.findOne({ _id: id });
  await User.findByIdAndUpdate({ books });
  if (available)
    await Book.updateOne({ _id: id }, { available: available - 1 });
});

r.delete("/:id", async (req, res) => {
  const { user, id } = req.params;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { userName: user },
      { $pull: { books: { _id: id } } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    res.send("Success");
  } catch (error) {
    console.error(error);

    if (error && error.message.includes("buffering timed out")) {
      res.status(500).send("Operation Timed Out");
    } else {
      res.status(500).send("Internal Server Error");
    }
  }
});

module.exports = r;
