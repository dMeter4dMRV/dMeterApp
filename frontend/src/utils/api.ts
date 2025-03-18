import axios from 'axios';
import { DataVerification } from './dataSources';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface EnvironmentalData {
  id: string;
  value: number;
  location: string;
  dataType: string;
  unit: string;
  source: string;
  timestamp: number;
  verification?: DataVerification;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const environmentalDataApi = {
  submitData: async (data: Omit<EnvironmentalData, 'id' | 'timestamp' | 'submittedBy'>) => {
    const response = await api.post<EnvironmentalData>('/environmental-data', data);
    return response.data;
  },

  getData: async (params?: {
    startDate?: number;
    endDate?: number;
    location?: string;
    dataType?: string;
  }) => {
    const response = await api.get<EnvironmentalData[]>('/environmental-data', { params });
    return response.data;
  },

  getDataById: async (id: string) => {
    const response = await api.get<EnvironmentalData>(`/environmental-data/${id}`);
    return response.data;
  },
};

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

export const submitEnvironmentalData = async (data: Omit<EnvironmentalData, 'id' | 'timestamp'>): Promise<ApiResponse<EnvironmentalData>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/environmental-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred while submitting data',
    };
  }
};

export const fetchEnvironmentalData = async (): Promise<ApiResponse<EnvironmentalData[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/environmental-data`);
    const result = await response.json();
    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred while fetching data',
    };
  }
};

export const fetchDataByLocation = async (location: string): Promise<ApiResponse<EnvironmentalData[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/environmental-data/location/${encodeURIComponent(location)}`);
    const result = await response.json();
    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred while fetching location data',
    };
  }
};

export const fetchDataByType = async (dataType: string): Promise<ApiResponse<EnvironmentalData[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/environmental-data/type/${encodeURIComponent(dataType)}`);
    const result = await response.json();
    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred while fetching type data',
    };
  }
};

export const fetchDataByTimeRange = async (
  startDate: string,
  endDate: string
): Promise<EnvironmentalData[]> => {
  const response = await fetch(
    `${API_BASE_URL}/environmental-data/range?start=${startDate}&end=${endDate}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch data for time range');
  }
  return response.json();
}; 