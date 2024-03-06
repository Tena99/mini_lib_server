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
  const { id } = req.params;
  await connect();
  const book = await Book.findOne({ _id: id });
  console.log("book: ", book);
  if (!book) {
    return res.json({ message: "Book not found" });
  }
  return res.json(book);
});

r.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { user } = req.params;
  console.log("user: ", user);
  console.log("id: ", id);
  await connect();
  //decrement the number of available books, previous number is in document rentedBook
  const rentedBook = await Book.findByIdAndUpdate(
    id,
    {
      $inc: { available: -1 },
    },
    { returnDocument: "before" }
  );
  console.log("rentedBook: ", rentedBook);
  //rent book if it was available
  if (rentedBook.available) {
    //get user document (userData) to retrieve user's _id
    const userData = await User.findOne({ userName: user });
    console.log("userData: ", userData);
    //add book to user's rented book list
    await User.findByIdAndUpdate(userData["_id"], {
      $push: { books: id },
    });
    return res.status(200);
  } else {
    //in case available was 0 before, re-increment available to 0
    await Book.findByIdAndUpdate(id, {
      $inc: { available: 1 },
    });
    return res.status(400);
  }
});

r.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { user } = req.params;
  console.log("user: ", user);
  console.log("id: ", id);
  await connect();
  //increment the number of available books
  await Book.findByIdAndUpdate(id, {
    $inc: { available: 1 },
  });
  //get user document (userData) to retrieve user's _id
  const userData = await User.findOne({ userName: user });
  console.log("userData: ", userData);
  //remove book from user's rented book list
  await User.findByIdAndUpdate(userData["_id"], {
    $pull: { books: id },
  });
  return res.status(200);
});

module.exports = r;
