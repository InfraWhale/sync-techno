const Device = require('../../src/devices/Device');
const {
  setDevice,
  removeDevice
} = require('../../src/devices/devicesAccessor');

function mockDevice(deviceId, overrides = {}) {
  const device = new Device(deviceId);
  Object.assign(device, overrides);
  setDevice(deviceId, device);
  return device;
}

function mockDevices(deviceIds) {
  return deviceIds.map((id) => mockDevice(id));
}

function clearMockDevice(deviceId) {
  removeDevice(deviceId);
}

function clearMockDevices(deviceIds) {
  deviceIds.forEach(clearMockDevice);
}

module.exports = {
  mockDevice,
  mockDevices,
  clearMockDevice,
  clearMockDevices,
};