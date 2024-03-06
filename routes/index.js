const { Router } = require("express");
const connect = require("../lib/connect");
const userRoute = require("./users.route");
const r = Router();

r.use("/:user", userRoute);

r.get("/", async (req, res) => {
  await connect();

  res.json({ message: "Welcome to our server!" });
});

module.exports = r;
