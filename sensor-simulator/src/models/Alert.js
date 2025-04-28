const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  deviceId: String,
  type: String,
  message: String,
  timestamp: Date,
});

module.exports = mongoose.model("Alert", alertSchema);
