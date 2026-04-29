export interface ParentPortalUser {
  id: string;
  childName: string;
  childBirthCertificate: string;
  fatherName: string;
  fatherPhone: string;
  fatherPassport?: string;
  motherName: string;
  motherPhone: string;
  motherPassport?: string;
  childGroup: string;
  login: string;
  password?: string;
  groupId?: number;
}

export interface ChatMessage {
  id: number;
  senderId: string;
  receiverId: string;
  text: string;
  time: string;
  status: 'sent' | 'delivered' | 'read';
  type: 'sent' | 'received';
  senderRole: 'parent' | 'teacher' | 'admin';
}

export interface ChatContact {
  id: string;
  name: string;
  role: 'teacher' | 'admin';
  unreadCount: number;
  lastMessage?: string;
  isOnline: boolean;
}
