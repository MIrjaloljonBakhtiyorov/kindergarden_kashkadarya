import axios from 'axios';
import { ParentPortalUser, ChatMessage, ChatContact } from '../types/parentPortal.types';

const API_URL = 'http://127.0.0.1:3001/api/parents';
const MESSAGES_URL = 'http://127.0.0.1:3001/api/messages';

export const parentsApi = {
  getAll: async (): Promise<ParentPortalUser[]> => {
    const res = await axios.get(API_URL);
    return res.data;
  },
  update: async (id: string, data: any): Promise<void> => {
    await axios.put(`${API_URL}/${id}`, data);
  },
  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },
  
  // Messaging API
  getMessages: async (userId: string, contactId: string): Promise<ChatMessage[]> => {
    const res = await axios.get(`${MESSAGES_URL}?userId=${userId}&contactId=${contactId}`);
    return res.data;
  },
  
  sendMessage: async (data: { senderId: string, receiverId: string, text: string, senderRole: string }): Promise<ChatMessage> => {
    const res = await axios.post(MESSAGES_URL, data);
    return res.data;
  },
  
  getContacts: async (parentId: string): Promise<ChatContact[]> => {
    const res = await axios.get(`${MESSAGES_URL}/contacts?parentId=${parentId}`);
    return res.data;
  },
  
  markAsRead: async (userId: string, contactId: string): Promise<void> => {
    await axios.put(`${MESSAGES_URL}/read`, { userId, contactId });
  },
  
  sendBroadcast: async (data: { senderId: string, receiverIds: string[], text: string, senderRole: string }): Promise<void> => {
    await axios.post(`${MESSAGES_URL}/broadcast`, data);
  }
};
