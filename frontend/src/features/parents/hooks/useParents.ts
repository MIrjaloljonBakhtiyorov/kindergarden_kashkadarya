import { useState, useEffect, useCallback } from 'react';
import { parentsApi } from '../api/parentsApi';
import { ParentPortalUser } from '../types/parentPortal.types';

export const useParents = () => {
  const [parents, setParents] = useState<ParentPortalUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchParents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await parentsApi.getAll();
      setParents(data);
    } catch (error) {
      console.error('Failed to fetch parent profiles:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchParents();
  }, [fetchParents]);

  const updateParent = async (id: string, data: any) => {
    await parentsApi.update(id, data);
    await fetchParents();
  };

  const deleteParent = async (id: string) => {
    await parentsApi.delete(id);
    await fetchParents();
  };

  return { parents, loading, updateParent, deleteParent, refreshParents: fetchParents };
};
