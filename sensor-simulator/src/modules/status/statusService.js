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

  // Redis에서 장비 상태 확인
  const deviceData = await redisClient.hGetAll(`device:${deviceId}`);
  const isStopped = deviceData?.stopped === 'true';

  if (isStopped) {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      // console.log(`[캐시 HIT] status:${deviceId}`);
      return JSON.parse(cached);
    }
  }

  // DB에서 조회
  const statusList = await statusRepository.findStatusByDeviceId(deviceId);

  // 정지 장비라면 캐시 저장
  if (isStopped) {
    await redisClient.set(cacheKey, JSON.stringify(statusList));
    // console.log(`[캐시 저장] ${deviceId}`);
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