import apiClient from '../../../api/apiClient';
import { ParentPortalUser, ChatMessage, ChatContact } from '../types/parentPortal.types';

export const parentsApi = {
  getAll: async (): Promise<ParentPortalUser[]> => {
    const res = await apiClient.get('/parents');
    return res.data;
  },
  update: async (id: string, data: any): Promise<void> => {
    await apiClient.put(`/parents/${id}`, data);
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/parents/${id}`);
  },
  
  // Messaging API
  getMessages: async (userId: string, contactId: string): Promise<ChatMessage[]> => {
    const res = await apiClient.get(`/messages?userId=${userId}&contactId=${contactId}`);
    return res.data;
  },
  
  sendMessage: async (data: { senderId: string, receiverId: string, text: string, senderRole: string }): Promise<ChatMessage> => {
    const res = await apiClient.post('/messages', data);
    return res.data;
  },
  
  getContacts: async (parentId: string): Promise<ChatContact[]> => {
    const res = await apiClient.get(`/messages/contacts?parentId=${parentId}`);
    return res.data;
  },
  
  markAsRead: async (userId: string, contactId: string): Promise<void> => {
    await apiClient.put('/messages/read', { userId, contactId });
  },
  
  sendBroadcast: async (data: { senderId: string, receiverIds: string[], text: string, senderRole: string }): Promise<void> => {
    await apiClient.post('/messages/broadcast', data);
  }
};
