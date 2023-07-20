var express = require("express");
var logger = require("morgan");
require("dotenv").config();
// const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// var usersRouter = require("./routes/users.routes");
// var adminRouter = require("./routes/admin.routes");
const notesRouter = require("./routes/api/notes.routes");
const subTaskRouter = require("./routes/api/sub-task.routes");

var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/notes", notesRouter);
// app.use("/:taskId/sub", subTask);

// app.use("notes/:taskId/sub", subTaskRouter);

// app.use(function (req, res, next) {
//   res.status(404).json({
//     message: "No such route exists",
//   });
// });
// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({
    message:
      process.env.ENV == "development"
        ? err.message
        : "Something when wrong please try again later",
  });
});

module.exports = app;
