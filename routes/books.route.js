const { Router } = require("express");
const connect = require("../lib/connect");
const Note = require("../models/Note");
const User = require("../models/User");
const userRoute = require("./books.route");
const r = Router({ mergeParams: true });
r.use("/:book", bookRoute);
