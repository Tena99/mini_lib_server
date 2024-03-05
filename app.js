require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const Book = require("./models/Book");
const User = require("./models/User");
const index = require("./routes");
const user = require("./routes/users.route");

app.use(express.json());

app.use("/", index);

const server = app.listen(port, () =>
  console.log(`Express app listening on port ${port}!`)
);

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
