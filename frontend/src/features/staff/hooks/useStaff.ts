import { useState, useEffect, useCallback } from 'react';
import { staffApi } from '../api/staffApi';
import { Staff } from '../types/staff.types';
import { StaffFormValues } from '../schemas/staffForm.schema';
import { useNotification } from '../../../context/NotificationContext';

export const useStaff = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  const fetchStaff = useCallback(async () => {
    try {
      setLoading(true);
      const data = await staffApi.getAll();
      setStaff(data);
    } catch (error) {
      console.error('Failed to fetch staff:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const createStaff = async (data: StaffFormValues) => {
    try {
      const result = await staffApi.create(data);
      await fetchStaff();
      return result;
    } catch (error: any) {
      showNotification('Xodimni kiritishda xatolik: ' + (error.response?.data?.error || error.message), 'error');
      throw error;
    }
  };

  const updateStaff = async (id: string, data: StaffFormValues) => {
    try {
      await staffApi.update(id, data);
      await fetchStaff();
    } catch (error: any) {
      showNotification('Yangilashda xatolik: ' + (error.response?.data?.error || error.message), 'error');
      throw error;
    }
  };

  const deleteStaff = async (id: string) => {
    try {
      await staffApi.delete(id);
      await fetchStaff();
      showNotification('Xodim o\'chirildi', 'success');
    } catch (error: any) {
      showNotification('O\'chirishda xatolik: ' + (error.response?.data?.error || error.message), 'error');
      throw error;
    }
  };

  return { staff, loading, createStaff, updateStaff, deleteStaff, refreshStaff: fetchStaff };
};
