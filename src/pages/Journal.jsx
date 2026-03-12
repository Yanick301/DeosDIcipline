import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Plus, Calendar, Trash2, Heart } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { DB } from '../lib/db';

const Journal = () => {
    const { t } = useHabits();
    const [entries, setEntries] = useState([]);
    const [newEntry, setNewEntry] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        setEntries(DB.get('deos_journal', []));
    }, []);

    const addEntry = () => {
        if (!newEntry.trim()) return;
        const entry = {
            id: Date.now(),
            text: newEntry,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        const updated = [entry, ...entries];
        setEntries(updated);
        DB.set('deos_journal', updated);
        setNewEntry('');
        setIsAdding(false);
    };

    const deleteEntry = (id) => {
        const updated = entries.filter(e => e.id !== id);
        setEntries(updated);
        DB.set('deos_journal', updated);
    };

    return (
        <div className="space-y-8 pb-32">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-white">{t('journal_title')}</h1>
                    <p className="text-text-secondary text-sm font-medium">{t('journal_subtitle')}</p>
                </div>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsAdding(!isAdding)}
                    className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center shadow-lg"
                >
                    <Plus size={24} />
                </motion.button>
            </header>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="glass-card space-y-4"
                    >
                        <textarea
                            value={newEntry}
                            onChange={(e) => setNewEntry(e.target.value)}
                            placeholder={t('journal_placeholder')}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:outline-none focus:border-airbnb min-h-[120px]"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={addEntry}
                                className="flex-1 bg-airbnb text-white font-black py-3 rounded-2xl shadow-lg shadow-airbnb/20"
                            >
                                {t('journal_save')}
                            </button>
                            <button
                                onClick={() => setIsAdding(false)}
                                className="px-6 bg-white/5 text-text-tertiary font-bold rounded-2xl"
                            >
                                {t('cancel')}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {entries.length === 0 && !isAdding && (
                <div className="glass-card py-20 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-text-tertiary">
                        <Book size={32} />
                    </div>
                    <div>
                        <h3 className="text-white font-bold">{t('journal_no_entries')}</h3>
                        <p className="text-text-tertiary text-sm">{t('journal_awareness')}</p>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {entries.map((entry) => (
                    <motion.div
                        key={entry.id}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card p-6 space-y-4"
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2 text-text-tertiary text-[10px] font-black uppercase tracking-widest">
                                <Calendar size={12} />
                                {entry.date} • {entry.time}
                            </div>
                            <button
                                onClick={() => deleteEntry(entry.id)}
                                className="text-text-tertiary hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                        <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                            {entry.text}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Journal;
