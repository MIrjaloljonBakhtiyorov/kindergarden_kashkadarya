import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  User, 
  MoreVertical, 
  Paperclip, 
  Send, 
  Check, 
  CheckCheck,
  Lock,
  MessageCircle,
  ArrowLeft,
  Mic,
  X,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNotification } from '../../../context/NotificationContext';
import { useAuth } from '../../../context/AuthContext';
import { parentsApi } from '../../parents/api/parentsApi';
import { ChatMessage, ChatContact } from '../../parents/types/parentPortal.types';

const QUICK_TEMPLATES = [
  { id: 'absent', text: 'Bugun bormaymiz', icon: '🏠' },
  { id: 'late', text: 'Biroz kechikamiz', icon: '⏰' },
  { id: 'pickup', text: 'Farzandimni amakisi olib ketadi', icon: '🚗' },
  { id: 'medicine', text: 'Dorisi bor edi', icon: '💊' },
  { id: 'thanks', text: 'Rahmat, ustoz!', icon: '🙏' }
];

export const MessagesSection = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [activeChat, setActiveChat] = useState<ChatContact | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Recording timer
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const loadContacts = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await parentsApi.getContacts(user.id);
      setContacts(data);
    } catch (error) {
      setContacts([
        { id: 'teacher_1', name: 'Tarbiyachi', role: 'teacher', unreadCount: 2, isOnline: true }
      ]);
    }
  }, [user?.id]);

  const loadMessages = useCallback(async () => {
    if (!user?.id || !activeChat) return;
    setIsLoading(true);
    try {
      const data = await parentsApi.getMessages(user.id, activeChat.id);
      setMessages(data);
      if (activeChat.unreadCount > 0) {
        await parentsApi.markAsRead(user.id, activeChat.id);
        loadContacts();
      }
    } catch (error) {
      setMessages([
        { id: 1, senderId: activeChat.id, receiverId: user.id, text: 'Assalomu alaykum, bugun mashg\'ulotlar juda qiziqarli o\'tdi.', time: '10:30', status: 'read', type: 'received', senderRole: 'teacher' }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, activeChat, loadContacts]);

  useEffect(() => { loadContacts(); }, [loadContacts]);
  useEffect(() => { if (activeChat) loadMessages(); }, [activeChat, loadMessages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !activeChat || !user?.id) return;
    try {
      const newMessage = await parentsApi.sendMessage({
        senderId: user.id, receiverId: activeChat.id, text: text, senderRole: 'parent'
      });
      setMessages((prev) => [...prev, { ...newMessage, type: 'sent' }]);
      showNotification('Xabar yuborildi', 'success');
    } catch (error) {
      setMessages((prev) => [...prev, {
        id: Date.now(), senderId: user.id, receiverId: activeChat.id, text: text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent', type: 'sent', senderRole: 'parent'
      }]);
    }
    setChatMessage('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-[600px] md:h-[700px] flex flex-col md:flex-row gap-6">
      {/* Contact List */}
      <div className={`${activeChat && 'hidden md:flex'} w-full md:w-80 flex-col gap-4 transition-all duration-500`}>
        <div className="bg-white p-4 md:p-6 rounded-[2rem] md:rounded-[2.5rem] border border-brand-border shadow-sm space-y-3">
            <p className="text-[9px] md:text-[10px] font-black text-brand-muted uppercase tracking-[0.3em] px-2">Tarbiyachi</p>
            <div className="space-y-2">
            {contacts.map((contact) => (
                <button 
                  key={contact.id}
                  onClick={() => setActiveChat(contact)}
                  className={`w-full flex items-center gap-3 p-3 md:p-4 rounded-xl md:rounded-[1.5rem] transition-all text-left border ${
                    activeChat?.id === contact.id ? 'bg-brand-primary/5 border-brand-primary' : 'bg-slate-50 border-slate-100 hover:border-brand-primary'
                  }`}
                >
                    <div className="relative">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center bg-white border-2 border-brand-border text-brand-primary shrink-0">
                        <User size={20} />
                      </div>
                      {contact.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                          {contact.unreadCount}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-[10px] md:text-xs font-black leading-none uppercase tracking-wider truncate">{contact.name}</p>
                      <p className={`text-[8px] md:text-[9px] mt-1 font-bold uppercase tracking-widest ${contact.isOnline ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {contact.isOnline ? 'Online' : 'Offline'}
                      </p>
                    </div>
                </button>
            ))}
            </div>
        </div>
        <div className="hidden md:flex bg-brand-ghost p-6 rounded-[2.5rem] border border-brand-border flex-1 flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-inner opacity-40"><Lock size={24} /></div>
            <p className="text-[9px] font-black text-brand-muted uppercase leading-relaxed px-4 tracking-widest">Shifrlangan xabarlar</p>
        </div>
      </div>

      {/* Main Chat Window */}
      <div className={`${!activeChat && 'hidden md:flex'} flex-1 bg-white border-2 border-slate-50 rounded-[2rem] md:rounded-[3rem] lg:rounded-[4rem] shadow-2xl flex flex-col relative overflow-hidden transition-all duration-500`}>
        <AnimatePresence mode="wait">
          {!activeChat ? (
            <motion.div key="placeholder" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex-1 flex flex-col items-center justify-center text-center p-10">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-brand-ghost flex items-center justify-center border-4 border-slate-50 mb-6">
                <MessageCircle size={48} className="text-slate-300" />
              </div>
              <h4 className="text-xl md:text-2xl font-black text-brand-depth">Xabar yuborish</h4>
              <p className="text-sm md:text-base text-brand-muted mt-2 max-w-xs">Suhbatni boshlash uchun chap tarafdan tarbiyachini tanlang.</p>
            </motion.div>
          ) : (
            <motion.div key="chat-window" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col h-full">
              {/* Chat Header */}
              <div className="p-4 md:p-6 lg:p-8 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-md relative z-10">
                <div className="flex items-center gap-3 md:gap-4">
                    <button onClick={() => setActiveChat(null)} className="md:hidden p-2 text-brand-muted hover:text-brand-primary"><ArrowLeft size={20} /></button>
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20">
                      <User size={20} md:size={28} />
                    </div>
                    <div>
                      <h5 className="text-base md:text-xl font-black text-brand-depth tracking-tight">{activeChat.name}</h5>
                      <div className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${activeChat.isOnline ? 'text-emerald-500' : 'text-slate-400'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${activeChat.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></div> 
                          {activeChat.isOnline ? 'Tarmoqda' : 'Oflayn'}
                      </div>
                    </div>
                </div>
                <button className="p-2 text-brand-muted hover:text-brand-primary transition-colors"><MoreVertical size={20} md:size={24} /></button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 space-y-4 md:space-y-6 relative z-10 custom-scrollbar">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => (
                        <div key={`msg-${msg.id}`} className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] md:max-w-[80%] p-4 md:p-5 rounded-2xl md:rounded-[2rem] shadow-lg relative group ${
                              msg.type === 'sent' ? 'bg-brand-primary text-white rounded-tr-none' : 'bg-slate-50 text-brand-depth rounded-tl-none border border-slate-100'
                          }`}>
                              <p className="text-xs md:text-sm font-bold leading-relaxed">{msg.text}</p>
                              <div className={`flex items-center justify-end gap-1.5 mt-2 ${msg.type === 'sent' ? 'text-white/60' : 'text-brand-muted'}`}>
                                <span className="text-[8px] md:text-[9px] font-black">{msg.time}</span>
                                {msg.type === 'sent' && (
                                    msg.status === 'read' ? <CheckCheck size={10} md:size={12} /> : <Check size={10} md:size={12} />
                                )}
                              </div>
                          </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Quick Templates */}
              <div className="px-4 md:px-8 pb-2 overflow-x-auto flex gap-2 no-scrollbar relative z-10">
                {QUICK_TEMPLATES.map((tpl) => (
                  <button
                    key={`tpl-${tpl.id}`}
                    onClick={() => handleSendMessage(tpl.text)}
                    className="whitespace-nowrap bg-slate-100 hover:bg-brand-primary/10 border border-slate-200 hover:border-brand-primary px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold text-brand-depth transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <span>{tpl.icon}</span> {tpl.text}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-4 md:p-6 lg:p-8 border-t border-slate-50 bg-white/80 backdrop-blur-md relative z-10">
                {isRecording ? (
                  <div className="flex items-center gap-4 bg-red-50 border-2 border-red-200 rounded-xl md:rounded-[2.5rem] px-4 md:px-8 py-2 md:py-4 transition-all">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
                    <span className="flex-1 font-black text-red-500 text-sm tracking-widest">{formatTime(recordingTime)}</span>
                    <button onClick={() => setIsRecording(false)} className="text-slate-400 hover:text-red-500"><X size={20} /></button>
                    <button onClick={() => {setIsRecording(false); showNotification('Ovozli xabar yuborildi', 'success');}} className="w-10 h-10 md:w-12 md:h-12 bg-red-500 text-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg"><Send size={18} /></button>
                  </div>
                ) : (
                  <form 
                    onSubmit={(e) => { e.preventDefault(); handleSendMessage(chatMessage); }}
                    className="flex items-center gap-2 md:gap-4 bg-slate-50 border-2 border-transparent focus-within:border-brand-primary focus-within:bg-white rounded-xl md:rounded-[2.5rem] px-4 md:px-8 py-2 md:py-4 transition-all shadow-inner"
                  >
                      <button type="button" className="text-brand-muted hover:text-brand-primary transition-colors hidden md:block"><Paperclip size={22} /></button>
                      <input 
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Xabar..."
                        className="flex-1 bg-transparent outline-none font-bold text-xs md:text-sm text-brand-depth py-2"
                      />
                      <button type="button" onClick={() => setIsRecording(true)} className="text-brand-muted hover:text-brand-primary transition-colors"><Mic size={22} /></button>
                      <button 
                        type="submit"
                        disabled={!chatMessage.trim()}
                        className="w-10 h-10 md:w-12 md:h-12 bg-brand-primary text-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all shrink-0 disabled:opacity-50 disabled:scale-100"
                      >
                        <Send size={18} md:size={20} />
                      </button>
                  </form>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
