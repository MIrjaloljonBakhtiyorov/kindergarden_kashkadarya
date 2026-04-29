import axios from 'axios';
import { Operation } from '../types/operation.types';

const API_URL = 'http://127.0.0.1:3001/api/operations';

export const operationsApi = {
  getAll: async (): Promise<Operation[]> => {
    const res = await axios.get(API_URL);
    return res.data;
  }
};
