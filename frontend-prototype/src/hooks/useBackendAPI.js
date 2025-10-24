/**
 * React Hook for Backend API Integration
 */

import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';

/**
 * Hook to fetch data from backend with loading/error states
 */
export function useBackendData(fetchFunction, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch Data = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Hook for workloads list
 */
export function useWorkloads(params = {}) {
  return useBackendData(() => apiService.getWorkloadsWithFallback(params), [JSON.stringify(params)]);
}

/**
 * Hook for current prices
 */
export function usePrices() {
  return useBackendData(() => apiService.getPricesWithFallback());
}

/**
 * Hook for queue status
 */
export function useQueueStatus() {
  return useBackendData(() => apiService.getQueueDepth());
}

/**
 * Hook for service health
 */
export function useServiceHealth() {
  return useBackendData(() => apiService.checkAllServices());
}

/**
 * Hook for recommendations
 */
export function useRecommendations() {
  return useBackendData(() => apiService.getRecommendations());
}

/**
 * Hook for submitting workloads
 */
export function useWorkloadSubmit() {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const submitWorkload = async (workloadData) => {
    try {
      setSubmitting(true);
      setError(null);
      const response = await apiService.submitWorkload(workloadData);
      setResult(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return { submitWorkload, submitting, result, error };
}

