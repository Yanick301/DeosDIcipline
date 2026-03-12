import React from 'react';
import { motion } from 'framer-motion';
import { Check, SkipForward, Flame, Clock } from 'lucide-react';
import { HABIT_ICONS } from '../lib/constants';

const HabitCard = ({ habit, status, streak, onComplete, onNav }) => {
    const icon = HABIT_ICONS.find(i => i.id === habit.icon) || HABIT_ICONS[0];
    const isDone = status === 'done';
    const isSkipped = status === 'skipped';
    const color = habit.color || '#FF385C';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -2 }}
            className={`relative overflow-hidden glass-card mb-4 flex items-center gap-4 cursor-pointer ${isDone ? 'opacity-60' : ''}`}
            onClick={(e) => {
                if (e.target.closest('.habit-actions')) return;
                onNav(habit.id);
            }}
        >
            {/* Status Bar */}
            <div
                className="absolute left-0 top-0 bottom-0 w-1.5"
                style={{ backgroundColor: color }}
            />

            {/* Icon */}
            <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${color}15`, color: color }}
            >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current stroke-2">
                    <path d={icon.path} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            {/* Body */}
            <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-white truncate">{habit.name}</h3>
                <div className="flex items-center gap-3 mt-1">
                    {streak > 0 && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-full">
                            <Flame size={12} strokeWidth={2.5} /> {streak}d
                        </span>
                    )}
                    {habit.reminderTime && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-text-secondary bg-white/5 px-2 py-0.5 rounded-full">
                            <Clock size={12} strokeWidth={2.5} /> {habit.reminderTime}
                        </span>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="habit-actions flex items-center gap-2">
                {isDone ? (
                    <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => onComplete(habit.id, 'undo')}
                        className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center"
                    >
                        <Check size={20} strokeWidth={3} />
                    </motion.button>
                ) : (
                    <>
                        <motion.button
                            whileTap={{ scale: 0.8 }}
                            onClick={() => onComplete(habit.id, 'done')}
                            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-text-secondary flex items-center justify-center border border-white/5"
                        >
                            <Check size={20} strokeWidth={2.5} />
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.8 }}
                            onClick={() => onComplete(habit.id, 'skipped')}
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
