const predictService = require("./predictService");
const { getDevice } = require("../../devices/devicesAccessor");

function predictDeviceState(req, res) {
  try {
    const { deviceId } = req.params;
    const device = getDevice(deviceId);
    if (!device) {
      return res.status(404).json({ message: `${deviceId}가 존재하지 않습니다.` });
    }

    const predictedState = predictService.predict(device);
    res.json({ deviceId, predictedState });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '장비상태 예측에 실패했습니다.', error: err.message });
  }
}

module.exports = { predictDeviceState };
