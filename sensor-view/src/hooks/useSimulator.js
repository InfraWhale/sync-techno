import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// 실행중인 디바이스 목록 조회
export const useFetchRunningDevices = () => {
  return useQuery({
    queryKey: ['runningDevices'],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/api/simulator`);
      return res.data.runningDevices;
    },
  });
};

// 디바이스 시작
export const useStartSimulator = () => {
  return useMutation({
    mutationFn: async (deviceId) => {
      await axios.post(`${API_BASE_URL}/api/simulator/${deviceId}`);
    },
  });
};

// 디바이스 재시작
export const useRestartSimulator = () => {
  return useMutation({
    mutationFn: async (deviceId) => {
      await axios.post(`${API_BASE_URL}/api/simulator/restart/${deviceId}`);
    },
  });
};

// 디바이스 삭제
export const useDeleteSimulator = () => {
  return useMutation({
    mutationFn: async (deviceId) => {
      await axios.delete(`${API_BASE_URL}/api/simulator/${deviceId}`);
    },
  });
};

export const useDeleteAllSimulators = () => {
    return useMutation({
      mutationFn: async () => {
        await axios.delete(`${API_BASE_URL}/api/simulator`);
        await axios.delete(`${API_BASE_URL}/api/status`);
        await axios.delete(`${API_BASE_URL}/api/alerts`);
      }
    });
  };
