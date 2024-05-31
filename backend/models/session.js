const mongoose = require("mongoose");

const PasteSchema = new mongoose.Schema({
  id: String,
  number: String,
  banned: Boolean,
  content: String,
  createdAt: { type: Date, default: Date.now },
});

PasteSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });

module.exports = mongoose.model("Paste", PasteSchema);
