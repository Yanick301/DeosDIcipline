import React from 'react';
import { motion } from 'framer-motion';
import { useHabits } from '../context/HabitContext';
import { Target, TrendingUp, Calendar, Zap } from 'lucide-react';

const Stats = () => {
    const { t, level, xp, userId, completions, habits } = useHabits();

    const nextLevelXp = level * 1000;
    const currentLevelBaseXp = (level - 1) * 1000;
    const progress = ((xp - currentLevelBaseXp) / (nextLevelXp - currentLevelBaseXp)) * 100;

    // Calculate real stats
    const totalCompletions = Object.values(completions).reduce((acc, habitComps) => {
        return acc + Object.values(habitComps).filter(v => v === 'done').length;
    }, 0);

    // Calculate best streak (simplified for now)
    const calculateBestStreak = () => {
        let max = 0;
        Object.values(completions).forEach(habitComps => {
            const dates = Object.keys(habitComps).filter(d => habitComps[d] === 'done').sort();
            if (dates.length > 0) {
                let current = 1;
                for (let i = 1; i < dates.length; i++) {
                    const prev = new Date(dates[i - 1]);
                    const next = new Date(dates[i]);
                    const diff = (next - prev) / (1000 * 60 * 60 * 24);
                    if (diff === 1) current++;
                    else {
                        max = Math.max(max, current);
                        current = 1;
                    }
                }
                max = Math.max(max, current);
            }
        });
        return max;
    };

    const bestStreak = calculateBestStreak();

    return (
        <div className="space-y-8 pb-32">
            <header>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-black text-white">{t('statistics')}</h1>
                        <p className="text-airbnb text-[10px] font-black uppercase tracking-widest">{userId}</p>
                    </div>
                    <p className="text-text-secondary text-sm font-medium">{t('weekly_activity')}</p>
                </div>
            </header>

            {/* Main Score Card */}
            <div className="glass-card bg-gradient-to-br from-surface-200 to-surface-300 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Zap size={120} />
                </div>
                <div className="relative w-32 h-32 mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="58" className="stroke-white/5 fill-transparent" strokeWidth="10" />
                        <motion.circle
                            cx="64" cy="64" r="58"
                            className="stroke-airbnb fill-transparent"
                            strokeWidth="10"
                            strokeDasharray={364}
                            initial={{ strokeDashoffset: 364 }}
                            animate={{ strokeDashoffset: 364 - (progress / 100) * 364 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-white leading-none">{level}</span>
                        <span className="text-[10px] font-black text-airbnb uppercase tracking-widest mt-1">
                            {t('score')}
                        </span>
                    </div>
                </div>
            </div>

            {/* Mini Cards */}
            <div className="grid grid-cols-2 gap-4">
                {[
                    { icon: TrendingUp, label: t('best_streak'), value: bestStreak, color: 'orange' },
                    { icon: Target, label: t('completions'), value: totalCompletions, color: 'green' },
                ].map((stat, i) => (
                    <div key={i} className="glass-card p-4 flex gap-4 items-center">
                        <div className={`p-2 rounded-xl bg-${stat.color === 'orange' ? 'orange' : 'green'}-400/10 text-${stat.color === 'orange' ? 'orange' : 'green'}-400`}>
                            <stat.icon size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-text-tertiary uppercase tracking-wider">{stat.label}</p>
                            <p className="text-xl font-black text-white">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Week View Placeholder */}
            <section className="space-y-4">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-text-tertiary px-1">
                    {t('weekly_activity')}
                </h2>
                <div className="glass-card h-32 flex items-end justify-around p-4 gap-2">
                    {[10, 40, 90, 60, 30, 80, 50].map((v, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 h-full justify-end group">
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${v}%` }}
                                className={`w-8 rounded-full ${i === 2 ? 'bg-airbnb' : 'bg-white/10'} transition-all`}
                            />
                            <span className={`text-[10px] font-bold ${i === 2 ? 'text-airbnb' : 'text-text-tertiary'}`}>
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'][i]}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Heatmap Placeholder */}
            <section className="space-y-4">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-text-tertiary px-1">
                    {t('heatmap')}
                </h2>
                <div className="glass-card p-4">
                    <div className="grid grid-cols-13 gap-1">
                        {Array.from({ length: 52 }).map((_, i) => (
                            <div key={i} className="w-full aspect-square bg-white/5 rounded-[2px]" />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Stats;
