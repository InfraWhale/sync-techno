import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const usePredictState = () => {
  return useMutation({
    mutationFn: async (deviceId) => {
      const res = await axios.get(`${API_BASE_URL}/api/predict/${deviceId}`);
      return res.data;
    }
  });
};
