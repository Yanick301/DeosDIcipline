import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Plus, Calendar, Trash2, Heart } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { DB } from '../lib/db';

const Journal = () => {
    const { t, userId } = useHabits();
    const [entries, setEntries] = useState([]);
    const [newEntry, setNewEntry] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        setEntries(DB.get('deos_journal', []));
    }, []);

    const getMoodEmoji = (text) => {
        const positive = ['done', 'good', 'great', 'happy', 'success', 'proud', 'discipline', 'warrior', 'win'];
        const lower = text.toLowerCase();
        if (positive.some(w => lower.includes(w))) return '🔱';
        return '🌑';
    };

    const addEntry = () => {
        if (!newEntry.trim()) return;
        const entry = {
            id: Date.now(),
            text: newEntry,
            date: new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' }),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            mood: getMoodEmoji(newEntry)
        };
        const updated = [entry, ...entries];
        setEntries(updated);
        DB.set('deos_journal', updated);
        setNewEntry('');
        setIsAdding(false);
    };

    const deleteEntry = (id) => {
        if (confirm('Erase this memory from the chronicle?')) {
            const updated = (entries || []).filter(e => e.id !== id);
            setEntries(updated);
            DB.set('deos_journal', updated);
        }
    };

    return (
        <div className="space-y-12 pb-32 max-w-3xl mx-auto">
            <header className="flex flex-col space-y-2">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter">{t('journal_title')}</h1>
                        <p className="text-gold text-[10px] font-black uppercase tracking-[0.4em] opacity-60">The Chronicle of Discipline</p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05, rotate: 90 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsAdding(!isAdding)}
                        className="w-14 h-14 glass-gold rounded-2xl flex items-center justify-center shadow-lg border-gold/40 text-gold"
                    >
                        <Plus size={28} />
                    </motion.button>
                </div>
            </header>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="glass-premium p-8 space-y-6 border-gold/20"
                    >
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gold/40">
                            <span>New Reflection</span>
                            <span>{new Date().toLocaleDateString()}</span>
                        </div>
                        <textarea
                            autoFocus
                            value={newEntry}
                            onChange={(e) => setNewEntry(e.target.value)}
                            placeholder="Write your decree..."
                            className="w-full bg-transparent text-white text-lg font-medium focus:outline-none min-h-[180px] leading-relaxed placeholder:opacity-20"
                        />
                        <div className="flex gap-4">
                            <button
                                onClick={addEntry}
                                className="flex-1 h-14 bg-gold text-obsidian font-black rounded-2xl shadow-xl gold-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                SEAL DECREE
                            </button>
                            <button
                                onClick={() => setIsAdding(false)}
                                className="px-8 h-14 bg-white/5 text-text-tertiary font-bold rounded-2xl hover:bg-white/10 transition-colors"
                            >
                                {t('cancel')}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-8">
                {entries.length === 0 && !isAdding ? (
                    <div className="glass-premium py-24 flex flex-col items-center justify-center text-center space-y-6 opacity-40">
                        <Book size={48} className="text-gold" />
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-white">The Pages are Silent</h3>
                            <p className="text-xs uppercase tracking-widest">Awaiting the warrior's word</p>
                        </div>
                    </div>
                ) : (
                    entries.map((entry, i) => (
                        <motion.div
                            key={entry.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="group relative"
                        >
                            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gold/10 group-hover:bg-gold/40 transition-colors rounded-full" />
                            <div className="glass-premium p-8 space-y-4 hover:border-gold/30 transition-all duration-500">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{entry.mood || '🌑'}</span>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gold">
                                                {entry.date}
                                            </span>
                                        </div>
                                        <div className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest">
                                            {entry.time} • Recorded by {userId}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteEntry(entry.id)}
                                        className="w-8 h-8 rounded-lg bg-white/0 hover:bg-red-500/10 text-text-tertiary hover:text-red-500 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                <p className="text-white text-lg font-medium leading-relaxed whitespace-pre-wrap selection:bg-gold/30 selection:text-white">
                                    {entry.text}
                                </p>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Journal;
