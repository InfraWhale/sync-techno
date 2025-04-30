const { registerGlobalErrorHandlers } = require('./utils/globalErrorHandler');
registerGlobalErrorHandlers();

const app = require('./app');
const { createServer } = require('http');
const { init } = require('./utils/socket'); // init만 가져옴
const { restoreDevicesOnStartup } = require('./devices/simulator');

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

// 서버 부팅할 때 장비 복구
restoreDevicesOnStartup()
  .then(() => console.log('장비 복구 프로세스 완료'))
  .catch((err) => console.error('장비 복구 실패', err));