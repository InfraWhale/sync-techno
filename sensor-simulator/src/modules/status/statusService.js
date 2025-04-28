// src/modules/status/statusService.js
const statusRepository = require("./statusRepository");

async function createStatus(data) {
  await statusRepository.saveStatus(data);
}

async function getStatusByDeviceId(deviceId) {
  return await statusRepository.findStatusByDeviceId(deviceId);
}

async function deleteAllStatus() {
  const result = await statusRepository.deleteAll();
  return result.deletedCount;
}

async function deleteStatusByDeviceId(deviceId) {
  const result = await statusRepository.deleteByDeviceId(deviceId);
  return result.deletedCount;
}

module.exports = {
  createStatus,
  getStatusByDeviceId,
  deleteAllStatus,
  deleteStatusByDeviceId,
};