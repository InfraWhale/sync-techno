let io; // 전역 io 변수

function init(server) {
  const { Server } = require('socket.io');
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
  return io;
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io가 초기화되지 않았습니다. init(server)를 먼저 호출하세요.");
  }
  return io;
}

module.exports = { init, getIO };