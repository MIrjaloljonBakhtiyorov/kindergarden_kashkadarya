import axios from 'axios';
import { StaffFormValues } from '../schemas/staffForm.schema';
import { Staff } from '../types/staff.types';

const API_URL = 'http://127.0.0.1:3001/api/staff';

export const staffApi = {
  getAll: async (): Promise<Staff[]> => {
    const res = await axios.get(API_URL);
    return res.data;
  },
  create: async (data: StaffFormValues): Promise<any> => {
    const res = await axios.post(API_URL, data);
    return res.data;
  },
  update: async (id: string, data: StaffFormValues): Promise<any> => {
    const res = await axios.put(`${API_URL}/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  }
};
