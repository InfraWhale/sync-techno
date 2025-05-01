// device들의 Map 관리
let devices = new Map();

function getDevices() {
  if (process.env.NODE_ENV === 'test') {
    if (!global.__testDevices__) global.__testDevices__ = new Map();
    return global.__testDevices__;
  }
  return devices;
}

function getDevice(id) {
  return getDevices().get(id);
}

function setDevice(id, device) {
  getDevices().set(id, device);
}

function removeDevice(id) {
  getDevices().delete(id);
}

function clearAllDevices() {
  getDevices().clear();
}

function getAllDeviceIds() {
  return Array.from(getDevices().keys());
}

module.exports = {
  getDevices,
  getDevice,
  setDevice,
  removeDevice,
  clearAllDevices,
  getAllDeviceIds
};