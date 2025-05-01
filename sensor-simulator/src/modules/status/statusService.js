const statusRepository = require("./statusRepository");
const redisClient = require("../../utils/redisClient");

async function createStatus(data) {
  await statusRepository.saveStatus(data);
}

async function deleteAllStatus() {
  const result = await statusRepository.deleteAll();
  return result.deletedCount;
}

async function getStatusByDeviceId(deviceId) {
  const cacheKey = `status:${deviceId}`;

  const deviceData = await redisClient.hGetAll(`device:${deviceId}`);
  const isStopped = deviceData?.stopped === 'true';

  if (isStopped) {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  }

  const statusList = await statusRepository.findStatusByDeviceId(deviceId);

  if (isStopped) {
    await redisClient.set(cacheKey, JSON.stringify(statusList));
  }

  return statusList;
}

async function deleteStatusByDeviceId(deviceId) {
  const result = await statusRepository.deleteByDeviceId(deviceId);
  return result.deletedCount;
}

module.exports = {
  createStatus,
  getStatusByDeviceId,
  deleteAllStatus,
  deleteStatusByDeviceId,
};