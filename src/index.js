require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();

const server = require("http").Server(app);
const io = require("socket.io")(server);

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  "/files",
  express.static(path.resolve(__dirname, "..", "uploads", "resized"))
);

app.use(require("./routes"));

server.listen(process.env.PORT || 3333);
