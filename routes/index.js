const { Router } = require("express");
const connect = require("../lib/connect");
const Book = require("../models/Book");
const User = require("../models/User");
const userRoute = require("./users.route");
const r = Router();

r.use("/:user", userRoute);

r.get("/", async (req, res) => {
  await connect();

  res.send("Something");
});

module.exports = r;
