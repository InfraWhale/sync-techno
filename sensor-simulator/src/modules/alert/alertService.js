const alertRepository = require('./alertRepository');
const redisClient = require("../../utils/redisClient");

async function getAllAlerts() {
  return await alertRepository.findAll();
}

async function getAlertsByDeviceId(deviceId) {
  const cacheKey = `alerts:${deviceId}`;

  const deviceData = await redisClient.hGetAll(`device:${deviceId}`);
  const isStopped = deviceData?.stopped === 'true';

  if (isStopped) {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  }

  const alerts = await alertRepository.findByDeviceId(deviceId);

  if (isStopped && alerts.length > 0) {
    await redisClient.set(cacheKey, JSON.stringify(alerts));
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