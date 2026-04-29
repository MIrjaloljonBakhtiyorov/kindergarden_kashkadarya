import axios from 'axios';
import { Inspection } from '../types/inspector.types';

const apiClient = axios.create({
  baseURL: '/api/inspector',
});

export const inspectorApi = {
  createInspection: (type: Inspection['type']) => 
    apiClient.post<Inspection>('/', { type }),
    
  updateInspection: (id: string, data: Partial<Inspection>) => 
    apiClient.patch<Inspection>(`/${id}`, data),
    
  getInspections: () => 
    apiClient.get<Inspection[]>('/'),
    
  submitInspection: (id: string) => 
    apiClient.post(`/${id}/submit`),
};
