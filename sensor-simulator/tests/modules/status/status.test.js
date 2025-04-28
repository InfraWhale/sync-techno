const request = require('supertest');
const app = require('../../../src/app');
const mongoose = require('mongoose');
const Status = require('../../../src/models/Status');

describe('Status API', () => {
  beforeAll(async () => {
    // 이미 app.js 안에서 connectDB() 했으면 별도 연결 필요 없음
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await Status.deleteMany({});  // 각 테스트 후 DB 깨끗하게 정리
  });

  const sampleStatus = {
    deviceId: "device-001",
    timestamp: new Date().toISOString(),
    temperature: 25.5,
    voltage: 3.3,
    vibration: 0.01
  };

  test('POST /api/status - 상태 저장 성공', async () => {
    const response = await request(app)
      .post('/api/status')
      .send(sampleStatus)
      .expect(201);

    expect(response.body.message).toBe("상태 저장 성공");

    const statuses = await Status.find({});
    expect(statuses.length).toBe(1);
    expect(statuses[0].deviceId).toBe(sampleStatus.deviceId);
  });

  test('GET /api/status/:deviceId - 특정 장비 상태 조회 성공', async () => {
    await new Status(sampleStatus).save();

    const response = await request(app)
      .get(`/api/status/${sampleStatus.deviceId}`)
      .expect(200);

    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].deviceId).toBe(sampleStatus.deviceId);
  });

  test('DELETE /api/status - 모든 상태 삭제 성공', async () => {
    await new Status(sampleStatus).save();

    const response = await request(app)
      .delete('/api/status')
      .expect(200);

    expect(response.body.message).toBe("모든 장비 상태 이력이 삭제되었습니다.");

    const statuses = await Status.find({});
    expect(statuses.length).toBe(0);
  });

  test('DELETE /api/status/:deviceId - 특정 장비 상태 삭제 성공', async () => {
    await new Status(sampleStatus).save();

    const response = await request(app)
      .delete(`/api/status/${sampleStatus.deviceId}`)
      .expect(200);

    expect(response.body.message).toContain(sampleStatus.deviceId);
    expect(response.body.deletedCount).toBe(1);

    const statuses = await Status.find({});
    expect(statuses.length).toBe(0);
  });
});
