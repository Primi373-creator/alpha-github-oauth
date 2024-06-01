require("dotenv").config();
const express = require("express");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const qrRouter = require("./routes/qr");

const app = express();
const server = app.listen(process.env.PORT, () =>
  console.log(`Server listening on port ${process.env.PORT}`),
);

const io = new Server(server, {
  path: "/",
  cors: {
    origin: "*", // Allow all origins for testing
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "*", // Allow all origins for testing
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  }),
);

app.use(bodyParser.json());
app.use((req, res, next) => {
  req.io = io;
  next();
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.use("/auth", qrRouter);
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
