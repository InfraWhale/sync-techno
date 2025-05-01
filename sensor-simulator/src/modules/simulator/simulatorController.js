const simulatorService = require('./simulatorService');
const { getDevice } = require("../../devices/devicesAccessor");

async function startDevice(req, res) {
  const { deviceId } = req.params;
  try {
    if (!deviceId) {
      return res.status(400).json({ message: "deviceId는 필수입니다." });
    }

    if (getDevice(deviceId)) {
      return res.status(409).json({
        message: `장비 ${deviceId}은(는) 이미 실행 중입니다.`,
      });
    }

    const message = await simulatorService.startDevice(deviceId);
    return res.status(200).json({ message });

  } catch (err) {
    return res.status(500).json({
      message: `장비 ${deviceId} 시작에 실패했습니다.`,
      error: err.message,
    });
  }
}

async function restartDevice(req, res) {
  try {
    const { deviceId } = req.params;

    if (!deviceId) {
      return res.status(400).json({ message: "deviceId는 필수입니다." });
    }

    if (!getDevice(deviceId)) {
      return res.status(404).json({ message: `장비 ${deviceId}은(는) 실행 중이 아닙니다.` });
    }

    const message = await simulatorService.restartDevice(deviceId);
    return res.status(200).json({ message });

  } catch (err) {
    return res.status(500).json({
      message: "시뮬레이터 재시작에 실패했습니다.",
      error: err.message,
    });
  }
}

async function getRunningDevices(req, res) {
  try {
    const runningDevices = simulatorService.getRunningDevices();
    return res.status(200).json({ runningDevices });
  } catch (err) {
    return res.status(500).json({
      message: "전체 시뮬레이터 조회에 실패했습니다.",
      error: err.message
    });
  }
}

async function deleteDevice(req, res) {
  const { deviceId } = req.params;
  try {
    if (!deviceId) {
      return res.status(400).json({ message: "deviceId는 필수입니다." });
    }

    if (!getDevice(deviceId)) {
      return res.status(404).json({ message: `장비 ${deviceId}은(는) 실행 중이 아닙니다.` });
    }

    const message = await simulatorService.deleteDevice(deviceId);
    return res.status(200).json({ message });

  } catch (err) {
    return res.status(500).json({
      message: `장비 ${deviceId} 삭제에 실패했습니다.`,
      error: err.message
    });
  }
}

async function deleteAllDevices(req, res) {
  try {
    const message = await simulatorService.deleteAllDevices();
    return res.status(200).json({ message });
  } catch (err) {
    return res.status(500).json({
      message: '시뮬레이션 전체 삭제에 실패했습니다.',
      error: err.message,
    });
  }
}

module.exports = {
  startDevice,
  restartDevice,
  getRunningDevices,
  deleteDevice,
  deleteAllDevices,
};
