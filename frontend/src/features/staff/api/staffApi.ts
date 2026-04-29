import apiClient from '../../../api/apiClient';
import { StaffFormValues } from '../schemas/staffForm.schema';
import { Staff } from '../types/staff.types';

export const staffApi = {
  getAll: async (): Promise<Staff[]> => {
    const res = await apiClient.get('/staff');
    return res.data;
  },
  create: async (data: StaffFormValues): Promise<any> => {
    const res = await apiClient.post('/staff', data);
    return res.data;
  },
  update: async (id: string, data: StaffFormValues): Promise<any> => {
    const res = await apiClient.put(`/staff/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/staff/${id}`);
  }
};
