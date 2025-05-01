const redis = require('redis');
const { SECOND } = require('./constants');
require('dotenv').config();

const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10),
    reconnectStrategy: (retries) => {
      console.warn(`Redis 재연결 시도 (${retries})`);
      return Math.min(retries * 100, 3*SECOND); // 최대 3초 간격 재시도
    },
    keepAlive: true
  }
});

client.on('error', (err) => {
  console.error('Redis 에러 발생:', err.message);
});

(async () => {
  try {
    await client.connect();
    console.log('Redis 연결 성공');
  } catch (err) {
    console.error('Redis 연결 실패:', err.message);
  }
})();

module.exports = client;