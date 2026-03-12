import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHabits } from '../context/HabitContext';
import { X, Check, Clock, Calendar, BarChart, Palette } from 'lucide-react';
import { HABIT_ICONS } from '../lib/constants';

const AddHabit = ({ onDone }) => {
    const { t, addHabit } = useHabits();
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [icon, setIcon] = useState('fitness');
    const [color, setColor] = useState('#FF385C');
    const [days, setDays] = useState([0, 1, 2, 3, 4, 5, 6]);
    const [time, setTime] = useState('');
    const [priority, setPriority] = useState('MEDIUM');

    const handleSave = () => {
        if (!name) return;
        addHabit({ name, description: desc, icon, color, days, reminderTime: time, priority });
        onDone();
    };

    const COLORS = ['#FF385C', '#0A84FF', '#30D158', '#FF9F0A', '#BF5AF2', '#32ADE6', '#FF2D55', '#FFD60A'];

    return (
        <div className="space-y-8 animate-spring-in">
            <header className="flex justify-between items-center">
                <button onClick={onDone} className="text-text-secondary">
                    <X size={24} />
                </button>
                <h1 className="text-xl font-black text-white uppercase tracking-widest">{t('new_habit')}</h1>
                <button onClick={handleSave} className="text-airbnb font-black text-lg">
                    {t('done_btn')}
                </button>
            </header>

            {/* Icon Preview */}
            <div className="flex justify-center py-4">
                <motion.div
                    layoutId="habit-icon"
                    className="w-24 h-24 rounded-[32px] flex items-center justify-center text-airbnb shadow-2xl shadow-airbnb/20"
                    style={{ backgroundColor: `${color}15`, color: color }}
                >
                    <svg viewBox="0 0 24 24" className="w-12 h-12 fill-none stroke-current stroke-2">
                        <path d={HABIT_ICONS.find(i => i.id === icon)?.path} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </motion.div>
            </div>

            {/* Form */}
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary px-1">{t('name_label')}</label>
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder={t('name_placeholder')}
                        className="w-full h-14 bg-surface-200 border border-white/5 rounded-2xl px-4 text-white font-bold focus:outline-none focus:border-airbnb transition-colors"
                    />
                </div>

                {/* Color Picker */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary px-1">{t('color')}</label>
                    <div className="flex justify-between overflow-x-auto pb-2 gap-3 no-scrollbar">
                        {COLORS.map(c => (
                            <button
                                key={c}
                                onClick={() => setColor(c)}
                                className={`w-10 h-10 rounded-full flex-shrink-0 transition-all ${color === c ? 'ring-4 ring-white/20 scale-110' : 'opacity-40'}`}
                                style={{ backgroundColor: c }}
                            >
                                {color === c && <Check size={18} className="mx-auto text-white" strokeWidth={3} />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Icon Grid */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary px-1">{t('icon')}</label>
                    <div className="grid grid-cols-4 gap-3">
                        {HABIT_ICONS.map(ic => (
                            <button
                                key={ic.id}
                                onClick={() => setIcon(ic.id)}
                                className={`aspect-square rounded-2xl flex items-center justify-center transition-all ${icon === ic.id ? 'bg-white/10 text-white' : 'bg-surface-200 text-text-tertiary hover:bg-white/5'}`}
                            >
                                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current stroke-2">
                                    <path d={ic.path} strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Schedule */}
                <div className="glass-card divide-y divide-white/5 p-0 overflow-hidden">
                    <div className="flex items-center gap-4 p-4">
                        <Calendar size={20} className="text-airbnb" />
                        <span className="flex-1 font-bold text-sm text-white">{t('schedule')}</span>
                        <div className="flex gap-1">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        if (days.includes(i)) setDays(days.filter(idx => idx !== i));
                                        else setDays([...days, i]);
                                    }}
                                    className={`w-7 h-7 rounded-sm flex items-center justify-center text-[10px] font-black transition-colors ${days.includes(i) ? 'bg-airbnb text-white' : 'bg-white/5 text-text-tertiary'}`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4">
                        <Clock size={20} className="text-sky-400" />
                        <span className="flex-1 font-bold text-sm text-white">{t('reminder_label')}</span>
                        <input
                            type="time"
                            value={time}
                            onChange={e => setTime(e.target.value)}
                            className="bg-transparent text-white font-bold text-sm focus:outline-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddHabit;
