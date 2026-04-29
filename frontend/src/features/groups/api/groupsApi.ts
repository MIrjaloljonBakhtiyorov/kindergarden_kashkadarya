import apiClient from '../../../api/apiClient';
import { Group, GroupFormValues } from '../types/group.types';

export const groupsApi = {
  getAll: async (): Promise<Group[]> => {
    const res = await apiClient.get('/groups');
    return res.data;
  },
  create: async (data: GroupFormValues): Promise<Group> => {
    const res = await apiClient.post('/groups', data);
    return res.data;
  },
  update: async (id: string, data: GroupFormValues): Promise<Group> => {
    const res = await apiClient.put(`/groups/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/groups/${id}`);
  }
};
