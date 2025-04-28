import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const useFetchAlerts = (deviceId) => {
  return useQuery({
    queryKey: ['alerts', deviceId],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/api/alerts/${deviceId}`);
      return res.data;
    },
    enabled: !!deviceId
  });
};
