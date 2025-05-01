const Device = require("./Device");
const eventBus = require("../events/eventBus");
const redisClient = require('../utils/redisClient');
const { getStatusByDeviceId } = require("../modules/status/statusService");
const {
  getDevice,
  setDevice,
  removeDevice,
  getAllDeviceIds
} = require("./devicesAccessor");

// MongoDB에서 과거 센서 이력 로드
async function loadSensorHistoryFromMongo(deviceId) {
  try {
    const histories = await getStatusByDeviceId(deviceId);
    return histories || [];
  } catch (error) {
    console.error(`sensorHistory 로딩 실패 (deviceId: ${deviceId})`, error);
    return [];
  }
}

// 디바이스 하나 초기화
async function initializeDevice(deviceId, data = null) {
  const device = new Device(deviceId);
  if (data) {
    device.state = data.state || "Idle";
    device.startTime = data.startTime ? parseInt(data.startTime, 10) : Date.now();
    device.temperature = data.temperature ? parseFloat(data.temperature) : 25.0;
    device.humidity = data.humidity ? parseFloat(data.humidity) : 45.0;
    device.voltage = data.voltage ? parseFloat(data.voltage) : 3.3;
    device.vibration = data.vibration ? parseFloat(data.vibration) : 0.01;
    device.stopped = data?.stopped === 'true';
  }

  device.sensorHistory = await loadSensorHistoryFromMongo(deviceId);

  setDevice(deviceId, device);

  if (!device.stopped) {
    device.interval = setInterval(async () => {
      const sensorData = device.generateSensorData();
      eventBus.emit('sensorData', sensorData);

      redisClient.hSet(`device:${deviceId}`, {
        temperature: device.temperature,
        humidity: device.humidity,
        voltage: device.voltage,
        vibration: device.vibration
      });

      if (device.state === "Error") {
        device.stopped = true;
        clearInterval(device.interval);

        redisClient.hSet(`device:${device.deviceId}`, {
          stopped: 'true'
        });
      }
    }, 1000); // 10_000 로 바꿀것
  } else {
    console.log(`장비 ${deviceId}는 중지 상태. 시뮬레이션 실행 안 함.`);
  }

  return device;
}

// 장비 시작
async function startDevice(deviceId) {
  if (getDevice(deviceId)) {
    return { alreadyRunning: true };
  }

  const device = await initializeDevice(deviceId);

  await redisClient.rPush('devices', deviceId);
  await redisClient.hSet(`device:${deviceId}`, {
    state: device.state,
    startTime: device.startTime,
    temperature: device.temperature,
    humidity: device.humidity,
    voltage: device.voltage,
    vibration: device.vibration,
    stopped: device.stopped.toString()
  });

  const initialData = device.generateSensorData();
  eventBus.emit('sensorData', initialData);

  return { started: true };
}

// 장비 종료
async function stopDevice(deviceId) {
  const device = getDevice(deviceId);
  if (device) {
    clearInterval(device.interval);
    removeDevice(deviceId);

    await redisClient.lRem('devices', 0,  deviceId);
    await redisClient.del(`device:${deviceId}`);
    await redisClient.del(`status:${deviceId}`);
    await redisClient.del(`alerts:${deviceId}`);
  }
}

function stopAllDevices() {
  getAllDeviceIds().forEach(deviceId => {
    stopDevice(deviceId);
  });
}

// 서버 부팅 시 디바이스 복구
async function restoreDevicesOnStartup() {
  try {
    const deviceIds = await redisClient.lRange('devices', 0, -1);
    console.log(`복구할 디바이스 수: ${deviceIds.length}`);

    for (const deviceId of deviceIds) {
      const data = await redisClient.hGetAll(`device:${deviceId}`);
      if (!data || Object.keys(data).length === 0) {
        console.warn(`device:${deviceId} 복구할 데이터 없음.`);
        continue;
      }

      await initializeDevice(deviceId, data);
    }

    console.log('모든 디바이스 복구 완료');
  } catch (error) {
    console.error('디바이스 복구 중 에러 발생:', error);
  }
}

module.exports = {
  startDevice,
  stopDevice,
  restoreDevicesOnStartup,
  stopAllDevices,
};