import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Users, Zap, MessageSquare } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { supabase, CHAT_CHANNEL } from '../lib/supabase';

const Community = () => {
    const { t, settings } = useHabits();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [activeUsers, setActiveUsers] = useState(0);
    const scrollRef = useRef(null);

    useEffect(() => {
        // Shared placeholder for demo since real Supabase credentials might not be set
        const mockMessages = [
            { id: 1, user: 'Warrior77', text: 'Day 12 of Cold Showers done! 🔥', time: '12:05' },
            { id: 2, user: 'FocusMind', text: 'Just finished 2h of Deep Work. Feeling great.', time: '12:10' },
            { id: 3, user: 'Alex', text: 'Keep going guys, consistency is key.', time: '12:15' },
        ];
        setMessages(mockMessages);
        setActiveUsers(Math.floor(Math.random() * 50) + 120);

        // Real-time setup placeholder
        const channel = supabase.channel(CHAT_CHANNEL)
            .on('broadcast', { event: 'message' }, ({ payload }) => {
                setMessages(prev => [...prev, payload]);
            })
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const msg = {
            id: Date.now(),
            user: settings.username || 'You',
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, msg]);
        setNewMessage('');

        await supabase.channel(CHAT_CHANNEL).send({
            type: 'broadcast',
            event: 'message',
            payload: msg,
        });
    };

    return (
        <div className="flex flex-col h-[calc(100vh-180px)] space-y-4">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white">{t('community')}</h1>
                    <div className="flex items-center gap-2 text-text-secondary text-sm font-medium">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        {activeUsers} {t('members')} online
                    </div>
                </div>
                <div className="w-12 h-12 bg-surface-200 rounded-2xl flex items-center justify-center text-text-secondary">
                    <Users size={24} />
                </div>
            </header>

            {/* Live Feed Shortcut */}
            <div className="bg-airbnb/10 border border-airbnb/20 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-airbnb rounded-xl flex items-center justify-center text-white">
                    <Zap size={20} fill="white" />
                </div>
                <div>
                    <p className="text-xs font-black text-airbnb uppercase tracking-widest">{t('live_feed')}</p>
                    <p className="text-sm font-bold text-white">FocusMind just earned "On Fire!"</p>
                </div>
            </div>

            {/* Chat Box */}
            <div className="flex-1 bg-surface-200/50 rounded-[32px] border border-white/5 flex flex-col overflow-hidden">
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar"
                >
                    <AnimatePresence initial={false}>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`flex flex-col ${msg.user === 'You' ? 'items-end' : 'items-start'}`}
                            >
                                <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-1 px-2">
                                    {msg.user} • {msg.time}
                                </span>
                                <div className={`px-4 py-3 rounded-2xl text-sm font-medium max-w-[85%] ${msg.user === 'You' ? 'bg-airbnb text-white rounded-tr-none' : 'bg-white/5 text-white rounded-tl-none'}`}>
                                    {msg.text}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <form onSubmit={sendMessage} className="p-4 bg-surface-200 border-t border-white/5 flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={t('chat_placeholder')}
                        className="flex-1 bg-white/5 border border-white/5 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-airbnb/50 transition-all"
                    />
                    <button
                        type="submit"
                        className="w-12 h-12 bg-airbnb rounded-2xl flex items-center justify-center text-white shadow-lg shadow-airbnb/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Community;
