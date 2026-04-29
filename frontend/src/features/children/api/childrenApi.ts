import apiClient from '../../../api/apiClient';
import { ChildFormValues } from '../schemas/childForm.schema';
import { Child } from '../types/child.types';

export const childrenApi = {
  getAll: async (): Promise<Child[]> => {
    const res = await apiClient.get('/children');
    return res.data;
  },
  create: async (data: ChildFormValues): Promise<any> => {
    const res = await apiClient.post('/children', data);
    return res.data;
  },
  update: async (id: string, data: ChildFormValues): Promise<any> => {
    const res = await apiClient.put(`/children/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/children/${id}`);
  }
};
