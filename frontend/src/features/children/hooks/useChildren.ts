import { useState, useEffect, useCallback } from 'react';
import { childrenApi } from '../api/childrenApi';
import { Child } from '../types/child.types';
import { ChildFormValues } from '../schemas/childForm.schema';
import { useNotification } from '../../../context/NotificationContext';

export const useChildren = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showNotification } = useNotification();

  const fetchChildren = useCallback(async () => {
    try {
      setLoading(true);
      const data = await childrenApi.getAll();
      setChildren(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch children');
    } finally {
      setLoading(false);
    }
  }, []);

  const createChild = async (data: ChildFormValues) => {
    try {
      setLoading(true);
      const result = await childrenApi.create(data);
      await fetchChildren(); 
      setError(null);
      return result;
    } catch (err: any) {
      showNotification('Bolani kiritishda xatolik: ' + (err.response?.data?.error || err.message), 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateChild = async (id: string, data: ChildFormValues) => {
    try {
      setLoading(true);
      await childrenApi.update(id, data);
      await fetchChildren();
      setError(null);
    } catch (err: any) {
      showNotification('Yangilashda xatolik: ' + (err.response?.data?.error || err.message), 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteChild = async (id: string) => {
    try {
      setLoading(true);
      await childrenApi.delete(id);
      await fetchChildren();
      showNotification('Bola o\'chirildi', 'success');
      setError(null);
    } catch (err: any) {
      showNotification('O\'chirishda xatolik: ' + (err.response?.data?.error || err.message), 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  return {
    children,
    loading,
    error,
    createChild,
    updateChild,
    deleteChild,
    refetch: fetchChildren
  };
};
