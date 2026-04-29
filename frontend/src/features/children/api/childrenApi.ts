import axios from 'axios';
import { ChildFormValues } from '../schemas/childForm.schema';
import { Child } from '../types/child.types';

const API_URL = 'http://127.0.0.1:3001/api/children';

export const childrenApi = {
  getAll: async (): Promise<Child[]> => {
    const res = await axios.get(API_URL);
    return res.data;
  },
  create: async (data: ChildFormValues): Promise<any> => {
    const res = await axios.post(API_URL, data);
    return res.data;
  },
  update: async (id: string, data: ChildFormValues): Promise<any> => {
    const res = await axios.put(`${API_URL}/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  }
  };

