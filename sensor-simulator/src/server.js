const app = require('./app');
const { createServer } = require('http');
const { init } = require('./socket'); // init만 가져옴

const PORT = process.env.PORT;

const httpServer = createServer(app);

// io 초기화
const io = init(httpServer);

// sensorData broadcast
const eventBus = require('./events/eventBus');
eventBus.on('sensorData', (data) => {
  io.emit('sensorData', data);
});

// 서버 시작
httpServer.listen(PORT, () => {
  console.log(`서버 구동 중`);
});