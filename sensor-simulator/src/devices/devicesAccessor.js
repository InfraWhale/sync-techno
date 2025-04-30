let devices = {};

function getDevices() {
  if (process.env.NODE_ENV === 'test') {
    if (!global.__testDevices__) global.__testDevices__ = {};
    return global.__testDevices__;
  }
  return devices;
}

function getDevice(id) {
  return getDevices()[id];
}

function setDevice(id, device) {
  getDevices()[id] = device;
}

function removeDevice(id) {
  delete getDevices()[id];
}

function clearAllDevices() {
  const map = getDevices();
  Object.keys(map).forEach(id => delete map[id]);
}

function getAllDeviceIds() {
  return Object.keys(getDevices());
}

module.exports = {
  getDevices,
  getDevice,
  setDevice,
  removeDevice,
  clearAllDevices,
  getAllDeviceIds
};
