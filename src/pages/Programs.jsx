import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Timer, Flame, ChevronRight, Lock } from 'lucide-react';
import { useHabits } from '../context/HabitContext';

const PROGRAMS = [
    {
        id: 'p1',
        name: 'Monk Mode 7-Day',
        desc: 'Complete isolation. Extreme focus. No distractions.',
        duration: '7 Days',
        difficulty: 'Extreme',
        xp: 1500,
        habits: ['Deep Work (2h)', 'No Social Media', 'Early Rise (5AM)'],
        color: '#FF385C'
    },
    {
        id: 'p2',
        name: 'Dopamine Detox',
        desc: 'Reset your brain receptivity by removing instant gratification.',
        duration: '3 Days',
        difficulty: 'Hard',
        xp: 800,
        habits: ['No Sugary Foods', 'No YouTube/TikTok', 'Meditation (15m)'],
        color: '#FF9500'
    },
    {
        id: 'p3',
        name: 'Hybrid Athlete',
        desc: 'Combining strength training with endurance for peak performance.',
        duration: '30 Days',
        difficulty: 'High',
        xp: 3000,
        habits: ['Strength Training', '5K Run', 'Cold Shower'],
        color: '#32ADE6'
    }
];

const Programs = () => {
    const { t, addHabit } = useHabits();
    const [enrolled, setEnrolled] = useState(null);

    const joinProgram = (program) => {
        program.habits.forEach(h => {
            addHabit({
                name: h,
                notes: `Part of ${program.name}`,
                priority: 'High',
                color: program.color,
                days: [0, 1, 2, 3, 4, 5, 6],
                reminder: '08:00'
            });
        });
        setEnrolled(program.id);
        setTimeout(() => setEnrolled(null), 3000);
    };

    return (
        <div className="space-y-8 pb-32">
            <header>
                <h1 className="text-3xl font-black text-white">{t('programs')}</h1>
                <p className="text-text-secondary text-sm font-medium">{t('explore_programs')}</p>
            </header>

            <div className="space-y-6">
                {PROGRAMS.map((program, i) => (
                    <motion.div
                        key={program.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card overflow-hidden p-0 flex flex-col"
                    >
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black text-white">{program.name}</h3>
                                    <div className="flex gap-2">
                                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-white/5 rounded-full text-text-tertiary">
                                            {program.duration}
                                        </span>
                                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full`} style={{ backgroundColor: `${program.color}20`, color: program.color }}>
                                            {program.difficulty}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-yellow-400 font-black">
                                        <Zap size={14} fill="currentColor" />
                                        <span>{program.xp} XP</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm font-medium text-text-secondary leading-relaxed">
                                {program.desc}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {program.habits.map((h, idx) => (
                                    <span key={idx} className="text-[10px] font-bold text-white/40 bg-white/5 px-2 py-1 rounded-lg">
                                        + {h}
                                    </span>
                                ))}
                            </div>

                            <button
                                onClick={() => joinProgram(program)}
                                disabled={enrolled === program.id}
                                className={`w-full h-14 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg ${enrolled === program.id ? 'bg-green-500' : ''}`}
                                style={{ backgroundColor: enrolled === program.id ? undefined : program.color, color: 'white' }}
                            >
                                {enrolled === program.id ? (
                                    <>Check Home Screen <Flame size={18} /></>
                                ) : (
                                    <>{t('join_program')} <ChevronRight size={18} /></>
                                )}
                            </button>
                        </div>
                    </motion.div>
                ))}

                {/* Locked Programs */}
                <div className="relative">
                    <div className="absolute inset-0 bg-surface-100/40 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10">
                        <Lock size={32} className="text-text-tertiary mb-2" />
                        <p className="text-xs font-black text-text-tertiary uppercase tracking-widest">Level 10 Required</p>
                    </div>
                    <div className="glass-card opacity-30 grayscale blur-sm">
                        <div className="h-40" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Programs;
