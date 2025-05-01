import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Button, Form, Container, Alert as BootstrapAlert } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import io from 'socket.io-client';
import axios from 'axios';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
} from 'chart.js';
import {
  useFetchRunningDevices,
  useStartSimulator,
  useRestartSimulator,
  useDeleteSimulator,
  useDeleteAllSimulators 
} from '../../hooks/useSimulator';
import { usePredictState } from '../../hooks/usePredict';
import './SimulatorPage.style.css';
const API_BASE_URL = process.env.REACT_APP_BASE_URL;

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip);

const socket = io(`${API_BASE_URL}`);

const SimulatorPage = () => {
  const [deviceIdInput, setDeviceIdInput] = useState('');
  const [devices, setDevices] = useState([]);
  const [deviceDataMap, setDeviceDataMap] = useState({});
  const [alertsMap, setAlertsMap] = useState({});
  const [predictedMap, setPredictedMap] = useState({});
  const [activeKey, setActiveKey] = useState('');
  const [error, setError] = useState('');

  const { data: runningDevices } = useFetchRunningDevices();
  const startSimulator = useStartSimulator();
  const restartSimulator = useRestartSimulator();
  const deleteSimulator = useDeleteSimulator();
  const deleteAllSimulators = useDeleteAllSimulators();
  const predictState = usePredictState();

  //  서버에서 이미 실행중인 디바이스 복원
  useEffect(() => {
    const fetchInitialData = async () => {
      if (runningDevices) {
        setDevices(runningDevices);
        for (const deviceId of runningDevices) {
          try {
            const statusRes = await axios.get(`${API_BASE_URL}/api/status/${deviceId}`);
            const alertRes = await axios.get(`${API_BASE_URL}/api/alerts/${deviceId}`);

            setDeviceDataMap(prev => ({
              ...prev,
              [deviceId]: [...statusRes.data].reverse()
            }));

            setAlertsMap(prev => ({
              ...prev,
              [deviceId]: alertRes.data.map(alert => ({
                message: alert.message,
                timestamp: alert.timestamp
              }))
            }));

          } catch (err) {
            console.error(`초기 데이터 가져오기 실패: ${deviceId}`, err.message);
          }
        }
      }
    };
    fetchInitialData();
  }, [runningDevices]);

  //  실시간 socket 통신 설정
  useEffect(() => {
    socket.on('sensorData', (data) => {
      const { deviceId } = data;
      setDeviceDataMap(prev => ({
        ...prev,
        [deviceId]: [...(prev[deviceId] || []), data]
      }));
    });

    socket.on('alert', (data) => {
      const { deviceId, message, timestamp } = data;
      setAlertsMap(prev => ({
        ...prev,
        [deviceId]: [...(prev[deviceId] || []), { message, timestamp }]
      }));
    });

    return () => {
      socket.off('sensorData');
      socket.off('alert');
    };
  }, []);

  //  디바이스 추가
  const handleAddDevice = async (e) => {
    e.preventDefault();
    if (!deviceIdInput) {
      setError("Device ID를 입력해주세요.");
      return;
    }
  
    if (devices.includes(deviceIdInput)) {
      setError(`장비 ${deviceIdInput}(은)는 이미 생성된 시뮬레이터입니다.`);
      return;
    }
    try {
      await startSimulator.mutateAsync(deviceIdInput);
      setDevices(prev => [...prev, deviceIdInput]);
      setActiveKey(deviceIdInput);
      setDeviceIdInput('');
      setError('');
    } catch (err) {
      console.error('시뮬레이터 시작 실패:', err.message);
      setError('시뮬레이터 시작 실패');
    }
  };

  //  디바이스 재시작
  const handleRestart = async (deviceId) => {
    try {
      await restartSimulator.mutateAsync(deviceId);
      setDeviceDataMap(prev => ({ ...prev, [deviceId]: [] }));
      setAlertsMap(prev => ({ ...prev, [deviceId]: [] }));
      setPredictedMap(prev => ({ ...prev, [deviceId]: [] }));
    } catch (err) {
      console.error('시뮬레이터 재시작 실패:', err.message);
    }
  };

  //  디바이스 삭제
  const handleDelete = async (deviceId) => {
    try {
      await deleteSimulator.mutateAsync(deviceId);
      // alert(`${deviceId} 시뮬레이터 삭제 완료`);
      setDevices(prev => prev.filter(id => id !== deviceId));
      setActiveKey('');
      setDeviceDataMap(prev => {
        const copy = { ...prev };
        delete copy[deviceId];
        return copy;
      });
      setAlertsMap(prev => {
        const copy = { ...prev };
        delete copy[deviceId];
        return copy;
      });
      setPredictedMap(prev => {
        const copy = { ...prev };
        delete copy[deviceId];
        return copy;
      });
    } catch (err) {
      console.error('시뮬레이터 삭제 실패:', err.message);
    }
  };

  //  현재 상태 예측
  const handlePredict = async (deviceId) => {
    try {
      const result = await predictState.mutateAsync(deviceId);
      const now = new Date();
      const formatted = now.toLocaleTimeString();
      const prediction = `[${formatted}] 현재 상태는 ${result.predictedState}입니다.`;
      setPredictedMap(prev => ({
        ...prev,
        [deviceId]: [...(prev[deviceId] || []), prediction]
      }));
    } catch (err) {
      console.error('상태 예측 실패:', err.message);
    }
  };

  const renderChart = (deviceId, metric, color, label) => {
    const list = deviceDataMap[deviceId] || [];
    return (
      <Line
        data={{
          labels: list.map(d => new Date(d.timestamp).toLocaleTimeString()),
          datasets: [{
            label: label,
            data: list.map(d => d[metric.toLowerCase()]),
            borderColor: color,
            fill: false,
          }]
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          plugins: { legend: { position: 'top' } },
          scales: { y: { beginAtZero: true } }
        }}
      />
    );
  };

  return (
    <Container className="simulator-container">
      <h2>장비 시뮬레이터 모니터링</h2>

      <Form className="simulator-add-form" onSubmit={handleAddDevice}>
        <Form.Control
          type="text"
          placeholder="Device ID 입력"
          value={deviceIdInput}
          onChange={(e) => setDeviceIdInput(e.target.value)}
        />
        <Button type="submit" className="simulator-add-button" variant="primary">추가</Button>
        <Button
          variant="danger"
          className="simulator-delete-all-button"
          onClick={async () => {
            if (window.confirm('정말 모든 시뮬레이터와 기록을 삭제하시겠습니까?')) {
              await deleteAllSimulators.mutateAsync();
              setDevices([]);
              setDeviceDataMap({});
              setAlertsMap({});
              setPredictedMap({});
              setActiveKey('');
            }
          }}
        >
          전체 삭제
        </Button>
      </Form>

      {error && <BootstrapAlert variant="danger">{error}</BootstrapAlert>}

      <Tabs activeKey={activeKey} onSelect={(k) => setActiveKey(k)} className="mb-3">
        {devices.map(deviceId => (
          <Tab eventKey={deviceId} title={deviceId} key={deviceId}>
            <div className="simulator-tab-content">
              <div className="device-control-buttons">
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => {
                    if (window.confirm(`정말 ${deviceId} 시뮬레이터를 재시작하시겠습니까?`)) {
                      handleRestart(deviceId);
                    }
                  }}
                >
                  재시작
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    if (window.confirm(`정말 ${deviceId} 시뮬레이터를 삭제하시겠습니까?`)) {
                      handleDelete(deviceId);
                    }
                  }}
                >
                  삭제
                </Button>
              </div>

              <div className="graphs-container-row">
                <div className="graph-wrapper"><div className="graph-inner">{renderChart(deviceId, 'Temperature', 'red', '온도')}</div></div>
                <div className="graph-wrapper"><div className="graph-inner">{renderChart(deviceId, 'Humidity', 'orange', '습도')}</div></div>
              </div>
              <div className="graphs-container-row">
                <div className="graph-wrapper"><div className="graph-inner">{renderChart(deviceId, 'Voltage', 'blue', '전압')}</div></div>
                <div className="graph-wrapper"><div className="graph-inner">{renderChart(deviceId, 'Vibration', 'green', '진동')}</div></div>
              </div>

              <div className="info-box">
                <h5>Alert 알림</h5>
                <div className="alert-inner">
                  {alertsMap[deviceId]?.length > 0 ? alertsMap[deviceId].map((alert, idx) => (
                    <div key={idx}>
                      [{new Date(alert.timestamp).toLocaleTimeString()}] {alert.message}
                    </div>
                  )) : '(알림 없음)'}
                </div>

                <div className="predict-box">
                  <Button variant="secondary" size="sm" onClick={() => handlePredict(deviceId)}>
                    현재 상태 예측
                  </Button>
                  <div className="predict-result">
                    {predictedMap[deviceId]?.length > 0 ? predictedMap[deviceId].map((text, idx) => (
                      <div key={idx}>{text}</div>
                    )) : '(예측 기록 없음)'}
                  </div>
                </div>
              </div>
            </div>
          </Tab>
        ))}
      </Tabs>
    </Container>
  );
};

export default SimulatorPage;