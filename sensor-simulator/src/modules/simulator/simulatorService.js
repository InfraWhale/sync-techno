const simulatorRepository = require('./simulatorRepository');
const simulator = require('../../devices/simulator');
const devicesAccessor = require('../../devices/devicesAccessor');

function startDevice(deviceId) {
  simulator.startDevice(deviceId);
  return `${deviceId}의 시뮬레이션을 시작합니다.`;
}

async function restartDevice(deviceId) {
  simulator.stopDevice(deviceId);
  await simulatorRepository.deleteStatusAndAlertsByDeviceId(deviceId);
  simulator.startDevice(deviceId);
  return `${deviceId}의 시뮬레이션을 재시작합니다.`;
}

function getRunningDevices() {
  return devicesAccessor.getAllDeviceIds();
}

async function deleteDevice(deviceId) {
  simulator.stopDevice(deviceId);
  await simulatorRepository.deleteStatusAndAlertsByDeviceId(deviceId);
  return `${deviceId} 시뮬레이션이 삭제되었습니다.`;
}

async function deleteAllDevices() {
  const runningDevices = devicesAccessor.getAllDeviceIds();

  if (runningDevices.length === 0) {
    return '현재 실행 중인 장비가 없습니다.';
  }

  simulator.stopAllDevices();
  await simulatorRepository.deleteAllStatusAndAlerts();

  return `총 ${runningDevices.length}개의 장비가 중지 및 삭제되었습니다.`;
}

module.exports = {
  startDevice,
  restartDevice,
  getRunningDevices,
  deleteDevice,
  deleteAllDevices,
};
