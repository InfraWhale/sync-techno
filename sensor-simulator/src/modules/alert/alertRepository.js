const Alert = require('../../models/Alert');

async function findAll() {
  return await Alert.find();
}

async function findByDeviceId(deviceId) {
  return await Alert.find({ deviceId });
}

async function deleteAll() {
  return await Alert.deleteMany({});
}

async function deleteByDeviceId(deviceId) {
  return await Alert.deleteMany({ deviceId });
}

module.exports = {
  findAll,
  findByDeviceId,
  deleteAll,
  deleteByDeviceId,
};