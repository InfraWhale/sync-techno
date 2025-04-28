const request = require('supertest');
const app = require('../../../src/app');
const mongoose = require('mongoose');
const Alert = require('../../../src/models/Alert');

describe('Alert API', () => {
  beforeAll(async () => {
    // 이미 app.js 안에서 connectDB() 호출함
  });

  beforeEach(async () => {
    await Alert.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  const sampleAlert = {
    deviceId: "device-001",
    timestamp: new Date().toISOString(),
    alertType: "VoltageDrop",
    details: "전압이 급격히 떨어졌습니다."
  };

  test('GET /api/alerts - 전체 Alert 조회 성공', async () => {
    await new Alert(sampleAlert).save();

    const response = await request(app)
      .get('/api/alerts')
      .expect(200);

    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].deviceId).toBe(sampleAlert.deviceId);
  });

  test('GET /api/alerts/:deviceId - 특정 Alert 조회 성공', async () => {
    await new Alert(sampleAlert).save();

    const response = await request(app)
      .get(`/api/alerts/${sampleAlert.deviceId}`)
      .expect(200);

    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].deviceId).toBe(sampleAlert.deviceId);
  });

  test('DELETE /api/alerts - 전체 Alert 삭제 성공', async () => {
    await new Alert(sampleAlert).save();

    const response = await request(app)
      .delete('/api/alerts')
      .expect(200);

    expect(response.body.message).toContain('삭제');
    const alerts = await Alert.find({});
    expect(alerts.length).toBe(0);
  });

  test('DELETE /api/alerts/:deviceId - 특정 Alert 삭제 성공', async () => {
    await new Alert(sampleAlert).save();

    const response = await request(app)
      .delete(`/api/alerts/${sampleAlert.deviceId}`)
      .expect(200);

    expect(response.body.message).toContain(sampleAlert.deviceId);
    expect(response.body.deletedCount).toBe(1);
  });
});
