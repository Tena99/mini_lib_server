const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    books: [{ type: Schema.Types.ObjectId, ref: "book" }],
  },
  { versionKey: false }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
