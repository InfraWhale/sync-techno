# 지능형 장비 상태 분석 및 이상 패턴 탐지 시스템 과제

## 프로젝트 구성

백엔드 프로젝트 **sensor-simulator** 및 프론트엔드 프로젝트 **sensor-view**로 구성되어 있습니다. 각각 **Express.js** 및 **React**로 개발하였습니다. 

프론트엔드는 **Vercel**, 백엔드는 **AWS EC2, nginx** 및 **Github Actions**를 이용하여 배포하였으며 배포 결과물은 아래에서 확인 가능합니다.

https://sync-techno-sensor.vercel.app/

## 백엔드 구성

다음과 같이 모듈화하였습니다.

- **src** : 서버 실행을 위한 코드로 구성되어 있습니다.
    - **analyser** : sensor data를 받아 저장 및 alert를 분석하는 역할을 합니다.
    - **devices** : 각 시뮬레이터 장비를 생성 ,작동, 소멸시키는 역할을 합니다.
    - **events** : eventBus를 통해 device에서 생성한 메시지를 analyser로 전송합니다.
    - **routes** : api의 엔드포인트가 모여있습니다. swagger 주석 또한 여기서 확인 가능합니다.
    - **modules** : api의 실제 실행 코드가 있습니다. 각 도메인별로 controller, service, repository로 구분되어 있습니다.
    - **app.js** : Express 앱을 구성하고 export하는 역할을 합니다.
    - **server.js** : app.js를 가저와서 서버를 실행하고 부팅 시 설정하는 역할을 합니다.
- **tests** : jest를 이용한 API 테스트 코드로 구성되어 있습니다.

db는 **mongo db**를 사용했고 센서 및 알림 정보 실시간 정보를 위해 **socket.io**, 캐싱 및 서버 재부팅 시 device 데이터 복구를 위해 **redis**를 사용했습니다.

## 프론트엔드 구성

src 폴더 아래 다음과 같이 모듈화 하였습니다.

- **components** : 각 화면에 공통으로 쓰이는 컴포넌트가 있습니다. Navbar가 위치합니다.
- **hooks** : 리액트 쿼리를 사용하여 만든 커스텀 훅이 위치해 있습니다. api 호출에 사용합니다.
- **pages** : 각 페이지의 jsx 및 css가 있습니다.

## 시뮬레이터 화면 설명

- 홈 페이지
  
    ![image](https://github.com/user-attachments/assets/321137c1-cda9-4f23-bbc7-71c488c4e51b)
    
    - 시뮬레이터 및 API 문서로 이동 가능합니다.
    - 위에 있는 내비게이션 바에서도 같은 기능을 지원합니다.
- 시뮬레이터 페이지
  
    ![image 1](https://github.com/user-attachments/assets/66aa2e5e-6e48-435a-ae84-b18a4249c7d1)
    
    - 장비 시뮬레이터를 생성, 재시작, 삭제, 전체 삭제할 수 있습니다.
        - Device ID를 입력하고 추가를 누르면 장비가 새로 생성됩니다. 장비명은 중복될 수 없습니다.
        - 실행 중인 장비를 재시작 할 경우 데이터가 모두 초기화되고 시뮬레이션을 다시 시작합니다.
        - 삭제를 눌러 1개의 장비를 삭제하거나 전체 삭제를 눌러 모든 장비를 삭제할 수 있습니다.
    - 시뮬레이터가 생성될 경우 별도 탭으로 관리되며, 서버에서 실시간으로 데이터를 받아 그래프로 보여줍니다.
      
    ![image 2](https://github.com/user-attachments/assets/7ba1935a-1cde-423e-a873-72c8f10fc622)

    - alert 또한 발생할 경우 실시간으로 화면에 보여집니다.
    - 현재 상태 예측 버튼을 누르면 센서값들을 분석하여 현재 상태를 예측하여 표시해줍니다.
- API 문서 페이지
  
    ![image 3](https://github.com/user-attachments/assets/06ca0e0c-8964-443d-b992-a20cc68387da)
    
    - swagger를 사용한 API 문서를 확인할 수 있습니다.

## 시뮬레이터 작동 방식

### simulator.js

**장비 생성**

```jsx
async function initializeDevice(deviceId, data = null) {
  const device = new Device(deviceId);
  if (data) {
    device.state = data.state || "Idle";
    device.startTime = data.startTime ? parseInt(data.startTime, 10) : Date.now();
    device.temperature = data.temperature ? parseFloat(data.temperature) : 25.0;
    device.humidity = data.humidity ? parseFloat(data.humidity) : 45.0;
    device.voltage = data.voltage ? parseFloat(data.voltage) : 3.3;
    device.vibration = data.vibration ? parseFloat(data.vibration) : 0.01;
    device.stopped = data?.stopped === 'true';
  }

  device.sensorHistory = await loadSensorHistoryFromMongo(deviceId);

  setDevice(deviceId, device);

  if (!device.stopped) {
    device.interval = setInterval(async () => {
      const sensorData = device.generateSensorData();
      eventBus.emit('sensorData', sensorData);

      redisClient.hSet(`device:${deviceId}`, {
        temperature: device.temperature,
        humidity: device.humidity,
        voltage: device.voltage,
        vibration: device.vibration
      });

      if (device.state === "Error") {
        device.stopped = true;
        clearInterval(device.interval);

        redisClient.hSet(`device:${device.deviceId}`, {
          stopped: 'true'
        });
      }
    }, 10*SECOND);
  } else {
    console.log(`장비 ${deviceId}는 중지 상태. 시뮬레이션 실행 안 함.`);
  }

  return device;
}
```

**initializeDevice**가 호출되어 장비를 초기화합니다. 해당 함수가 호출되는 경우는 2가지가 있습니다.

1. api에 의해 장비가 생성되거나 재시작되어 **startDevice**가 호출된 경우
2. 서버가 재시작되어 **restoreDevicesOnStartup**가 호출된 경우
    1. 이때  redis에 있는 데이터를 토대로  장비를 복구합니다.

해당 함수에서 새로운 장비를 만들고, device의 Map인 devices에 새로운 장비를 등록하며, setInterval을 통해 10초에 한번씩 Analyser에 센서데이터를 보냅니다.

**장비 삭제**

```jsx
async function stopDevice(deviceId) {
  const device = getDevice(deviceId);
  if (device) {
    clearInterval(device.interval);
    removeDevice(deviceId);

    await redisClient.lRem('devices', 0,  deviceId);
    await redisClient.del(`device:${deviceId}`);
    await redisClient.del(`status:${deviceId}`);
    await redisClient.del(`alerts:${deviceId}`);
  }
}
```

**stopDevice**가 호출되어 장비를 삭제합니다.

clearInterval을 통해 센서데이터 송신을 중단하고 devices에서 장비를 지우고 redis에서도 삭제합니다. 이때 db에 있는 sensor 및 alert 데이터를 삭제하지는 않습니다. 이는 클라이언트에서 별도로 api를 호출하여 수행합니다.

### **Device.js**

**장비 객체 구조**

```jsx
class Device {
  constructor(deviceId) {
    this.deviceId = deviceId;
    this.state = "Idle"; // 장비 상태
    this.startTime = Date.now(); // 생성 시각
    this.temperature = randomInt(24, 26); // 온도 
    this.humidity = randomInt(40, 50); // 습도
    this.voltage = randomFloat(3.25, 3.35, 0.05); // 전압
    this.vibration = randomFloat(0.005, 0.015, 0.005); // 진동
    this.sensorHistory = []; // 센서값 저장 배열
    this.stopped = false; // 장비 정지 여부
  }
```

**장비 상태 업데이트**

```jsx
  updateState() {
    const elapsed = (Date.now() - this.startTime);
    if (this.state === "Idle" && elapsed >= 30*SECOND)
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
```

과제 명세에 있는 규칙과 동일하게 장비 상태를 전이합니다.

**장비 센서값 업데이트**

```jsx
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
```

과제 명세에 있는 규칙과 동일하게 센서 값을 업데이트합니다.

**장비 센서값 저장**

```jsx
  addToHistory(sensorData) {
    this.sensorHistory.push(sensorData);
  }
```

장비 객체 안에 있는 배열에 새로운 센서 값 객체를 저장합니다.

## Alert 감지 로직

### **analyser.js**

**Alert 감지**

```jsx
eventBus.on("sensorData", async (data) => {

	...

  const device = getDevice(data.deviceId);
  if (!device) return;
  // 전압 강하 Alert
  if (device.checkVoltageDropAlert()) {
    const message = `1분간 전압이 2.9V 미만인 상태가 3회 이상 발생했습니다. (현재 전압: ${data.voltage}V)`;
    sendAlert(data.deviceId, "VoltageDrop", message);
  }

  // 평균 온도 & 습도 Alert
  if (device.checkAvgTempAndHumidityHighAlert()) {
    const message = `최근 5분간 평균 온도 70°C, 평균 습도 80%를 초과했습니다. (현재 온도: ${data.temperature}°C, 현재 습도: ${data.humidity}°C)`;
    sendAlert(data.deviceId, "AvgTempAndHumidityHigh", message);
  }

  // 전압 감소 + 온도 증가 추세 Alert
  if (device.checkTrendAlert()) {
    const message = `전압 감소 및 온도 상승 추세가 감지되었습니다. (현재 전압: ${data.voltage}V, 온도: ${data.temperature}°C)`;
    sendAlert(data.deviceId, "TrendAnomaly", message);
  }
```

checkVoltageDropAlert, checkAvgTempAndHumidityHighAlert, checkTrendAlert를 통해 Alert발생 여부를 판단합니다. 발생 시 sendAlert를 통해 데이터를 db에 저장하고 클라이언트에 전송합니다.

### Device.js

**Alert 판별**

```jsx
  // 전압 강하 확인
  checkVoltageDropAlert() {
    const now = Date.now();
    let count = 0;

    // 가장 최근 데이터부터 거꾸로 탐색
    for (let i = this.sensorHistory.length - 1; i >= 0; i--) {
      const data = this.sensorHistory[i];
      const age = now - new Date(data.timestamp).getTime();
      if (age > 60*SECOND) break; // 1분 넘은 데이터는 무시하고 바로 끝냄

      if (data.voltage < 2.9) {
        count++;
        if (count >= 3) return true; // 3개 연속 발견 시 true
      } else {
        count = 0; // 연속성 깨진 경우 count 초기화
      }
    }

    return false;
  }
```

sensorHistory 배열에서 1분 이내의 데이터만 사용합니다. 연속적으로 3개의 데이터가 전압 2.9 미만이라면 true를 반환합니다.

```jsx
  // 평균 온도 & 습도 확인
  checkAvgTempAndHumidityHighAlert() {
    const now = Date.now();
    const recentData = [];
  
    for (let i = this.sensorHistory.length - 1; i >= 0; i--) {
      const data = this.sensorHistory[i];
      const age = now - new Date(data.timestamp).getTime();
      if (age > 300*SECOND) break; // 5분 넘으면 멈춤
      recentData.push(data);
    }
  
    if (recentData.length === 0) return false;

    // 5분간의 온도 및 습도 평균값 확인
    const avgTemp =
      recentData.reduce((sum, d) => sum + d.temperature, 0) / recentData.length;
    
      const avgHumidity =
    recentData.reduce((sum, d) => sum + d.humidity, 0) / recentData.length;
  
    return avgTemp > 70 && avgHumidity > 80;
  }
```

sensorHistory 배열에서 5분 이내의 데이터만 사용합니다. 온도와 습도의 평균값을 각각 구하여 온도 70도 초과, 습도 80% 초과인 경우 true를 반환합니다.

```jsx
   // 전압 감소 + 온도 증가 추세 확인
  checkTrendAlert() {
    if (this.sensorHistory.length < 2) return false;
  
    const len = this.sensorHistory.length;
    const prev = this.sensorHistory[len - 2];
    const curr = this.sensorHistory[len - 1];
  
    if (!prev || !curr) return false;
  
    return (prev.voltage > curr.voltage) && (prev.temperature < curr.temperature);
  }
```

sensorHistory 배열에서 마지막 2개의 값만을 사용합니다. 전압이 감소하였고 온도가 증가하였다면 true를 반환합니다.

## API 구성

### status

| METHOD | URL | 설명 |
| --- | --- | --- |
| POST | /api/status | 특정 장비의 센서 상태 이력을 저장합니다. |
| DELETE | /api/status | 전체 장비 상태 이력을 삭제합니다. |
| GET | /api/status/:deviceId | 특정 장비의 상태 이력을 조회합니다. |
| DELETE | /api/status/:deviceId | 특정 장비의 상태 이력을 삭제합니다. |

### alert

| METHOD | URL | 설명 |
| --- | --- | --- |
| GET | /api/alerts | 전체 장비 alert 이력을 조회합니다. |
| DELETE | /api/alerts | 전체 장비 alert 이력을 삭제합니다. |
| GET | /api/alerts/:deviceId | 특정 장비의 alert 이력을 조회합니다. |
| DELETE | /api/alerts/:deviceId | 특정 장비의 alert 이력을 삭제합니다. |

### predict

| METHOD | URL | 설명 |
| --- | --- | --- |
| GET | /api/predict/:deviceId | 현재 장비 상태를 예측합니다. (Idle, Load, Overheat, Error) |

### simulator

| METHOD | URL | 설명 |
| --- | --- | --- |
| POST | /api/simulator/start/:deviceId | 장비 시뮬레이션을 시작합니다. 아래 restart와 다른 점으로는, 해당 API는 같은 이름의 장비가 이미 실행중일 때 호출이 허용되지 않지만, restart의 경우는 장비를 초기화하고 재시작합니다. |
| POST | /api/simulator/restart/:deviceId | 장비 시뮬레이션을 재시작합니다. 요구사항에서는 /api/restart/:deviceId였으나 simulator 관련 api가 늘어나 변경하였습니다. |
| GET | /api/simulator | 현재 실행중인 장비 목록을 조회합니다. |
| DELETE | /api/simulator | 전체 장비 시뮬레이터를 중지합니다. |
| DELETE | /api/simulator/:deviceId | 특정 장비 시뮬레이터를 중지합니다. |

상세 문서는 아래 페이지를 확인 바랍니다.

https://sync-techno-sensor.vercel.app/api-docs-viewer

## predict API 로직

**predictService.js**에서 판별합니다. Device객체의 sensorHistory 배열을 통해 판별합니다.

### Idle

```jsx
  if (history.length === 0) {
    return "Idle";
  }
  
 ...
  
  function isIdle(history, startTime) {
  const lastTimestamp = new Date(
    history[history.length - 1].timestamp
  ).getTime();
  return lastTimestamp - startTime <= 30*SECOND;
}
```

장비가 생성된지 얼마 되지 않은 상태입니다.

sensorHistory에 데이터가 없거나, 마지막 데이터의 생성 시각과 장비의 생성 시각의 차가 30초 이하인 경우 Idle 로 판별합니다.

### Error

```
function isError(lastData) {
  return lastData.voltage === 0 && lastData.vibration === 0;
}
```

장비가 오류로 정지된 상태입니다.

마지막 데이터의 전압 및 진동이 0으로 나오면 Error로 판별합니다.

### Overheat

```jsx
function isOverheat(history, startTime) {
  const filteredHistory = history.filter(
    (d) => new Date(d.timestamp).getTime() - startTime > 30*SECOND
  );

  if (filteredHistory.length < 2) return false;

  const voltageChanges = [];
  const vibrationChanges = [];

  for (let i = 1; i < filteredHistory.length; i++) {
    const prev = filteredHistory[i - 1];
    const curr = filteredHistory[i];

    voltageChanges.push(Math.abs(curr.voltage - prev.voltage));
    vibrationChanges.push(Math.abs(curr.vibration - prev.vibration));
  }

  const avgVoltageChange =
    voltageChanges.reduce((a, b) => a + b, 0) / voltageChanges.length;
  const avgVibrationChange =
    vibrationChanges.reduce((a, b) => a + b, 0) / vibrationChanges.length;

  const voltageOverThreshold = voltageChanges.some(
    (change) => change > avgVoltageChange * 3
  );
  const vibrationOverThreshold = vibrationChanges.some(
    (change) => change > avgVibrationChange * 3
  );

  return voltageOverThreshold || vibrationOverThreshold;
}
```

데이터만으로 Overheat를 판별하기 위해 먼저 그래프를 보겠습니다.

![image 4](https://github.com/user-attachments/assets/76d9b750-21e1-4acf-b783-2382ef236dbb)


온도와 습도의 경우는 대체적으로 원만한 변화를 보이지만, 전압과 진동의 경우는 Overheat에 진입하면 급격한 변화를 보여줍니다. 따라서 지표가 명확한 전압과 진동을 판단 기준으로 잡았습니다.

우선 Idle 상태에서의 데이터를 제외한 나머지 데이터의 변화량을 전부 수집합니다. 

그리고 변화량의 평균값을 구한 후, 특정 구간에서 평균 변화량의 3배의 변화를 보여주는 지점이 하나라도 있다면 Overheat로 판단합니다.

### Load

위의 3가지를 제외한 나머지인 경우 Load로 판단합니다.

## 테스트 결과

테스트 코드를 이용하여 로컬 테스트 시 다음과 같이 통과하였습니다.

![image 5](https://github.com/user-attachments/assets/e4313721-bb17-4b5d-b005-baa44c72a91b)

또한 github Actions를 이용한 CI/CD 과정에서도 테스트 과정을 넣어 배포 전 안정성을 검사했습니다. 다음과 같이 통과하였습니다.

![image 6](https://github.com/user-attachments/assets/d9c739b6-2fa4-4404-b8e0-a87174a11a66)

## 백엔드 테스트 절차

서버가 이미 배포되었으므로 API 테스트가 바로 가능한 상태입니다. 첨부된 postman 컬렉션을 이용하여 테스트해 주시면 됩니다. 환경변수는 api-production을 사용해주시기 바랍니다.

만약 로컬에서 테스트할 경우 다음 절차로 진행해주시면 됩니다.

1. 다음 절차로 서버를 시작합니다.

```bash
# 1. 저장소를 클론받습니다.
git clone https://github.com/InfraWhale/sync-techno.git

# 2. sensor-simulator 폴더로 이동합니다. 그후 의존성을 설치합니다.
# 안된다면 node.js, npm을 설치합니다.
cd syncTechno/sensor-simulator
npm ci # 혹은 npm i

# 3. 첨부된 .env 및 .env.test를 sensor-simulator폴더에 넣습니다.

# 4. 서버를 시작합니다.
npm start
```

1. 마찬가지로 첨부된 postman 컬렉션을 이용하여 테스트해 주시면 됩니다. 환경변수는 api-local을 사용해주시기 바랍니다.
2. 테스트코드를 실행할 경우 `npm test`로 진행해주시면 됩니다.
