import axios from 'axios';
import { Group, GroupFormValues } from '../types/group.types';

const API_URL = 'http://127.0.0.1:3001/api/groups';

export const groupsApi = {
  getAll: async (): Promise<Group[]> => {
    const res = await axios.get(API_URL);
    return res.data;
  },
  create: async (data: GroupFormValues): Promise<Group> => {
    const res = await axios.post(API_URL, data);
    return res.data;
  },
  update: async (id: string, data: GroupFormValues): Promise<Group> => {
    const res = await axios.put(`${API_URL}/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  }
};
