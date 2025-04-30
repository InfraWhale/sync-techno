// src/modules/status/statusRepository.js
const Status = require("../../models/Status");

async function saveStatus(data) {
  const status = new Status(data);
  return await status.save();
}

async function deleteAll() {
  return await Status.deleteMany({});
}

async function findStatusByDeviceId(deviceId) {
  return await Status.find({ deviceId }).sort({ timestamp: -1 });
}

async function deleteByDeviceId(deviceId) {
  return await Status.deleteMany({ deviceId });
}

module.exports = {
  saveStatus,
  deleteAll,
  findStatusByDeviceId,
  deleteByDeviceId,
};
