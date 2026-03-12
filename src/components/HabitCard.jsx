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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2, borderColor: 'rgba(255, 255, 255, 0.1)' }}
            className={`
                relative overflow-hidden glass-card mb-4 flex items-center gap-4 cursor-pointer transition-all duration-700
                ${isDone ? 'opacity-30' : ''} 
                ${isSkipped ? 'opacity-50 border-white/5' : ''}
            `}
            onClick={(e) => {
                if (e.target.closest('.habit-actions')) return;
                onNav(habit.id);
            }}
        >
            {/* Elegant Icon Container */}
            <div
                className="w-12 h-12 rounded-[20px] flex items-center justify-center flex-shrink-0 relative group-hover:scale-105 transition-transform duration-700"
                style={{ backgroundColor: `${color}15`, color: color }}
            >
                <div className="absolute inset-0 blur-md opacity-20" style={{ backgroundColor: color }} />
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current stroke-[1.5] relative z-10 transition-transform duration-500 group-hover:rotate-6">
                    <path d={icon.path} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            {/* Typography & Meta */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h3 className="text-[17px] font-medium text-white truncate tracking-tight leading-tight">{habit.name}</h3>

                <div className="flex items-center gap-2 mt-1">
                    {streak > 0 && (
                        <span className="flex items-center gap-1 text-[10px] font-medium text-gold/80 uppercase tracking-wider">
                            <Flame size={10} className="text-gold" /> {streak}d
                        </span>
                    )}
                    {habit.reminderTime && (
                        <>
                            {streak > 0 && <span className="text-white/20 text-[10px]">•</span>}
                            <span className="flex items-center gap-1 text-[10px] font-medium text-text-tertiary uppercase tracking-wider">
                                <Clock size={10} /> {habit.reminderTime}
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Minimalist Actions */}
            <div className="habit-actions flex items-center gap-1.5 ml-2">
                {isDone ? (
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onComplete(habit.id, dateStr, 'undo')}
                        className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                        <Check size={16} strokeWidth={2} />
                    </motion.button>
                ) : (
                    <>
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                HapticService.light();
                                SoundService.play('success');
                                confetti({
                                    particleCount: 50,
                                    spread: 60,
                                    origin: { y: 0.6 },
                                    colors: ['#ffffff', color, '#000000']
                                });
                                onComplete(habit.id, dateStr, 'done');
                            }}
                            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center border border-white/5 transition-colors"
                        >
                            <Check size={16} strokeWidth={1.5} />
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onComplete(habit.id, dateStr, 'skipped')}
                            className="w-9 h-9 rounded-full hover:bg-white/5 text-text-tertiary flex items-center justify-center transition-colors"
                        >
                            <SkipForward size={16} strokeWidth={1.5} />
                        </motion.button>
                    </>
                )}
            </div>
        </motion.div>
    );
};

export default HabitCard;
