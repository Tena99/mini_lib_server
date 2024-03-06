const { Router } = require("express");
const connect = require("../lib/connect");
const Book = require("../models/Book");
const User = require("../models/User");
const r = Router({ mergeParams: true });
const mongoose = require("mongoose");

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
  await connect();
  const { user, id } = req.params;
  //We initiate the rent process by decrementing the number available,
  //so no one else can rent this book after our rent process started.
  const rentedBook = await Book.findByIdAndUpdate(
    id,
    {
      $inc: { available: -1 },
    },
    { returnDocument: "before" }
  );
  console.log("rentedBook: ", rentedBook);
  //From the decrement procedure, we get the previous number rentedBook.available.
  //If this is greater than 0, we can rent:
  if (rentedBook.available) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { userName: user },
        { $push: { books: id } },
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
  } else {
    //If rentedBook.available was 0 before the decrement, the rent was not performed
    //so we have to reverse our decrement action:
    await Book.findByIdAndUpdate(id, {
      $inc: { available: 1 },
    });
    return res.status(400).send("Book is not available");
  }
});

r.delete("/:id", async (req, res) => {
  await connect();
  const { user, id } = req.params;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { userName: user },
      { $pull: { books: id } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    await Book.findByIdAndUpdate(id, {
      $inc: { available: 1 },
    });

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
