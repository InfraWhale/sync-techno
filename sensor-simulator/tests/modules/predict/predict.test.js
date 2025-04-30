const request = require('supertest');
const app = require('../../../src/app');
const mongoose = require('mongoose');
const redisClient = require('../../../src/utils/redisClient');
const { mockDevice, clearMockDevice } = require('../../helpers/mockDevice');

describe('GET /api/predict/:deviceId', () => {
  const deviceId = 'predict-test-device';

  afterAll(async () => {
    await redisClient.quit();
    await mongoose.connection.close();
  });

  afterEach(() => {
    clearMockDevice(deviceId);
  });

  describe('Idle 상태 예측', () => {
    test('sensorHistory가 없을 경우 Idle', async () => {
      mockDevice(deviceId, {
        startTime: Date.now(),
        sensorHistory: []
      });

      const res = await request(app).get(`/api/predict/${deviceId}`).expect(200);
      expect(res.body.predictedState).toBe('Idle');
    });

    test('최근 데이터가 startTime으로부터 30초 이내일 경우 Idle', async () => {
      const now = Date.now();

      mockDevice(deviceId, {
        startTime: now,
        sensorHistory: [
          {
            timestamp: new Date(now + 500).toISOString(), // 5000으로 변경할것
            voltage: 3.0,
            vibration: 0.01
          }
        ]
      });

      const res = await request(app).get(`/api/predict/${deviceId}`).expect(200);
      expect(res.body.predictedState).toBe('Idle');
    });
  });

  describe('Error 상태 예측', () => {
    test('voltage, vibration이 0인 경우 Error', async () => {
      const now = Date.now();

      mockDevice(deviceId, {
        startTime: now,
        sensorHistory: [
          {
            timestamp: new Date(now + 3100).toISOString(), // 31000으로 변경할것
            voltage: 0,
            vibration: 0
          }
        ]
      });

      const res = await request(app).get(`/api/predict/${deviceId}`).expect(200);
      expect(res.body.predictedState).toBe('Error');
    });
  });

  describe('Overheat 상태 예측', () => {
    test('전압 혹은 진동 변화가 급격한 경우 Overheat', async () => {
      const now = Date.now();

      mockDevice(deviceId, {
        startTime: now,
        sensorHistory : [
          {
            timestamp: new Date(now + 31000).toISOString(),
            voltage: 3.0,
            vibration: 0.01
          },
          {
            timestamp: new Date(now + 32000).toISOString(),
            voltage: 2.95,
            vibration: 0.012
          },
          {
            timestamp: new Date(now + 33000).toISOString(),
            voltage: 2.9,
            vibration: 0.014
          },
          {
            timestamp: new Date(now + 34000).toISOString(),
            voltage: 2.85,
            vibration: 0.016
          },
          {
            timestamp: new Date(now + 35000).toISOString(),
            voltage: 2.8,
            vibration: 0.018
          },
          {
            timestamp: new Date(now + 36000).toISOString(),
            voltage: 2.75,
            vibration: 0.02
          },
          {
            timestamp: new Date(now + 37000).toISOString(),
            voltage: 2.7,
            vibration: 0.022
          },
          {
            timestamp: new Date(now + 38000).toISOString(),
            voltage: 2.65,
            vibration: 0.024
          },
          {
            timestamp: new Date(now + 39000).toISOString(),
            voltage: 1.0, // 급격한 전압 하강
            vibration: 0.25 // 급격한 진동 상승
          },
          {
            timestamp: new Date(now + 40000).toISOString(),
            voltage: 1.05,
            vibration: 0.27
          }
        ]
      });

      const res = await request(app).get(`/api/predict/${deviceId}`).expect(200);
      expect(res.body.predictedState).toBe('Overheat');
    });
  });

  describe('Load 상태 예측', () => {
    test('기본적인 가동 상태일 경우 Load', async () => {
      const now = Date.now();

      mockDevice(deviceId, {
        startTime: now,
        sensorHistory: [
          {
            timestamp: new Date(now + 3100).toISOString(), // 31000으로 변경할것
            voltage: 3.0,
            vibration: 0.01
          },
          {
            timestamp: new Date(now + 3200).toISOString(), // 32000으로 변경할것
            voltage: 3.1,
            vibration: 0.02
          }
        ]
      });

      const res = await request(app).get(`/api/predict/${deviceId}`).expect(200);
      expect(res.body.predictedState).toBe('Load');
    });
  });

  test('존재하지 않는 장비 요청 시 404 반환', async () => {
    const res = await request(app).get('/api/predict/non-existent-device').expect(404);
    expect(res.body.message).toMatch(/존재하지 않습니다/);
  });
});