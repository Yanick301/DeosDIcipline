import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHabits } from '../context/HabitContext';
import { X, Check, Clock, Calendar, BarChart, Palette } from 'lucide-react';
import { HABIT_ICONS } from '../lib/constants';

const AddHabit = ({ onDone, editingHabit }) => {
    const { t, addHabit, updateHabit, deleteHabit } = useHabits();
    const [name, setName] = useState(editingHabit?.name || '');
    const [desc, setDesc] = useState(editingHabit?.description || '');
    const [icon, setIcon] = useState(editingHabit?.icon || 'fitness');
    const [color, setColor] = useState(editingHabit?.color || '#FF385C');
    const [days, setDays] = useState(editingHabit?.days || [0, 1, 2, 3, 4, 5, 6]);
    const [time, setTime] = useState(editingHabit?.reminderTime || '');
    const [priority, setPriority] = useState(editingHabit?.priority || 'MEDIUM');

    const handleSave = () => {
        if (!name) return;
        const data = { name, description: desc, icon, color, days, reminderTime: time, priority };
        if (editingHabit) {
            updateHabit(editingHabit.id, data);
        } else {
            addHabit(data);
        }
        onDone();
    };

    const handleDelete = () => {
        if (confirm(t('delete_confirm', name))) {
            deleteHabit(editingHabit.id);
            onDone();
        }
    };

    const COLORS = ['#FF385C', '#0A84FF', '#30D158', '#FF9F0A', '#BF5AF2', '#32ADE6', '#FF2D55', '#FFD60A'];

    return (
        <div className="space-y-8 animate-spring-in">
            <header className="flex justify-between items-center">
                <button onClick={onDone} className="text-text-secondary">
                    <X size={24} />
                </button>
                <h1 className="text-xl font-black text-white uppercase tracking-widest">
                    {editingHabit ? t('edit_habit') : t('new_habit')}
                </h1>
                <button onClick={handleSave} className="text-airbnb font-black text-lg">
                    {t('done_btn')}
                </button>
            </header>

            {/* Form & Preview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Left Side: Preview & Name */}
                <div className="space-y-8">
                    {/* Icon Preview */}
                    <div className="flex justify-center p-8 glass-premium rounded-3xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-airbnb/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <motion.div
                            layoutId="habit-icon"
                            className="w-32 h-32 rounded-[40px] flex items-center justify-center text-airbnb shadow-2xl shadow-airbnb/20 relative z-10"
                            style={{ backgroundColor: `${color}15`, color: color }}
                        >
                            <svg viewBox="0 0 24 24" className="w-16 h-16 fill-none stroke-current stroke-2">
                                <path d={HABIT_ICONS.find(i => i.id === icon)?.path} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </motion.div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary px-1">{t('name_label')}</label>
                        <input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder={t('name_placeholder')}
                            className="w-full h-16 bg-surface-200 border border-white/5 rounded-2xl px-6 text-xl text-white font-bold focus:outline-none focus:border-airbnb transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary px-1">{t('notes_label')}</label>
                        <textarea
                            value={desc}
                            onChange={e => setDesc(e.target.value)}
                            placeholder={t('notes_placeholder')}
                            className="w-full h-32 bg-surface-200 border border-white/5 rounded-2xl p-4 text-white font-medium focus:outline-none focus:border-airbnb transition-all resize-none"
                        />
                    </div>
                </div>

                {/* Right Side: Configuration */}
                <div className="space-y-8">
                    {/* Color Picker */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary px-1">{t('color')}</label>
                        <div className="flex flex-wrap gap-3">
                            {COLORS.map(c => (
                                <button
                                    key={c}
                                    onClick={() => setColor(c)}
                                    className={`w-11 h-11 rounded-full transition-all ${color === c ? 'ring-4 ring-white/20 scale-110' : 'opacity-40 hover:opacity-100'}`}
                                    style={{ backgroundColor: c }}
                                >
                                    {color === c && <Check size={20} className="mx-auto text-white" strokeWidth={3} />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Icon Grid */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary px-1">{t('icon')}</label>
                        <div className="grid grid-cols-5 gap-2">
                            {HABIT_ICONS.map(ic => (
                                <button
                                    key={ic.id}
                                    onClick={() => setIcon(ic.id)}
                                    className={`aspect-square rounded-xl flex items-center justify-center transition-all ${icon === ic.id ? 'bg-airbnb text-white shadow-lg shadow-airbnb/20' : 'bg-surface-200 text-text-tertiary hover:bg-white/5'}`}
                                >
                                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current stroke-2">
                                        <path d={ic.path} strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Schedule & Reminder */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary px-1">Reminders & Frequency</label>
                        <div className="glass-card divide-y divide-white/5 p-0 overflow-hidden">
                            <div className="flex items-center gap-4 p-5">
                                <Calendar size={20} className="text-airbnb" />
                                <div className="flex-1 flex flex-wrap gap-1">
                                    {t('days_short').map((d, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                const dList = Array.isArray(days) ? days : [];
                                                if (dList.includes(i)) setDays(dList.filter(idx => idx !== i));
                                                else setDays([...dList, i]);
                                            }}
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${(Array.isArray(days) && days.includes(i)) ? 'bg-airbnb text-white' : 'bg-white/5 text-text-tertiary hover:bg-white/10'}`}
                                        >
                                            {d}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-5">
                                <Clock size={20} className="text-sky-400" />
                                <span className="flex-1 font-bold text-sm text-white">{t('reminder_label')}</span>
                                <input
                                    type="time"
                                    value={time}
                                    onChange={e => setTime(e.target.value)}
                                    className="bg-surface-300 p-2 rounded-lg text-white font-bold text-sm focus:outline-none border border-white/5"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {editingHabit && (
                <button
                    onClick={handleDelete}
                    className="w-full h-14 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl font-black text-sm uppercase tracking-widest mt-8 hover:bg-red-500 hover:text-white transition-all"
                >
                    {t('delete_habit')}
                </button>
            )}
        </div>
    );
};

export default AddHabit;
