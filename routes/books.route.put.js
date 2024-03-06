const { Router } = require("express");
const connect = require("../lib/connect");
const Book = require("../models/Book");
const User = require("../models/User");
const r = Router({ mergeParams: true });

r.put("/:id", async (req, res) => {
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
