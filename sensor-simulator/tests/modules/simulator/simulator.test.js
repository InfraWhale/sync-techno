const request = require('supertest');
const app = require('../../../src/app');
const { devices, stopDevice } = require('../../../src/devices/simulator');
const mongoose = require('mongoose');

jest.mock('../../../src/analyser/analyser', () => {});

describe('Simulator API - 시뮬레이터 기본 흐름 테스트', () => {
  const testDeviceId = 'simulator-test-001';

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
    }
  });
  
    afterAll(async () => {
      await mongoose.disconnect();
    });

  beforeEach(() => {
    // 혹시 이미 떠 있는 디바이스가 있으면 정리
    if (devices[testDeviceId]) {
      stopDevice(testDeviceId);
    }
  });

  afterEach(() => {
    // 테스트 후에도 꼭 정리
    if (devices[testDeviceId]) {
      stopDevice(testDeviceId);
    }
  });

  test('POST /api/simulator/:deviceId - 시뮬레이터 생성 및 devices 등록 확인', async () => {
    const response = await request(app)
      .post(`/api/simulator/${testDeviceId}`)
      .expect(200);

    expect(response.body.message).toContain('시뮬레이션을 시작합니다');
    expect(devices[testDeviceId]).toBeDefined();

    stopDevice(testDeviceId);

    expect(devices[testDeviceId]).toBeUndefined();
  });

  test('POST /api/simulator/restart/:deviceId - 시뮬레이터 재시작 시 startTime 갱신 확인', async () => {
    // 1. 장비 시작
    await request(app)
      .post(`/api/simulator/${testDeviceId}`)
      .expect(200);
  
    expect(devices[testDeviceId]).toBeDefined();
  
    const beforeRestartStartTime = devices[testDeviceId].startTime;
    expect(beforeRestartStartTime).toBeDefined();
  
    // 2. 약간 대기 (startTime 차이를 명확히 하기 위해)
    await new Promise((resolve) => setTimeout(resolve, 10));
  
    // 3. restart 호출
    const response = await request(app)
      .post(`/api/simulator/restart/${testDeviceId}`)
      .expect(200);
  
    // 4. startTime이 갱신됐는지 확인
    const afterRestartStartTime = devices[testDeviceId].startTime;
    expect(afterRestartStartTime).toBeDefined();
    expect(afterRestartStartTime).not.toBe(beforeRestartStartTime);
    expect(afterRestartStartTime).toBeGreaterThan(beforeRestartStartTime);
  
    // 5. devices 확인
    expect(devices[testDeviceId]).toBeDefined();
  
    // 6. 정리
    stopDevice(testDeviceId);
    expect(devices[testDeviceId]).toBeUndefined();
  });

  test('GET /api/simulator - 실행 중인 장비 목록 조회', async () => {
    const deviceId1 = 'simulator-test-001';
    const deviceId2 = 'simulator-test-002';
  
    await request(app).post(`/api/simulator/${deviceId1}`).expect(200);
    await request(app).post(`/api/simulator/${deviceId2}`).expect(200);
  
    const response = await request(app)
      .get('/api/simulator')
      .expect(200);
  
    expect(response.body.runningDevices).toContain(deviceId1);
    expect(response.body.runningDevices).toContain(deviceId2);
  
    // 정리
    stopDevice(deviceId1);
    stopDevice(deviceId2);
  });
  
  test('DELETE /api/simulator/:deviceId - 특정 장비 삭제', async () => {
    const deviceId = 'simulator-test-003';
  
    await request(app).post(`/api/simulator/${deviceId}`).expect(200);
    expect(devices[deviceId]).toBeDefined();
  
    const response = await request(app)
      .delete(`/api/simulator/${deviceId}`)
      .expect(200);
  
    expect(response.body.message).toContain(`${deviceId} 시뮬레이션이 삭제되었습니다.`);
    expect(devices[deviceId]).toBeUndefined();
  });
  
  test('DELETE /api/simulator - 모든 장비 삭제', async () => {
    const deviceId1 = 'simulator-test-004';
    const deviceId2 = 'simulator-test-005';
  
    await request(app).post(`/api/simulator/${deviceId1}`).expect(200);
    await request(app).post(`/api/simulator/${deviceId2}`).expect(200);
  
    expect(devices[deviceId1]).toBeDefined();
    expect(devices[deviceId2]).toBeDefined();
  
    const response = await request(app)
      .delete('/api/simulator')
      .expect(200);
  
    expect(response.body.message).toContain('모든 시뮬레이션이 삭제되었습니다.');
    expect(Object.keys(devices).length).toBe(0);
  });
});