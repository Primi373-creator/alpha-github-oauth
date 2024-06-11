const path = require("path");
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const qrRouter = require("./routes/qr");
const pairRouter = require("./routes/pair");
const userRouter = require("./routes/utils");

const app = express();

app.use(express.static(path.join(__dirname, "../build")));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  }),
);

const serverRouter = express.Router();
serverRouter.use(qrRouter);
serverRouter.use(pairRouter);
serverRouter.use(userRouter);

app.use("/server", serverRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./frontend/build", "index.html"));
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

const server = app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});

module.exports = app;
