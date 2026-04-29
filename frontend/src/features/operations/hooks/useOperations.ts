import { useState, useEffect, useCallback } from 'react';
import { operationsApi } from '../api/operationsApi';
import { Operation } from '../types/operation.types';

export const useOperations = () => {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOperations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await operationsApi.getAll();
      setOperations(data);
    } catch (error) {
      console.error('Failed to fetch operations:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOperations();
    // Refresh operations every 30 seconds
    const interval = setInterval(fetchOperations, 30000);
    return () => clearInterval(interval);
  }, [fetchOperations]);

  return { operations, loading, refreshOperations: fetchOperations };
};
