const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema(
  {
    deviceId: String,
    timestamp: Date,
    temperature: Number,
    humidity: Number,
    voltage: Number,
    vibration: Number,
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model("Status", statusSchema);
