import { useState, useEffect, useCallback } from 'react';
import { groupsApi } from '../api/groupsApi';
import { Group } from '../types/group.types';
import { GroupFormValues } from '../schemas/groupForm.schema';
import { useNotification } from '../../../context/NotificationContext';

export const useGroups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showNotification } = useNotification();

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      const data = await groupsApi.getAll();
      setGroups(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  }, []);

  const createGroup = async (data: GroupFormValues) => {
    try {
      setLoading(true);
      await groupsApi.create(data);
      await fetchGroups();
      showNotification('Guruh muvaffaqiyatli yaratildi!', 'success');
    } catch (err: any) {
      showNotification('Xatolik: ' + (err.response?.data?.error || err.message), 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateGroup = async (id: string, data: GroupFormValues) => {
    try {
      setLoading(true);
      await groupsApi.update(id, data);
      await fetchGroups();
      showNotification('Guruh muvaffaqiyatli yangilandi!', 'success');
    } catch (err: any) {
      showNotification('Xatolik: ' + (err.response?.data?.error || err.message), 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteGroup = async (id: string) => {
    try {
      setLoading(true);
      await groupsApi.delete(id);
      await fetchGroups();
      showNotification('Guruh o\'chirildi!', 'success');
      setError(null);
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'O‘chirishda xatolik';
      if (msg.includes('FOREIGN KEY constraint failed')) {
        showNotification('Ushbu guruhni o‘chirib bo‘lmaydi, chunki unda bolalar yoki xodimlar mavjud.', 'error');
      } else {
        showNotification('Xatolik: ' + msg, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return { groups, loading, error, createGroup, updateGroup, deleteGroup, refetch: fetchGroups };
};
