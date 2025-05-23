const { SECOND } = require("../../utils/constants");

function predict(device) {
  const { sensorHistory: history, startTime } = device;
  
  if (history.length === 0) {
    return "Idle";
  }

  const lastData = history[history.length - 1];

  if (isIdle(history, startTime)) {
    return "Idle";
  }

  if (isError(lastData)) {
    return "Error";
  }

  if (isOverheat(history, startTime)) {
    return "Overheat";
  }

  return "Load";
}

function isIdle(history, startTime) {
  const lastTimestamp = new Date(
    history[history.length - 1].timestamp
  ).getTime();
  return lastTimestamp - startTime <= 30*SECOND;
}

function isError(lastData) {
  return lastData.voltage === 0 && lastData.vibration === 0;
}

function isOverheat(history, startTime) {
  const filteredHistory = history.filter(
    (d) => new Date(d.timestamp).getTime() - startTime > 30*SECOND
  );

  if (filteredHistory.length < 2) return false;

  const voltageChanges = [];
  const vibrationChanges = [];

  for (let i = 1; i < filteredHistory.length; i++) {
    const prev = filteredHistory[i - 1];
    const curr = filteredHistory[i];

    voltageChanges.push(Math.abs(curr.voltage - prev.voltage));
    vibrationChanges.push(Math.abs(curr.vibration - prev.vibration));
  }

  const avgVoltageChange =
    voltageChanges.reduce((a, b) => a + b, 0) / voltageChanges.length;
  const avgVibrationChange =
    vibrationChanges.reduce((a, b) => a + b, 0) / vibrationChanges.length;

  const voltageOverThreshold = voltageChanges.some(
    (change) => change > avgVoltageChange * 3
  );
  const vibrationOverThreshold = vibrationChanges.some(
    (change) => change > avgVibrationChange * 3
  );

  return voltageOverThreshold || vibrationOverThreshold;
}

module.exports = { predict };
