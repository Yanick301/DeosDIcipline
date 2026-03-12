import React from 'react';
import { motion } from 'framer-motion';
import { Check, SkipForward, Flame, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SoundService } from '../services/SoundService';
import { HapticService } from '../services/HapticService';
import { HABIT_ICONS } from '../lib/constants';

const HabitCard = ({ habit, status, dateStr, streak, onComplete, onNav }) => {
    const icon = HABIT_ICONS.find(i => i.id === habit.icon) || HABIT_ICONS[0];
    const isDone = status === 'done';
    const isSkipped = status === 'skipped';
    const color = habit.color === '#FF385C' ? 'var(--color-gold)' : (habit.color || 'var(--color-gold)');

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -4, borderColor: 'rgba(212, 175, 55, 0.3)' }}
            className={`relative overflow-hidden glass-premium mb-4 flex items-center gap-5 p-5 cursor-pointer transition-colors duration-500 ${isDone ? 'opacity-40 grayscale-[0.5]' : ''} ${isSkipped ? 'border-orange-500/30' : ''}`}
            onClick={(e) => {
                if (e.target.closest('.habit-actions')) return;
                onNav(habit.id);
            }}
        >
            {/* Medallion / Icon Container */}
            <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 relative group-hover:scale-110 transition-transform duration-500"
                style={{ backgroundColor: `${color}10`, color: color, border: `1px solid ${color}20` }}
            >
                <div className="absolute inset-0 blur-xl opacity-20" style={{ backgroundColor: color }} />
                <svg viewBox="0 0 24 24" className="w-7 h-7 fill-none stroke-current stroke-2 relative z-10">
                    <path d={icon.path} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            {/* Body */}
            <div className="flex-1 min-w-0 space-y-1.5">
                <h3 className="text-lg font-black text-white truncate tracking-tight">{habit.name}</h3>
                <div className="flex items-center gap-3">
                    {streak > 0 && (
                        <span className="flex items-center gap-1.5 text-[9px] font-black text-gold gold-glow bg-gold/10 border border-gold/20 px-2.5 py-1 rounded-full uppercase tracking-widest">
                            <Flame size={12} fill="currentColor" /> {streak}d Streak
                        </span>
                    )}
                    {habit.reminderTime && (
                        <span className="flex items-center gap-1.5 text-[9px] font-black text-text-tertiary bg-white/5 border border-white/5 px-2.5 py-1 rounded-full uppercase tracking-widest leading-none">
                            <Clock size={12} /> {habit.reminderTime}
                        </span>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="habit-actions flex items-center gap-2">
                {isDone ? (
                    <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => onComplete(habit.id, dateStr, 'undo')}
                        className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center"
                    >
                        <Check size={20} strokeWidth={3} />
                    </motion.button>
                ) : (
                    <>
                        <motion.button
                            whileTap={{ scale: 0.8 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                HapticService.light();
                                SoundService.play('success');
                                confetti({
                                    particleCount: 100,
                                    spread: 70,
                                    origin: { y: 0.6 },
                                    colors: ['#FF385C', '#ffffff', '#000000']
                                });
                                onComplete(habit.id, dateStr, 'done');
                            }}
                            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-text-secondary flex items-center justify-center border border-white/5"
                        >
                            <Check size={20} strokeWidth={2.5} />
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.8 }}
                            onClick={() => onComplete(habit.id, dateStr, 'skipped')}
                            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-text-tertiary flex items-center justify-center border border-white/5"
                        >
                            <SkipForward size={20} strokeWidth={2.5} />
                        </motion.button>
                    </>
                )}
            </div>
        </motion.div>
    );
};

export default HabitCard;
