const mongoose = require("mongoose");

const PluginSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  likes: { type: Number, default: 0 },
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Plugin", PluginSchema);
