const request = require('supertest');
const app = require('../../../src/app');
const mongoose = require('mongoose');
const Status = require('../../../src/models/Status');
const redisClient = require('../../../src/utils/redisClient');
const {
  mockDevice,
  mockDevices,
  clearMockDevice,
  clearMockDevices
} = require('../../helpers/mockDevice');

describe('Status API', () => {
  const singleId = 'device-001';
  const multipleIds = ['dev-1', 'dev-2'];
  const sampleStatus = {
    deviceId: singleId,
    timestamp: new Date().toISOString(),
    temperature: 26.4,
    voltage: 3.2,
    vibration: 0.01,
    humidity: 50.0
  };

  afterAll(async () => {
    await redisClient.quit();
    await mongoose.connection.close();
  });

  describe('POST /api/status (단건 입력)', () => {
    beforeEach(() => mockDevice(singleId));
    afterEach(async () => {
      clearMockDevice(singleId);
      await Status.deleteMany({});
    });

    test('상태 저장 성공', async () => {
      const res = await request(app)
        .post('/api/status')
        .send(sampleStatus)
        .expect(201);

      expect(res.body.message).toBe("상태 저장에 성공했습니다.");

      const found = await Status.findOne({ deviceId: singleId });
      expect(found).not.toBeNull();
      expect(found.temperature).toBe(sampleStatus.temperature);
    });

    test('상태 저장 시 필수값 누락', async () => {
      const invalidPayload = { ...sampleStatus };
      delete invalidPayload.timestamp;

      const res = await request(app)
        .post('/api/status')
        .send(invalidPayload)
        .expect(400);

      expect(res.body.message).toBe("유효성 검사에 실패했습니다.");
    });
  });

  describe('GET /api/status/:deviceId (단건 조회)', () => {
    beforeEach(() => mockDevice(singleId));
    afterEach(async () => {
      clearMockDevice(singleId);
      await Status.deleteMany({});
    });

    test('특정 장비 상태 이력 조회 성공', async () => {
      await Status.create(sampleStatus);

      const res = await request(app)
        .get(`/api/status/${singleId}`)
        .expect(200);

      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].deviceId).toBe(singleId);
    });

    test('존재하지 않는 장비 조회', async () => {
      const res = await request(app)
        .get('/api/status/non-existent-id')
        .expect(404);

      expect(res.body.message).toContain('존재하지 않습니다');
    });
  });

  describe('DELETE /api/status/:deviceId (단건 삭제)', () => {
    beforeEach(() => mockDevice(singleId));
    afterEach(async () => {
      clearMockDevice(singleId);
      await Status.deleteMany({});
    });

    test('특정 장비 상태 이력 삭제 성공', async () => {
      await Status.create(sampleStatus);

      const res = await request(app)
        .delete(`/api/status/${singleId}`)
        .expect(200);

      expect(res.body.message).toMatch(/총 \d+건 삭제되었습니다/);

      const count = await Status.countDocuments({ deviceId: singleId });
      expect(count).toBe(0);
    });

    test('존재하지 않는 장비 삭제', async () => {
      const res = await request(app)
        .delete('/api/status/non-existent-id')
        .expect(404);

      expect(res.body.message).toContain('존재하지 않습니다');
    });
  });

  describe('DELETE /api/status (전체 삭제)', () => {
    beforeEach(() => mockDevices(multipleIds));
    afterEach(async () => {
      clearMockDevices(multipleIds);
      await Status.deleteMany({});
    });

    test('전체 상태 이력 삭제 성공', async () => {
      for (const id of multipleIds) {
        await Status.create({
          deviceId: id,
          timestamp: new Date().toISOString(),
          temperature: 25.5,
          voltage: 3.3,
          vibration: 0.01,
          humidity: 50
        });
      }

      const res = await request(app)
        .delete('/api/status')
        .expect(200);

      expect(res.body.message).toMatch(/총 \d+건 삭제되었습니다/);

      const count = await Status.countDocuments();
      expect(count).toBe(0);
    });
  });
});