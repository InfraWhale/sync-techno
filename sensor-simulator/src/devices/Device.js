const { randomInt, randomFloat } = require("../utils/randomNumber");

class Device {
  constructor(deviceId) {
    this.deviceId = deviceId;
    this.state = "Idle";
    this.startTime = Date.now();
    this.temperature = randomInt(24, 26);
    this.humidity = randomInt(40, 50);
    this.voltage = randomFloat(3.25, 3.35, 0.05);
    this.vibration = randomFloat(0.005, 0.015, 0.005);
    this.sensorHistory = [];
    this.stopped = false;
  }

  updateState() {
    const elapsed = (Date.now() - this.startTime) / 1000;
    if (this.state === "Idle" && elapsed >= 3) // 30으로 바꿀 것
      this.state = "Load"; 
    else if (this.state === "Load" && this.temperature >= 70)
      this.state = "Overheat";
    else if (
      this.state === "Overheat" &&
      this.voltage <= 2.6 &&
      this.vibration >= 0.1
    ) {
      this.state = "Error";
    }
  }

  generateSensorData() {
    this.updateState();

    switch (this.state) {
      case 'Idle':
        this.temperature = randomInt(24, 26);
        this.humidity = randomInt(40, 50);
        this.voltage = randomFloat(3.25, 3.35, 0.05);
        this.vibration = randomFloat(0.005, 0.015, 0.005);
      case "Load":
        this.temperature += randomInt(1, 2);
        this.humidity = Math.min(this.humidity + randomInt(2, 5), 100);
        this.voltage -= randomFloat(0.05, 0.1, 0.05);
        this.vibration += randomFloat(0.005, 0.01, 0.005);
        break;
      case "Overheat":
        this.temperature = randomInt(70, 80);
        this.humidity = randomInt(85, 95);
        this.voltage = randomFloat(2.6, 2.8, 0.05);
        this.vibration = randomFloat(0.08, 0.12, 0.005);
        break;
      case "Error":
        this.temperature = 80;
        this.humidity = 90;
        this.voltage = 0.0;
        this.vibration = 0.0;
        break;
    }

    return {
      deviceId: this.deviceId,
      timestamp: new Date().toISOString(),
      temperature: parseFloat(this.temperature.toFixed(1)),
      humidity: parseFloat(this.humidity.toFixed(1)),
      voltage: parseFloat(this.voltage.toFixed(2)),
      vibration: parseFloat(this.vibration.toFixed(3)),
    };
  }

  addToHistory(sensorData) {
    this.sensorHistory.push(sensorData);
  }

  // 전압 강하 확인
  checkVoltageDropAlert() {
    const now = Date.now();
    let count = 0;

    // 가장 최근 데이터부터 거꾸로 탐색
    for (let i = this.sensorHistory.length - 1; i >= 0; i--) {
      const data = this.sensorHistory[i];
      const age = now - new Date(data.timestamp).getTime();
      if (age > 6_000) break; // 1분 넘은 데이터는 무시하고 바로 끝냄 & 60_000 으로 바꾸기

      if (data.voltage < 2.9) {
        count++;
        if (count >= 3) return true; // 3개 연속 발견 시 true
      } else {
        count = 0; // 연속성 깨진 경우 count 초기화
      }
    }

    return false;
  }

  // 평균 온도 & 습도 확인
  checkAvgTempAndHumidityHighAlert() {
    const now = Date.now();
    const recentData = [];
  
    for (let i = this.sensorHistory.length - 1; i >= 0; i--) {
      const data = this.sensorHistory[i];
      const age = now - new Date(data.timestamp).getTime();
      if (age > 30_000) break; // 5분 넘으면 멈춤 & 300_000으로 바꾸기
      recentData.push(data);
    }
  
    if (recentData.length === 0) return false;

    // 5분간의 온도 및 습도 평균값 확인인
    const avgTemp =
      recentData.reduce((sum, d) => sum + d.temperature, 0) / recentData.length;
    
      const avgHumidity =
    recentData.reduce((sum, d) => sum + d.humidity, 0) / recentData.length;
  
    return avgTemp > 70 && avgHumidity > 80;
  }

  // 전압 감소 + 온도 증가 추세 확인
  checkTrendAlert() {
    if (this.sensorHistory.length < 2) return false;
  
    const len = this.sensorHistory.length;
    const prev = this.sensorHistory[len - 2];
    const curr = this.sensorHistory[len - 1];
  
    if (!prev || !curr) return false;
  
    return (prev.voltage > curr.voltage) && (prev.temperature < curr.temperature);
  }
}

module.exports = Device;
