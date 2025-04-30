const eventBus = require("../events/eventBus");
const { devices } = require("../devices/simulator");
const Alert = require("../models/Alert");
const { getIO } = require("../utils/socket");
const { saveStatus } = require("../modules/status/statusRepository");
const redisClient = require('../utils/redisClient');

eventBus.on("sensorData", async (data) => {
  const io = getIO();

  const device = devices[data.deviceId];
  if (!device) return;
  
  console.log(
    `[${data.timestamp}] ${data.deviceId} | Temp: ${data.temperature}°C, | Humid: ${data.humidity}% | Volt: ${data.voltage}V, Vib: ${data.vibration}`
  );

  try {
    await saveStatus(data);
    // await axios.post(`http://localhost:${PORT}/api/status`, data);
  } catch (error) {
    console.error("상태 저장 실패:", error.message);
  }

  // Redis에 최신 센서 데이터 업데이트 (fire-and-forget)
  redisClient.hSet(`device:${data.deviceId}`, {
    temperature: device.temperature,
    humidity: device.humidity,
    voltage: device.voltage,
    vibration: device.vibration
  });

  device.addToHistory(data);

  // Alert 발생 로직 공통 처리 함수
  const sendAlert = async (deviceId, type, message) => {
    try {
      await Alert.create({
        deviceId,
        type,
        message,
        timestamp: new Date(),
      });

      console.log(`ALERT 저장: ${deviceId} - ${type}`);
      io.emit('alert', {
        deviceId,
        timestamp: new Date().toISOString(),
        type,
        message,
      });

    } catch (err) {
      console.error(`Alert 저장 실패 (${type}):`, err.message);
    }
  };

  // 전압 강하 Alert
  if (device.checkVoltageDropAlert()) {
    const message = `1분간 전압이 2.9V 미만인 상태가 3회 이상 발생했습니다. (현재 전압: ${data.voltage}V)`;
    await sendAlert(data.deviceId, "VoltageDrop", message);
  }

  // 평균 온도 & 습도 Alert
  if (device.checkAvgTempAndHumidityHighAlert()) {
    const message = `최근 5분간 평균 온도 70°C, 평균 습도 80%를 초과했습니다. (현재 온도: ${data.temperature}°C, 현재 습도: ${data.humidity}°C)`;
    await sendAlert(data.deviceId, "AvgTempAndHumidityHigh", message);
  }

  // 전압 감소 + 온도 증가 추세 Alert
  if (device.checkTrendAlert()) {
    const message = `전압 감소 및 온도 상승 추세가 감지되었습니다. (현재 전압: ${data.voltage}V, 온도: ${data.temperature}°C)`;
    await sendAlert(data.deviceId, "TrendAnomaly", message);
  }
});