import { useEffect, useState } from 'react';
import { inspectorApi } from '../api/inspectorApi';
import { Inspection } from '../types/inspector.types';

export const useInspector = () => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInspections();
  }, []);

  const fetchInspections = async () => {
    setLoading(true);
    try {
      const { data } = await inspectorApi.getInspections();
      setInspections(data);
    } finally {
      setLoading(false);
    }
  };

  return { inspections, loading, refetch: fetchInspections };
};
