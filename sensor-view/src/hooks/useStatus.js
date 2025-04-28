import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BASE_URL;

export const useFetchStatusHistory = (deviceId) => {
  return useQuery({
    queryKey: ['statusHistory', deviceId],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/api/status/${deviceId}`);
      return res.data;
    },
    enabled: !!deviceId
  });
};
