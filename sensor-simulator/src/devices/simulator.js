const Device = require("./Device");
const eventBus = require("../events/eventBus");

const devices = {}; // 실행 중인 장비 모음

function startDevice(deviceId) {
  if (devices[deviceId]) {
    return { alreadyRunning: true };
  }

  const device = new Device(deviceId);
  devices[deviceId] = device;

  device.interval = setInterval(() => {
    const data = device.generateSensorData();
    eventBus.emit('sensorData', data);

    if (device.state === "Error") {
      device.stopped = true;
      clearInterval(device.interval);
    }
  }, 1_000); // 10_000로 바꾸기

  const initialData = device.generateSensorData();
  eventBus.emit("sensorData", initialData);

  return { started: true };
}

function stopDevice(deviceId) {
  const device = devices[deviceId];
  if (device) {
    clearInterval(device.interval);
    delete devices[deviceId];
  }
}

module.exports = { startDevice, stopDevice, devices };
