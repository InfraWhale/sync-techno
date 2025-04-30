const { devices } = require('../../src/devices/simulator');
const Device = require('../../src/devices/Device');

// const simulator = require('../../src/devices/simulator');
// const devices = simulator.devices;

function mockDevice(deviceId, overrides = {}) {
  const device = new Device(deviceId);
  Object.assign(device, overrides);
  devices[deviceId] = device;
  // console.log('[mockDevice] devices:', devices);
  // console.log('[mockDevice] 등록된 장비:', device.deviceId);
  return device;
}

function mockDevices(deviceIds) {
  return deviceIds.map((id) => mockDevice(id));
}

function clearMockDevice(deviceId) {
  delete devices[deviceId];
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