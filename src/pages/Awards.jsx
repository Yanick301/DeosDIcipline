import React from 'react';
import { motion } from 'framer-motion';
import { useHabits } from '../context/HabitContext';
import { Award, Trophy, Star, Shield, Zap } from 'lucide-react';
import { BADGES } from '../lib/constants';

const Awards = () => {
    const { t } = useHabits();

    return (
        <div className="space-y-8 pb-32">
            <header>
                <h1 className="text-3xl font-black text-white">{t('awards')}</h1>
                <p className="text-text-secondary text-sm font-medium">{t('leaderboard')}</p>
            </header>

            {/* Rarity Legend */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {['common', 'uncommon', 'rare', 'epic', 'legendary'].map(rarity => (
                    <span key={rarity} className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full text-text-tertiary flex-shrink-0">
                        {rarity}
                    </span>
                ))}
            </div>

            {/* Badges Grid */}
            <section className="space-y-4">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-text-tertiary px-1">
                    {t('badges')}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    {BADGES.map((badge, i) => (
                        <motion.div
                            key={badge.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-card group hover:bg-airbnb/5 transition-all p-6 flex flex-col items-center text-center space-y-4"
                        >
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform grayscale opacity-30">
                                {badge.emoji}
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-text-secondary mb-1">{t(badge.nameKey)}</h3>
                                <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                                    {t(badge.descKey)}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Leaderboard Placeholder */}
            <section className="space-y-4">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-text-tertiary px-1">
                    {t('leaderboard')}
                </h2>
                <div className="glass-card divide-y divide-white/5 p-0 overflow-hidden">
                    {[
                        { name: 'Fitness Warrior', score: 98, color: '#FF385C' },
                        { name: 'Deep Work', score: 92, color: '#0A84FF' },
                        { name: 'Cold Shower', score: 85, color: '#32ADE6' }
                    ].map((habit, i) => (
                        <div key={i} className="flex items-center gap-4 p-4">
                            <span className={`text-lg font-black ${i === 0 ? 'text-yellow-400' : 'text-text-tertiary'}`}>
                                {i + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate">{habit.name}</p>
                                <div className="w-full h-1 bg-white/5 rounded-full mt-2">
                                    <div className="h-full rounded-full" style={{ width: `${habit.score}%`, backgroundColor: habit.color }} />
                                </div>
                            </div>
                            <span className="text-xs font-black" style={{ color: habit.color }}>{habit.score}%</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Awards;
