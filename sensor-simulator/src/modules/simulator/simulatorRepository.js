const { devices, startDevice: simulatorStart, stopDevice: simulatorStop } = require('../../devices/simulator');
const Status = require('../../models/Status');
const Alert = require('../../models/Alert');

function isDeviceRunning(deviceId) {
  return !!devices[deviceId];
}

function startDevice(deviceId) {
  simulatorStart(deviceId);
}

function stopDevice(deviceId) {
  simulatorStop(deviceId);
}

function getAllRunningDeviceIds() {
  return Object.keys(devices);
}

async function deleteStatusAndAlertsByDeviceId(deviceId) {
  await Status.deleteMany({ deviceId });
  await Alert.deleteMany({ deviceId });
}

async function deleteAllStatusAndAlerts() {
  await Status.deleteMany({});
  await Alert.deleteMany({});
}

function stopAllDevices() {
  Object.keys(devices).forEach(deviceId => {
    simulatorStop(deviceId);
  });
}

module.exports = {
  isDeviceRunning,
  startDevice,
  stopDevice,
  getAllRunningDeviceIds,
  deleteStatusAndAlertsByDeviceId,
  deleteAllStatusAndAlerts,
  stopAllDevices,
};