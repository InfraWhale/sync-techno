// src/modules/simulator/simulatorService.js
const simulatorRepository = require('./simulatorRepository');

function startDevice(deviceId) {
  if (simulatorRepository.isDeviceRunning(deviceId)) {
    return `${deviceId} 는 이미 존재합니다.`;
  }
  simulatorRepository.startDevice(deviceId);
  return `${deviceId}의 시뮬레이션을 시작합니다.`;
}

async function restartDevice(deviceId) {
  if (!simulatorRepository.isDeviceRunning(deviceId)) {
    throw new Error(`${deviceId}가 존재하지 않습니다.`);
  }
  simulatorRepository.stopDevice(deviceId);
  await simulatorRepository.deleteStatusAndAlertsByDeviceId(deviceId);
  simulatorRepository.startDevice(deviceId);
  return `${deviceId}의 시뮬레이션을 재시작합니다.`;
}

function getRunningDevices() {
  return simulatorRepository.getAllRunningDeviceIds();
}

async function deleteDevice(deviceId) {
  if (!simulatorRepository.isDeviceRunning(deviceId)) {
    throw new Error(`${deviceId}가 존재하지 않습니다.`);
  }
  simulatorRepository.stopDevice(deviceId);
  await simulatorRepository.deleteStatusAndAlertsByDeviceId(deviceId);
  return `${deviceId} 시뮬레이션이 삭제되었습니다.`;
}

async function deleteAllDevices() {
  simulatorRepository.stopAllDevices();
  await simulatorRepository.deleteAllStatusAndAlerts();
  return '모든 시뮬레이션이 삭제되었습니다.';
}

module.exports = {
  startDevice,
  restartDevice,
  getRunningDevices,
  deleteDevice,
  deleteAllDevices,
};
