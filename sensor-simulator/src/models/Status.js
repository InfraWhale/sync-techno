const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema(
  {
    deviceId: String,
    timestamp: Date,
    temperature: Number,
    voltage: Number,
    vibration: Number,
    // state: String, // 추후 제거
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model("Status", statusSchema);
