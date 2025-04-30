const alertRepository = require('./alertRepository');
const redisClient = require("../../utils/redisClient");

async function getAllAlerts() {
  return await alertRepository.findAll();
}

async function getAlertsByDeviceId(deviceId) {
  const cacheKey = `alerts:${deviceId}`;

  // 장비 상태 확인
  const deviceData = await redisClient.hGetAll(`device:${deviceId}`);
  const isStopped = deviceData?.stopped === 'true';

  // 캐시 HIT
  if (isStopped) {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      //console.log(`[캐시 HIT] alerts:${deviceId}`);
      return JSON.parse(cached);
    }
  }

  // DB 조회
  const alerts = await alertRepository.findByDeviceId(deviceId);

  // 캐시 저장
  if (isStopped && alerts.length > 0) {
    await redisClient.set(cacheKey, JSON.stringify(alerts));
    //console.log(`[alerts 캐시 저장] ${deviceId}`);
  }

  return alerts;
}

async function deleteAllAlerts() {
  const result = await alertRepository.deleteAll();
  return result.deletedCount;
}

async function deleteAlertsByDeviceId(deviceId) {
  const result = await alertRepository.deleteByDeviceId(deviceId);
  return result.deletedCount;
}

module.exports = {
  getAllAlerts,
  getAlertsByDeviceId,
  deleteAllAlerts,
  deleteAlertsByDeviceId,
};