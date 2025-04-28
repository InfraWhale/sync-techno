const request = require('supertest');
const app = require('../../../src/app');
const { devices } = require('../../../src/devices/simulator');
const mongoose = require('mongoose');

describe('Predict API - Full State Flow', () => {
  const testDeviceId = 'device-001';

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
    }
  });
  
  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(() => {
    for (const deviceId in devices) {
      delete devices[deviceId];
    }
  });

  afterEach(() => {
    for (const deviceId in devices) {
      delete devices[deviceId];
    }
  });

  test('Idle → Load → Overheat → Error 상태 변화를 반영한 예측 테스트', async () => {
    const now = Date.now();
    const startTime = now - 5 * 60 * 1000; // 5분 전

    devices[testDeviceId] = {
      startTime,
      sensorHistory: [
        // Idle 구간 (처음 30초)
        { timestamp: new Date(startTime + 5 * 1000).toISOString(), voltage: 3.3, vibration: 0.01, temperature: 26 },
        { timestamp: new Date(startTime + 10 * 1000).toISOString(), voltage: 3.3, vibration: 0.01, temperature: 26 },

        // Load 구간 (30초~3분)
        { timestamp: new Date(startTime + 40 * 1000).toISOString(), voltage: 3.4, vibration: 0.015, temperature: 27 },
        { timestamp: new Date(startTime + 90 * 1000).toISOString(), voltage: 3.5, vibration: 0.017, temperature: 28 },
        { timestamp: new Date(startTime + 150 * 1000).toISOString(), voltage: 3.3, vibration: 0.02, temperature: 27 },

        // Overheat 구간 (3분~4분)
        { timestamp: new Date(startTime + 200 * 1000).toISOString(), voltage: 5.0, vibration: 0.2, temperature: 45 },
        { timestamp: new Date(startTime + 220 * 1000).toISOString(), voltage: 5.5, vibration: 0.25, temperature: 44 },

        // Error 구간 (4분 이후)
        { timestamp: new Date(startTime + 260 * 1000).toISOString(), voltage: 0, vibration: 0, temperature: 30 },
        { timestamp: new Date(startTime + 270 * 1000).toISOString(), voltage: 0, vibration: 0, temperature: 30 },
      ]
    };

    // 테스트: 최종 상태를 예측
    const response = await request(app)
      .get(`/api/predict/${testDeviceId}`)
      .expect(200);

    expect(response.body.predictedState).toBe('Error');
  });
});
