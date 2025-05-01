// 글로벌 에러 핸들러 등록
const { registerGlobalErrorHandlers } = require('./utils/globalErrorHandler');
registerGlobalErrorHandlers();

// 의존성 로딩
require('dotenv').config();
const { createServer } = require('http');
const app = require('./app');
const { init: initSocket, getIO } = require('./utils/socket');
const eventBus = require('./events/eventBus');
const { restoreDevicesOnStartup } = require('./devices/simulator');

// 서버 & 소켓 초기화
const PORT = process.env.PORT || 3000;
const httpServer = createServer(app);
const io = initSocket(httpServer);

// sensorData 이벤트 브로드캐스트
eventBus.on('sensorData', (data) => {
  io.emit('sensorData', data);
});

// 서버 시작
httpServer.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 구동 중입니다.`);
});

// 부팅 시 장비 복구
restoreDevicesOnStartup()
  .then(() => console.log('장비 복구 프로세스 완료'))
  .catch((err) => console.error('장비 복구 실패:', err));
