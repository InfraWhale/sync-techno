const simulatorService = require('./simulatorService');

async function startDevice(req, res) {
  try {
    const { deviceId } = req.params;
    const message = simulatorService.startDevice(deviceId);
    res.json({ message });
  } catch (err) {
    res.status(500).json({ error: '시뮬레이션 생성 실패', details: err.message });
  }
}

async function restartDevice(req, res) {
  try {
    const { deviceId } = req.params;
    const message = await simulatorService.restartDevice(deviceId);
    res.json({ message });
  } catch (err) {
    res.status(500).json({ error: '시뮬레이션 재시작 실패', details: err.message });
  }
}

async function getRunningDevices(req, res) {
  try {
    const runningDevices = simulatorService.getRunningDevices();
    res.json({ runningDevices });
  } catch (err) {
    res.status(500).json({ error: '전체 시뮬레이터 조회 실패', details: err.message });
  }
}

async function deleteDevice(req, res) {
  try {
    const { deviceId } = req.params;
    const message = await simulatorService.deleteDevice(deviceId);
    res.json({ message });
  } catch (err) {
    res.status(500).json({ error: '시뮬레이션 삭제 실패', details: err.message });
  }
}

async function deleteAllDevices(req, res) {
  try {
    const message = await simulatorService.deleteAllDevices();
    res.json({ message });
  } catch (err) {
    res.status(500).json({ error: '시뮬레이션 전체 삭제 실패', details: err.message });
  }
}

module.exports = {
  startDevice,
  restartDevice,
  getRunningDevices,
  deleteDevice,
  deleteAllDevices,
};
