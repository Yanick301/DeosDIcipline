import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHabits } from '../context/HabitContext';
import { Award, Trophy, Star, Shield, Zap, Info } from 'lucide-react';
import { BADGES } from '../lib/constants';

const RARITY_THEMES = {
    common: { border: 'border-white/10', glow: 'shadow-none', text: 'text-text-secondary', bg: 'bg-white/5' },
    uncommon: { border: 'border-green-500/30', glow: 'shadow-[0_0_15px_rgba(48,209,88,0.1)]', text: 'text-green-400', bg: 'bg-green-500/5' },
    rare: { border: 'border-blue-500/30', glow: 'shadow-[0_0_15px_rgba(10,132,255,0.1)]', text: 'text-blue-400', bg: 'bg-blue-500/5' },
    epic: { border: 'border-purple-500/30', glow: 'shadow-[0_0_15px_rgba(191,90,242,0.1)]', text: 'text-purple-400', bg: 'bg-purple-500/5' },
    legendary: { border: 'border-gold/40', glow: 'shadow-[0_0_20px_rgba(212,175,55,0.2)]', text: 'text-gold', bg: 'bg-gold/10' },
};

const Awards = () => {
    const { t, unlockedBadges, userId, xp, level } = useHabits();
    const [filter, setFilter] = useState('all');

    const filteredBadges = BADGES.filter(b => filter === 'all' || b.rarity === filter);

    return (
        <div className="space-y-10 pb-32">
            <header className="space-y-1">
                <h1 className="text-3xl font-black text-white">{t('awards')}</h1>
                <p className="text-gold text-[10px] font-black uppercase tracking-[0.4em] opacity-70">
                    The Hall of Discipline
                </p>
            </header>

            {/* Rarity Filter / Legend */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-white text-obsidian' : 'bg-white/5 text-text-tertiary'
                        }`}
                >
                    All
                </button>
                {['common', 'uncommon', 'rare', 'epic', 'legendary'].map(rarity => (
                    <button
                        key={rarity}
                        onClick={() => setFilter(rarity)}
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filter === rarity
                                ? 'bg-gold text-obsidian shadow-lg gold-glow'
                                : 'bg-white/5 text-text-tertiary'
                            }`}
                    >
                        {rarity}
                    </button>
                ))}
            </div>

            {/* Badges Gallery */}
            <section className="space-y-6">
                <div className="flex justify-between items-center px-1">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-text-tertiary">
                        Vaulted Artefacts
                    </h2>
                    <span className="text-[10px] font-black text-gold">
                        {unlockedBadges.length} / {BADGES.length} Collected
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <AnimatePresence mode="popLayout">
                        {filteredBadges.map((badge, i) => {
                            const isUnlocked = unlockedBadges.includes(badge.id);
                            const theme = RARITY_THEMES[badge.rarity] || RARITY_THEMES.common;

                            return (
                                <motion.div
                                    key={badge.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ delay: i * 0.05 }}
                                    className={`relative glass-premium p-6 flex flex-col items-center text-center space-y-4 border ${isUnlocked ? `${theme.border} ${theme.glow}` : 'border-white/5 grayscale opacity-30'
                                        }`}
                                >
                                    {/* Rarity Tag */}
                                    <div className={`absolute top-2 right-2 text-[6px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${isUnlocked ? theme.text + ' bg-white/5' : 'text-text-tertiary bg-white/5'
                                        }`}>
                                        {badge.rarity}
                                    </div>

                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-transform duration-500 ${isUnlocked ? theme.bg : 'bg-white/5'
                                        } group-hover:scale-110`}>
                                        {badge.emoji}
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className={`text-[12px] font-black tracking-tight leading-tight ${isUnlocked ? 'text-white' : 'text-text-tertiary'
                                            }`}>
                                            {t(badge.nameKey)}
                                        </h3>
                                        {isUnlocked && (
                                            <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-tighter leading-tight opacity-60">
                                                {t(badge.descKey)}
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </section>

            {/* Prestige Leaderboard */}
            <section className="space-y-6">
                <div className="flex justify-between items-center px-1">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-text-tertiary">
                        The Honor Roll
                    </h2>
                </div>

                <div className="glass-premium divide-y divide-white/5 p-2 overflow-hidden">
                    {[
                        { name: t('elite_warrior'), level: 12, badges: 8 },
                        { name: userId, level: level, isMe: true, badges: unlockedBadges.length },
                        { name: t('shower_king'), level: 8, badges: 5 },
                        { name: t('work_master'), level: 5, badges: 3 }
                    ].sort((a, b) => b.level - a.level).map((user, i) => (
                        <div key={i} className={`flex items-center gap-4 p-4 rounded-xl transition-all ${user.isMe ? 'bg-gold/10' : ''}`}>
                            <div className="flex flex-col items-center justify-center w-8">
                                <span className={`text-lg font-black ${i === 0 ? 'text-gold' :
                                        i === 1 ? 'text-slate-300' :
                                            i === 2 ? 'text-orange-900/40' : 'text-text-tertiary'
                                    }`}>
                                    {i + 1}
                                </span>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <p className={`text-sm font-black truncate ${user.isMe ? 'text-gold' : 'text-white'}`}>
                                        {user.name} {user.isMe && `(${t('you')})`}
                                    </p>
                                    <div className="flex items-center gap-1.5">
                                        <Zap size={10} className="text-gold" />
                                        <span className="text-[10px] font-black text-white/40 uppercase">LVL {user.level}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex -space-x-1">
                                        {[...Array(Math.min(user.badges, 5))].map((_, idx) => (
                                            <div key={idx} className="w-3 h-3 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-[6px]">
                                                ✨
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-[8px] font-black text-text-tertiary uppercase tracking-widest">
                                        {user.badges} Badges
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Awards;

