import { useState, useEffect } from 'react';
import {
  EnvironmentalData,
  fetchEnvironmentalData,
  fetchDataByLocation,
  fetchDataByType,
  fetchDataByTimeRange,
  submitEnvironmentalData,
} from '../utils/api';
import { DataVerification } from '../utils/dataSources';

interface UseEnvironmentalDataOptions {
  location?: string;
  dataType?: string;
  startDate?: string;
  endDate?: string;
}

interface UseEnvironmentalDataReturn {
  data: EnvironmentalData[];
  loading: boolean;
  error: Error | null;
  submitData: (data: Omit<EnvironmentalData, 'id' | 'timestamp'>) => Promise<void>;
  fetchByLocation: (location: string) => Promise<void>;
  fetchByType: (dataType: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

export const useEnvironmentalData = (): UseEnvironmentalDataReturn => {
  const [data, setData] = useState<EnvironmentalData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchEnvironmentalData();
      if (response.success && response.data) {
        setData(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const submitData = async (formData: Omit<EnvironmentalData, 'id' | 'timestamp'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await submitEnvironmentalData(formData);
      if (response.success && response.data) {
        setData((prev) => [...prev, response.data]);
      } else {
        throw new Error(response.error || 'Failed to submit data');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchByLocation = async (location: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchDataByLocation(location);
      if (response.success && response.data) {
        setData(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch location data');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const fetchByType = async (dataType: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchDataByType(dataType);
      if (response.success && response.data) {
        setData(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch type data');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    submitData,
    fetchByLocation,
    fetchByType,
    refreshData: fetchData,
  };
}; 