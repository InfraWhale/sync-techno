const alertRepository = require('./alertRepository');

async function getAllAlerts() {
  return await alertRepository.findAll();
}

async function getAlertsByDeviceId(deviceId) {
  return await alertRepository.findByDeviceId(deviceId);
}

async function deleteAllAlerts() {
  const result = await alertRepository.deleteAll();
  return result.deletedCount;
}

async function deleteAlertsByDeviceId(deviceId) {
  const result = await alertRepository.deleteByDeviceId(deviceId);
  return result.deletedCount;
}

module.exports = {
  getAllAlerts,
  getAlertsByDeviceId,
  deleteAllAlerts,
  deleteAlertsByDeviceId,
};