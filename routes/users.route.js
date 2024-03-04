const { Router } = require("express");
const connect = require("../lib/connect");
const Book = require("../models/Book");
const User = require("../models/User");
const userRoute = require("./users.route");
const r = Router({ mergeParams: true });
r.use("/:user", userRoute);
