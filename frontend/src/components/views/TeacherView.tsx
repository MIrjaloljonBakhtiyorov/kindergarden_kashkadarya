import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardCheck, 
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Thermometer,
  Calendar,
  Users,
  Utensils,
  History as HistoryIcon,
  MessageCircle,
  Send,
  Paperclip,
  Smile,
  Mic,
  MoreVertical,
  CheckCheck,
  Check,
  User,
  XCircle as XIcon,
  AlertCircle
} from 'lucide-react';
import { Group } from '../../types';
import { useNotification } from '../../context/NotificationContext';
import { useGroups } from '../../features/groups/hooks/useGroups';
import { useAuth } from '../../context/AuthContext';
import { parentsApi } from '../../features/parents/api/parentsApi';

interface TeacherViewProps {
  groups: Group[];
}

type AttendanceStatus = 'present' | 'absent' | 'sick';

const API_BASE_URL = 'http://localhost:3001/api';

const TeacherView: React.FC<TeacherViewProps> = ({ groups: initialGroups }) => {
  const { groups, refetch: refetchGroups } = useGroups();
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'attendance' | 'messages'>('attendance');
  const { showNotification } = useNotification();
  
  const [todayStats, setTodayStats] = useState({
    present: 0,
    absent: 0,
    sick: 0
  });

  const fetchTodayStats = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/attendance/today-stats`);
      setTodayStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  useEffect(() => {
    fetchTodayStats();
    refetchGroups();
  }, []);

  const displayGroups = groups.length > 0 ? groups : initialGroups;

  if (!selectedGroup) {
    const totalKids = displayGroups.reduce((sum, g) => sum + ((g as any).children?.length || 0), 0);
    const mealPortions = todayStats.present; 
    
    const absentDisplay = todayStats.present + todayStats.absent + todayStats.sick === 0 
      ? 0 
      : todayStats.absent;

    return (
      <div className="p-8 animate-in fade-in max-w-7xl mx-auto space-y-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-4xl font-black text-brand-depth tracking-tight">Xush kelibsiz!</h2>
            <p className="text-brand-muted font-bold uppercase text-[10px] tracking-widest mt-2 flex items-center gap-2">
              <Calendar size={14} className="text-brand-primary" />
              Bugun: {new Date().toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-6 rounded-[2rem] border border-brand-border shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-50 text-brand-primary rounded-2xl flex items-center justify-center mb-4">
              <Users size={24} />
            </div>
            <p className="text-[9px] font-black text-brand-muted uppercase tracking-[0.2em] mb-1">Jami bolalar</p>
            <p className="text-3xl font-black text-brand-depth">{totalKids}</p>
          </div>

          <div className="bg-emerald-50/50 p-6 rounded-[2rem] border border-emerald-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
              <CheckCircle2 size={24} />
            </div>
            <p className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-1">Bugun kelgan</p>
            <p className="text-3xl font-black text-emerald-600">{todayStats.present}</p>
          </div>

          <div className="bg-rose-50/50 p-6 rounded-[2rem] border border-rose-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-rose-100 text-rose-500 rounded-2xl flex items-center justify-center mb-4">
              <XCircle size={24} />
            </div>
            <p className="text-[9px] font-black text-rose-500 uppercase tracking-[0.2em] mb-1">Bugun kelmagan</p>
            <p className="text-3xl font-black text-rose-500">{absentDisplay}</p>
          </div>

          <div className="bg-amber-50/50 p-6 rounded-[2rem] border border-amber-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-4">
              <Thermometer size={24} />
            </div>
            <p className="text-[9px] font-black text-amber-600 uppercase tracking-[0.2em] mb-1">Kasal bolalar</p>
            <p className="text-3xl font-black text-amber-600">{todayStats.sick}</p>
          </div>

          <div className="bg-indigo-50/50 p-6 rounded-[2rem] border border-indigo-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
              <Utensils size={24} />
            </div>
            <p className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-1">Ovqat porsiyasi</p>
            <p className="text-3xl font-black text-indigo-600">{mealPortions}</p>
          </div>
        </div>

        <section>
          <h3 className="text-sm font-black text-brand-muted uppercase tracking-[0.2em] mb-6 ml-1">Guruhni tanlang</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayGroups.map(g => (
              <button 
                key={(g as any).id || g.name} 
                onClick={() => setSelectedGroup(g.name)} 
                className="p-8 bg-white border border-brand-border rounded-[2.5rem] text-left transition-all hover:border-brand-primary hover:shadow-2xl hover:shadow-brand-primary/5 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                    <Users size={24} />
                  </div>
                  <span className="font-black text-brand-depth block text-xl mb-1 tracking-tight">{g.name}</span>
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Tarbiyachi: {(g as any).teacher_name}</p>
                    <p className="text-[10px] text-brand-primary font-black uppercase tracking-widest mt-2">{(g as any).children?.length || 0} ta bola</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    );
  }

  const groupData = displayGroups.find(g => g.name === selectedGroup);
  if (!groupData) return null;

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Group Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-[2.5rem] border border-brand-border shadow-xl shadow-slate-200/50 gap-6">
        <div className="space-y-1">
          <button onClick={() => setSelectedGroup(null)} className="text-brand-primary font-black text-[10px] uppercase tracking-widest flex items-center gap-2 mb-2 hover:translate-x-[-4px] transition-transform">
            <ArrowLeft size={14} /> Barcha guruhlar
          </button>
          <h2 className="text-3xl font-black text-brand-depth tracking-tight">"{groupData.name}" guruhi</h2>
          <div className="flex items-center gap-4 mt-2">
            <button 
              onClick={() => setActiveTab('attendance')}
              className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full transition-all ${activeTab === 'attendance' ? 'bg-brand-primary text-white' : 'bg-slate-100 text-brand-muted hover:bg-slate-200'}`}
            >
              Davomat
            </button>
            <button 
              onClick={() => setActiveTab('messages')}
              className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full transition-all flex items-center gap-2 ${activeTab === 'messages' ? 'bg-brand-primary text-white' : 'bg-slate-100 text-brand-muted hover:bg-slate-200'}`}
            >
              Xabarlar <span className="bg-red-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-[8px]">3</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'attendance' ? (
        <GroupAttendanceView 
          groupData={groupData} 
          onSaved={() => {
            fetchTodayStats();
            refetchGroups();
          }}
        />
      ) : (
        <TeacherMessagesView groupData={groupData} />
      )}
    </div>
  );
};

const TeacherMessagesView = ({ groupData }: { groupData: any }) => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [activeParent, setActiveParent] = useState<any>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastText, setBroadcastText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadUnreadCounts = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/messages/unread-counts?userId=${user.id}`);
      setUnreadCounts(res.data);
    } catch (error) {
      console.error('Failed to load unread counts:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    loadUnreadCounts();
    const interval = setInterval(loadUnreadCounts, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [loadUnreadCounts]);

  const loadMessages = useCallback(async () => {
    if (!activeParent || !user?.id || !activeParent.hasAccount) {
      setMessages([]);
      return;
    }
    setIsLoading(true);
    try {
      const data = await parentsApi.getMessages(user.id, activeParent.id);
      setMessages(data);
      
      if (unreadCounts[activeParent.id] > 0) {
        await parentsApi.markAsRead(user.id, activeParent.id);
        loadUnreadCounts();
      }
    } catch (error) {
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeParent, user?.id, unreadCounts, loadUnreadCounts]);

  useEffect(() => {
    if (activeParent) loadMessages();
  }, [activeParent, loadMessages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatMessage.trim() || !activeParent || !user?.id) return;

    const messageText = chatMessage;
    setChatMessage('');

    try {
      await parentsApi.sendMessage({
        senderId: user.id,
        receiverId: activeParent.id,
        text: messageText,
        senderRole: 'teacher'
      });
      loadMessages();
      showNotification('Xabar yuborildi', 'success');
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        senderId: user.id,
        receiverId: activeParent.id,
        text: messageText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent',
        type: 'sent'
      }]);
    }
  };

  const handleBroadcast = async () => {
    if (!broadcastText.trim() || !user?.id) return;
    
    const parentIds = (groupData.children || [])
      .map((child: any) => child.parent_account_id)
      .filter((id: string | null) => id !== null);

    if (parentIds.length === 0) {
      showNotification('Guruhda ota-ona hisoblari topilmadi', 'error');
      return;
    }

    try {
      await parentsApi.sendBroadcast({
        senderId: user.id,
        receiverIds: parentIds,
        text: broadcastText,
        senderRole: 'teacher'
      });
      
      showNotification(`E'lon ${parentIds.length} ta ota-onaga yuborildi`, 'success');
      setBroadcastText('');
      setShowBroadcastModal(false);
    } catch (error) {
      showNotification('E\'lon yuborishda xatolik', 'error');
    }
  };

  const parents = useMemo(() => {
    const list = (groupData.children || []).map((child: any) => ({
      id: child.parent_account_id || `temp_${child.id}`,
      hasAccount: !!child.parent_account_id,
      name: child.father_name || child.mother_name || `Ota-ona (${child.first_name})`,
      childName: child.first_name,
      unreadCount: unreadCounts[child.parent_account_id || ''] || 0,
      isOnline: false
    }));

    if (!searchTerm) return list;
    return list.filter((p: any) => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.childName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [groupData.children, searchTerm, unreadCounts]);

  return (
    <div className="h-[600px] flex gap-6 animate-in slide-in-from-bottom-4 relative">
      {/* Parents List */}
      <div className={`w-full md:w-80 flex flex-col gap-4 ${activeParent && 'hidden md:flex'}`}>
        <div className="bg-white p-6 rounded-[2.5rem] border border-brand-border shadow-sm flex-1 flex flex-col overflow-hidden">
          <div className="space-y-4 mb-4">
            <div className="flex justify-between items-center px-2">
              <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.3em]">Ota-onalar</p>
              <button 
                onClick={() => setShowBroadcastModal(true)}
                className="bg-brand-primary/10 text-brand-primary p-2 rounded-xl hover:bg-brand-primary hover:text-white transition-all shadow-sm"
                title="Guruhga e'lon"
              >
                <MessageCircle size={18} />
              </button>
            </div>
            
            {/* Search Input */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="Qidirish..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-2 px-4 text-xs font-bold outline-none focus:border-brand-primary transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {parents.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-[10px] font-black text-brand-muted uppercase">Topilmadi</p>
              </div>
            ) : (
              parents.map((parent: any) => (
                <button
                  key={parent.id}
                  onClick={() => setActiveParent(parent)}
                  className={`w-full flex items-center gap-3 p-4 rounded-[1.5rem] transition-all text-left border ${
                    activeParent?.id === parent.id ? 'bg-brand-primary/5 border-brand-primary' : 'bg-slate-50 border-slate-100 hover:border-brand-primary'
                  }`}
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-white border-2 border-brand-border flex items-center justify-center text-brand-primary shrink-0">
                      <User size={20} />
                    </div>
                    {parent.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                        {parent.unreadCount}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[11px] font-black text-brand-depth uppercase truncate tracking-wide">{parent.name}</p>
                    <p className="text-[9px] text-brand-muted font-bold mt-1">Bolasining ismi: {parent.childName}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 bg-white border-2 border-slate-50 rounded-[3rem] shadow-2xl flex flex-col relative overflow-hidden ${!activeParent && 'hidden md:flex'}`}>
        {!activeParent ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
            <div className="w-24 h-24 rounded-full bg-brand-ghost flex items-center justify-center mb-6">
              <MessageCircle size={48} className="text-slate-300" />
            </div>
            <h4 className="text-xl font-black text-brand-depth uppercase">Muloqot markazi</h4>
            <p className="text-sm text-brand-muted mt-2 max-w-xs">Xabar yuborish uchun chapdan ota-onani tanlang yoki yuqoridagi tugma orqali guruhga e'lon yuboring.</p>
          </div>
        ) : !activeParent.hasAccount ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
            <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mb-6">
              <AlertCircle size={40} />
            </div>
            <h4 className="text-lg font-black text-brand-depth uppercase">Akkount topilmadi</h4>
            <p className="text-sm text-brand-muted mt-2 max-w-xs">
              Ushbu ota-ona hali tizimda ro'yxatdan o'tmagan. Xabar yuborish uchun avval ularga login/parol berilishi kerak.
            </p>
            <button 
              onClick={() => setActiveParent(null)}
              className="mt-6 text-brand-primary font-black text-[10px] uppercase tracking-widest flex items-center gap-2"
            >
              <ArrowLeft size={14} /> Boshqa ota-onani tanlash
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <button onClick={() => setActiveParent(null)} className="md:hidden p-2 text-brand-muted hover:text-brand-primary"><ArrowLeft size={20} /></button>
                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20">
                  <User size={24} />
                </div>
                <div>
                  <h5 className="text-lg font-black text-brand-depth tracking-tight">{activeParent.name}</h5>
                  <div className="text-[9px] font-black text-brand-primary uppercase tracking-widest">{activeParent.childName} ning ota-onasi</div>
                </div>
              </div>
              <button className="p-2 text-brand-muted hover:text-brand-primary transition-colors"><MoreVertical size={20} /></button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-[2rem] shadow-lg relative ${
                        msg.type === 'sent' ? 'bg-brand-primary text-white rounded-tr-none' : 'bg-slate-50 text-brand-depth rounded-tl-none border border-slate-100'
                      }`}>
                        <p className="text-sm font-bold leading-relaxed">{msg.text}</p>
                        <div className={`flex items-center justify-end gap-1.5 mt-2 ${msg.type === 'sent' ? 'text-white/60' : 'text-brand-muted'}`}>
                          <span className="text-[9px] font-black">{msg.time}</span>
                          {msg.type === 'sent' && (msg.status === 'read' ? <CheckCheck size={12} /> : <Check size={12} />)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input */}
            <div className="p-6 border-t border-slate-50">
              <form onSubmit={handleSendMessage} className="flex items-center gap-4 bg-slate-50 border-2 border-transparent focus-within:border-brand-primary focus-within:bg-white rounded-[2.5rem] px-6 py-3 transition-all shadow-inner">
                <label className="cursor-pointer text-brand-muted hover:text-brand-primary transition-colors">
                  <Paperclip size={20} />
                  <input type="file" className="hidden" onChange={() => showNotification('Tez orada: Fayl yuborish imkoniyati', 'info')} />
                </label>
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Javob yozish..."
                  className="flex-1 bg-transparent outline-none font-bold text-sm text-brand-depth py-2"
                />
                <button type="button" className="text-brand-muted hover:text-brand-primary"><Smile size={20} /></button>
                <button
                  type="submit"
                  disabled={!chatMessage.trim()}
                  className="w-10 h-10 bg-brand-primary text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </>
        )}
      </div>

      {/* Broadcast Modal Overlay */}
      <AnimatePresence>
        {showBroadcastModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/5"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl border border-brand-border overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black text-brand-depth uppercase tracking-tight">Guruhga e'lon</h3>
                  <button onClick={() => setShowBroadcastModal(false)} className="text-brand-muted hover:text-brand-primary"><XCircle size={24} /></button>
                </div>
                <p className="text-xs text-brand-muted font-bold mb-4">Ushbu xabar guruhdagi barcha ota-onalarga yuboriladi.</p>
                <textarea 
                  value={broadcastText}
                  onChange={(e) => setBroadcastText(e.target.value)}
                  className="w-full h-40 bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-6 text-sm font-bold outline-none focus:border-brand-primary transition-all resize-none mb-6"
                  placeholder="E'lon matnini yozing..."
                ></textarea>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setShowBroadcastModal(false)}
                    className="flex-1 py-4 bg-slate-100 text-brand-muted font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-slate-200 transition-all"
                  >
                    Bekor qilish
                  </button>
                  <button 
                    onClick={handleBroadcast}
                    disabled={!broadcastText.trim()}
                    className="flex-1 py-4 bg-brand-primary text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:shadow-lg hover:shadow-brand-primary/30 transition-all disabled:opacity-50"
                  >
                    Yuborish
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const GroupAttendanceView = ({ groupData, onSaved }: { groupData: any, onSaved: () => void }) => {
  const { showNotification } = useNotification();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});

  useEffect(() => {
    const fetchExistingAttendance = async () => {
      try {
        setIsLoading(true);
        const today = new Date().toISOString().split('T')[0];
        const res = await axios.get(`${API_BASE_URL}/attendance/${groupData.id}/${today}`);
        
        const initialAttendance = (groupData.children || []).reduce((acc: any, child: any) => {
          acc[child.id] = res.data[child.id] || 'present';
          return acc;
        }, {});
        
        setAttendance(initialAttendance);
      } catch (err) {
        console.error('Failed to fetch existing attendance:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingAttendance();
  }, [groupData]);

  const stats = useMemo(() => {
    const values = Object.values(attendance);
    return {
      total: (groupData.children || []).length,
      present: values.filter(v => v === 'present').length,
      absent: values.filter(v => v === 'absent').length,
      sick: values.filter(v => v === 'sick').length
    };
  }, [attendance, groupData.children]);

  const handleStatusChange = (childId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({ ...prev, [childId]: status }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        date: new Date().toISOString().split('T')[0],
        group_name: groupData.name,
        attendance_data: attendance
      };

      await axios.post(`${API_BASE_URL}/attendance`, payload);
      showNotification('Davomat muvaffaqiyatli saqlandi!', 'success');
      onSaved();
    } catch (err) {
      showNotification('Davomatni saqlashda xatolik yuz berdi', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-20 text-center font-black text-brand-muted uppercase tracking-widest">Yuklanmoqda...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="w-full md:w-auto bg-brand-primary text-white font-black uppercase text-xs tracking-widest px-10 py-5 rounded-2xl hover:shadow-2xl hover:shadow-brand-primary/30 transition-all active:scale-95 disabled:opacity-50"
        >
          {isSaving ? 'Saqlanmoqda...' : 'Davomatni saqlash'}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-brand-border shadow-sm text-center">
          <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1">Jami</p>
          <p className="text-3xl font-black text-brand-depth">{stats.total}</p>
        </div>
        <div className="bg-emerald-50/50 p-6 rounded-[2rem] border border-emerald-100 text-center">
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Keldi</p>
          <p className="text-3xl font-black text-emerald-600">{stats.present}</p>
        </div>
        <div className="bg-rose-50/50 p-6 rounded-[2rem] border border-rose-100 text-center">
          <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Kelmadi</p>
          <p className="text-3xl font-black text-rose-500">{stats.absent}</p>
        </div>
        <div className="bg-amber-50/50 p-6 rounded-[2rem] border border-amber-100 text-center">
          <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Kasal</p>
          <p className="text-3xl font-black text-amber-600">{stats.sick}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-[2.5rem] border border-brand-border shadow-sm overflow-hidden">
        <div className="p-8 border-b border-brand-border bg-slate-50/30">
          <h3 className="font-black text-brand-depth uppercase text-xs tracking-widest flex items-center gap-2">
            <ClipboardCheck size={18} className="text-brand-primary" />
            Bolalar ro'yxati
          </h3>
        </div>
        <div className="divide-y divide-slate-50">
          {(groupData.children || []).length === 0 ? (
            <div className="p-20 text-center text-brand-muted font-bold italic">Guruhda bolalar yo'q</div>
          ) : (
            groupData.children.map((child: any) => (
              <div key={child.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <span className="font-bold text-brand-depth">{child.first_name || child.name} {child.last_name || ''}</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleStatusChange(child.id, 'present')}
                    className={`w-28 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                      attendance[child.id] === 'present' 
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                        : 'bg-slate-50 text-brand-muted border border-brand-border hover:bg-white'
                    }`}
                  >
                    <CheckCircle2 size={14} /> Keldi
                  </button>
                  <button 
                    onClick={() => handleStatusChange(child.id, 'absent')}
                    className={`w-28 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                      attendance[child.id] === 'absent' 
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' 
                        : 'bg-slate-50 text-brand-muted border border-brand-border hover:bg-white'
                    }`}
                  >
                    <XCircle size={14} /> Kelmadi
                  </button>
                  <button 
                    onClick={() => handleStatusChange(child.id, 'sick')}
                    className={`w-28 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                      attendance[child.id] === 'sick' 
                        ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' 
                        : 'bg-slate-50 text-brand-muted border border-brand-border hover:bg-white'
                    }`}
                  >
                    <Thermometer size={14} /> Kasal
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherView;
