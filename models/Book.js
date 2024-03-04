const mongoose = require("mongoose");
// Mongoose-Objekt, MongoDB Datenbank (package required: npm i mongoose)

const { Schema } = mongoose;
// MongoDB-Dokument (Datenbank-Eintrag)

const bookSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String },
    released: { type: Number },
    available: { type: Number },
  },
  { versionKey: false }
);
// noteSchema = Eintrag in der Tabelle (collection) notes in der DB

const Book = mongoose.models.Book || mongoose.model("Book", bookSchema);
// model Note = collection notes in der DB. Neu erstellen wenn nicht vorhanden.

module.exports = Book;
