const request = require('supertest');
const app = require('../../../src/app');
const mongoose = require('mongoose');
const Alert = require('../../../src/models/Alert');
const redisClient = require('../../../src/utils/redisClient');
const { mockDevice, clearMockDevice } = require('../../helpers/mockDevice');

describe('Alert API', () => {
  const singleId = 'device-001';
  const multipleIds = ['dev-1', 'dev-2'];

  afterAll(async () => {
    await redisClient.quit();
    await mongoose.connection.close();
  });

  describe('GET /api/alerts (전체 조회)', () => {
    const sampleAlerts = [
      {
        deviceId: multipleIds[0],
        type: 'VoltageDrop',
        message: '전압 낮음',
        timestamp: new Date()
      },
      {
        deviceId: multipleIds[1],
        type: 'AvgTempHigh',
        message: '온도/습도 높음',
        timestamp: new Date()
      },
      {
        deviceId: singleId,
        type: 'VibrationSpike',
        message: '진동 급증',
        timestamp: new Date()
      }
    ];

    beforeEach(async () => {
      await Alert.insertMany(sampleAlerts);
    });

    afterEach(async () => {
      await Alert.deleteMany({});
    });

    test('모든 장비의 Alert 리스트 조회 성공', async () => {
      const res = await request(app).get('/api/alerts');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(sampleAlerts.length);

      const deviceIds = res.body.map(alert => alert.deviceId);
      expect(deviceIds).toEqual(expect.arrayContaining([singleId, ...multipleIds]));
    });
  });

  describe('GET /api/alerts/:deviceId (단건 조회)', () => {
    const alerts = [
      {
        deviceId: singleId,
        type: 'VoltageDrop',
        message: '전압 경고',
        timestamp: new Date()
      },
      {
        deviceId: singleId,
        type: 'AvgTempHigh',
        message: '온도 경고',
        timestamp: new Date()
      }
    ];

    beforeEach(async () => {
      await Alert.insertMany(alerts);
      mockDevice(singleId);
    });

    afterEach(async () => {
      await Alert.deleteMany({});
      clearMockDevice(singleId);
    });

    test('특정 장비의 Alert 리스트 조회 성공', async () => {
      const res = await request(app).get(`/api/alerts/${singleId}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      res.body.forEach(alert => {
        expect(alert.deviceId).toBe(singleId);
      });
    });

    test('존재하지 않는 장비 ID 요청 시 404 반환', async () => {
      const res = await request(app).get('/api/alerts/nonexistent-device');
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toMatch(/존재하지 않습니다/);
    });
  });

  describe('DELETE /api/alerts (전체 삭제)', () => {
    const alerts = [
      { deviceId: 'dev-x', type: 'VoltageDrop', message: '메시지', timestamp: new Date() },
      { deviceId: 'dev-y', type: 'AvgTempHigh', message: '메시지', timestamp: new Date() }
    ];

    beforeEach(async () => {
      await Alert.insertMany(alerts);
    });

    afterEach(async () => {
      await Alert.deleteMany({});
    });

    test('전체 Alert 삭제 성공', async () => {
      const res = await request(app).delete('/api/alerts');
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch(/삭제되었습니다/);

      const followUp = await request(app).get('/api/alerts');
      expect(followUp.statusCode).toBe(200);
      expect(followUp.body.length).toBe(0);
    });
  });

  describe('DELETE /api/alerts/:deviceId (단건 삭제)', () => {
    const alerts = [
      { deviceId: singleId, type: 'VoltageDrop', message: '메시지1', timestamp: new Date() },
      { deviceId: singleId, type: 'AvgTempHigh', message: '메시지2', timestamp: new Date() }
    ];

    beforeEach(async () => {
      await Alert.insertMany(alerts);
      mockDevice(singleId);
    });

    afterEach(async () => {
      await Alert.deleteMany({});
      clearMockDevice(singleId);
    });

    test('특정 장비 alert 삭제 성공', async () => {
      const res = await request(app).delete(`/api/alerts/${singleId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch(/삭제되었습니다/);

      const followUp = await request(app).get(`/api/alerts/${singleId}`);
      expect(followUp.statusCode).toBe(200);
      expect(followUp.body.length).toBe(0);
    });

    test('존재하지 않는 장비 ID 요청 시 404 반환', async () => {
      const res = await request(app).delete('/api/alerts/not-found-id');
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toMatch(/존재하지 않습니다/);
    });
  });
});
