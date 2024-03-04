const { Router } = require("express");
const connect = require("../lib/connect");
const Book = require("../models/Book");
const User = require("../models/User");
const userRoute = require("./users.route"); // import of users.route.js
const r = Router();
r.use("/:user", userRoute);
