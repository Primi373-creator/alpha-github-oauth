const express = require("express");
const router = express.Router();
const Paste = require("../models/session");

router.post("/ban", async (req, res) => {
  const { id, number } = req.body;
  if (!id && !number) {
    return res.json("ID or number is required");
  }
  try {
    let query;
    if (id) {
      query = { id };
    } else {
      query = { number };
    }
    const paste = await Paste.findOne(query);
    if (!paste) {
      return res.json("user not found");
    }
    paste.banned = true;
    await paste.save();
    res.json("User banned successfully");
  } catch (err) {
    console.error(err);
    res.json("Error banning user");
  }
});

router.post("/unban", async (req, res) => {
  const { id, number } = req.body;
  if (!id && !number) {
    return res.json("ID or number is required");
  }
  try {
    let query;
    if (id) {
      query = { id };
    } else {
      query = { number };
    }
    const paste = await Paste.findOne(query);
    if (!paste) {
      return res.json("user not found");
    }
    paste.banned = false;
    await paste.save();
    res.json("user unbanned successfully");
  } catch (err) {
    console.error(err);
    res.json("Error unbanning user");
  }
});

router.get("/restore", async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.json("ID is required");
  }
  try {
    const paste = await Paste.findOne({ id });
    if (!paste) {
      return res.json("Paste not found");
    }
    if (paste.banned) {
      return res.json("User is banned");
    }
    res.json({ content: paste.content });
  } catch (err) {
    console.error(err);
    res.json("Error fetching paste");
  }
});

module.exports = router;
