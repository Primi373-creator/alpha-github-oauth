const path = require("path");
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const qrRouter = require("./routes/qr");

const app = express();
app.use(express.static(path.join(__dirname, "./frontend/build")));

app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  }),
);

const server = app.listen(process.env.PORT, () =>
  console.log(`Server listening on port ${process.env.PORT}`),
);

app.use("/server", qrRouter);

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

module.exports = app;
