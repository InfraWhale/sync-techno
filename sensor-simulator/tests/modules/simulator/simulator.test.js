jest.mock('../../../src/utils/redisClient', () => ({
  hSet: jest.fn().mockResolvedValue(),
  rPush: jest.fn().mockResolvedValue(),
  del: jest.fn().mockResolvedValue(),
  lRem: jest.fn().mockResolvedValue(),
  lRange: jest.fn().mockResolvedValue([]),
  hGetAll: jest.fn().mockResolvedValue({})
}));

jest.mock('../../../src/events/eventBus', () => ({
  emit: jest.fn()
}));

jest.mock('../../../src/models/Status', () => ({
  find: jest.fn(() => ({
    sort: jest.fn(() => Promise.resolve([]))
  })),
  deleteMany: jest.fn().mockResolvedValue()
}));

jest.mock('../../../src/models/Alert', () => ({
  find: jest.fn(() => ({
    sort: jest.fn(() => Promise.resolve([]))
  })),
  deleteMany: jest.fn().mockResolvedValue()
}));

const request = require('supertest');
const express = require('express');
const simulatorRoutes = require('../../../src/routes/simulatorRoutes');
const Device = require('../../../src/devices/Device');
const {
  getDevice,
  setDevice,
  removeDevice,
  getAllDeviceIds
} = require('../../../src/devices/devicesAccessor');

const app = express();
app.use(express.json());
app.use('/api/simulator', simulatorRoutes);

describe('Simulator API', () => {
  afterEach(() => {
    const allIds = getAllDeviceIds();
    allIds.forEach((id) => {
      const dev = getDevice(id);
      if (dev?.interval) clearInterval(dev.interval);
      removeDevice(id);
    });
  });

  describe('POST /api/simulator/:deviceId (시뮬레이션 시작)', () => {
    test('시뮬레이션 정상 시작', async () => {
      const res = await request(app).post('/api/simulator/device-001');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('device-001의 시뮬레이션을 시작합니다.');
    });

    test('시뮬레이션이 이미 실행중', async () => {
      setDevice('already-running', new Device('already-running'));
      const res = await request(app).post('/api/simulator/already-running');
      expect(res.status).toBe(409);
      expect(res.body.message).toBe('장비 already-running은(는) 이미 실행 중입니다.');
    });
  });

  describe('POST /api/simulator/restart/:deviceId (시뮬레이션 재시작)', () => {
    test('시뮬레이션 정상 재시작', async () => {
      setDevice('device-001', new Device('device-001'));
      const res = await request(app).post('/api/simulator/restart/device-001');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('device-001의 시뮬레이션을 재시작합니다.');
    });

    test('실행중이지 않은 장비 재시작', async () => {
      const res = await request(app).post('/api/simulator/restart/device-001');
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('장비 device-001은(는) 실행 중이 아닙니다.');
    });
  });

  describe('GET /api/simulator (시뮬레이션 목록 조회)', () => {
    test('목록 조회 성공', async () => {
      setDevice('device-001', new Device('device-001'));
      setDevice('device-002', new Device('device-002'));
      const res = await request(app).get('/api/simulator');
      expect(res.status).toBe(200);
      expect(res.body.runningDevices).toEqual(['device-001', 'device-002']);
    });
  });

  describe('DELETE /api/simulator/:deviceId (시뮬레이션 단건 삭제)', () => {
    test('시뮬레이션 전체 삭제', async () => {
      setDevice('device-001', new Device('device-001'));
      const res = await request(app).delete('/api/simulator/device-001');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('device-001 시뮬레이션이 삭제되었습니다.');
    });

    test('존재하지 않는 장비 삭제 시도', async () => {
      const res = await request(app).delete('/api/simulator/not-running');
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('장비 not-running은(는) 실행 중이 아닙니다.');
    });
  });

  describe('DELETE /api/simulator (시뮬레이션 전체 삭제)', () => {
    test('전체 삭제 성공', async () => {
      setDevice('device-001', new Device('device-001'));
      setDevice('device-002', new Device('device-002'));

      const res = await request(app).delete('/api/simulator');
      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/^총 \d+개의 장비가 중지 및 삭제되었습니다/);
    });
  });
});