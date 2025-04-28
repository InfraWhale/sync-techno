const predictService = require("./predictService");
const { devices } = require("../../devices/simulator");

function predictDeviceState(req, res) {
  try {
    const { deviceId } = req.params;
    const device = devices[deviceId] || null;

    if (!device) {
      return res.status(404).json({ error: `${deviceId}가 존재하지 않습니다.` });
    }

    const predictedState = predictService.predict(device);
    res.json({ deviceId, predictedState });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '장비상태 예측 실패', details: err.message });
  }
}

module.exports = { predictDeviceState };
