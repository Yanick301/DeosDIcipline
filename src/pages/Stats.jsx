import React from 'react';
import { motion } from 'framer-motion';
import { useHabits } from '../context/HabitContext';
import { Target, TrendingUp, Calendar, Zap, Award } from 'lucide-react';

const Stats = () => {
    const { t, level, xp, userId, completions, habits } = useHabits();

    const nextLevelXp = level * 1000;
    const currentLevelBaseXp = (level - 1) * 1000;
    const progress = ((xp - currentLevelBaseXp) / (nextLevelXp - currentLevelBaseXp)) * 100;

    const totalCompletions = Object.values(completions || {}).reduce((acc, habitComps) => {
        if (!habitComps || typeof habitComps !== 'object') return acc;
        return acc + Object.values(habitComps).filter(v => v === 'done').length;
    }, 0);

    const calculateBestStreak = () => {
        let max = 0;
        Object.values(completions || {}).forEach(habitComps => {
            if (!habitComps || typeof habitComps !== 'object') return;
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

    // Data for the Weekly Luxury Chart
    const weeklyData = (() => {
        const data = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const ds = d.toISOString().split('T')[0];
            const count = Object.values(completions || {}).filter(hComps => hComps && hComps[ds] === 'done').length;
            data.push(count);
        }
        return data;
    })();

    const maxWeekly = Math.max(...weeklyData, 1);
    const chartHeight = 100;
    const chartWidth = 300;
    const points = weeklyData.map((val, i) => ({
        x: (i / 6) * chartWidth,
        y: chartHeight - (val / maxWeekly) * chartHeight
    }));

    const pathData = points.reduce((acc, p, i) =>
        i === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`, "");

    return (
        <div className="space-y-10 pb-32">
            <header className="flex justify-between items-end">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-white">{t('statistics')}</h1>
                    <p className="text-gold text-[10px] font-black uppercase tracking-[0.4em]">{userId}</p>
                </div>
            </header>

            {/* Premium Level Gauge */}
            <div className="glass-premium p-10 flex flex-col items-center justify-center relative overflow-hidden group">
                {/* Decorative Background Glows */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold/10 blur-[60px] rounded-full" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gold/5 blur-[40px] rounded-full" />

                <div className="relative w-44 h-44 mb-6">
                    <svg className="w-full h-full transform -rotate-90">
                        {/* Track */}
                        <circle cx="88" cy="88" r="80" className="stroke-white/5 fill-none" strokeWidth="12" />
                        {/* Progress */}
                        <motion.circle
                            cx="88" cy="88" r="80"
                            className="stroke-gold fill-none"
                            strokeWidth="12"
                            strokeDasharray={502.6}
                            initial={{ strokeDashoffset: 502.6 }}
                            animate={{ strokeDashoffset: 502.6 - (progress / 100) * 502.6 }}
                            transition={{ duration: 2, ease: "circOut" }}
                            strokeLinecap="round"
                        />
                        {/* Glowing Dot at End */}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-5xl font-black text-white leading-none tracking-tighter"
                        >
                            {level}
                        </motion.span>
                        <span className="text-[10px] font-black text-gold-light uppercase tracking-[0.2em] mt-2">
                            Level reached
                        </span>
                    </div>
                </div>

                <div className="w-full max-w-[240px] space-y-2">
                    <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-text-tertiary">
                        <span>{xp} XP Earned</span>
                        <span>{nextLevelXp} Target</span>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                {[
                    { icon: TrendingUp, label: t('best_streak'), value: bestStreak, color: 'var(--color-gold)' },
                    { icon: Award, label: t('completions'), value: totalCompletions, color: 'var(--color-gold)' },
                ].map((stat, i) => (
                    <div key={i} className="glass-premium p-6 flex flex-col gap-3 group">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 text-gold group-hover:bg-gold group-hover:text-obsidian transition-all duration-500"
                        >
                            <stat.icon size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-2xl font-black text-white tracking-tight">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Weekly Luxury Chart (SVG) */}
            <section className="space-y-4">
                <div className="flex justify-between items-end px-1">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-text-tertiary">
                        {t('weekly_activity')}
                    </h2>
                    <span className="text-[10px] font-black text-gold uppercase underline decoration-gold/30">Last 7 Days</span>
                </div>

                <div className="glass-premium p-6 h-56 flex flex-col justify-between">
                    <div className="flex-1 relative">
                        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
                            {/* Grid Lines */}
                            {[0, 0.5, 1].map((p) => (
                                <line
                                    key={p}
                                    x1="0" y1={chartHeight * p} x2={chartWidth} y2={chartHeight * p}
                                    className="stroke-white/[0.03]"
                                    strokeWidth="1"
                                />
                            ))}

                            {/* Gradient Fill */}
                            <defs>
                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0" />
                                </linearGradient>
                            </defs>

                            <motion.path
                                d={`${pathData} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`}
                                fill="url(#chartGradient)"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1 }}
                            />

                            {/* Line */}
                            <motion.path
                                d={pathData}
                                fill="none"
                                className="stroke-gold"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                            />

                            {/* Points */}
                            {points.map((p, i) => (
                                <motion.circle
                                    key={i}
                                    cx={p.x}
                                    cy={p.y}
                                    r="4"
                                    className="fill-obsidian stroke-gold"
                                    strokeWidth="2"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 1 + i * 0.1 }}
                                />
                            ))}
                        </svg>
                    </div>

                    <div className="flex justify-between mt-4">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                            <span key={i} className="text-[10px] font-black text-text-tertiary w-8 text-center uppercase tracking-tighter">
                                {d}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Refined Heatmap */}
            <section className="space-y-4">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-text-tertiary px-1">
                    {t('heatmap')}
                </h2>
                <div className="glass-premium p-6">
                    <div className="grid grid-cols-7 gap-1.5 sm:grid-cols-13 sm:gap-2">
                        {(() => {
                            const cells = [];
                            const today = new Date();
                            for (let i = 90; i >= 0; i--) {
                                const d = new Date(today);
                                d.setDate(today.getDate() - i);
                                const ds = d.toISOString().split('T')[0];
                                const count = Object.values(completions || {}).filter(hComps => hComps && hComps[ds] === 'done').length;

                                let color = 'rgba(255,255,255,0.05)';
                                if (count > 0) color = 'rgba(212, 175, 55, 0.2)';
                                if (count > 2) color = 'rgba(212, 175, 55, 0.5)';
                                if (count > 4) color = 'var(--color-gold)';

                                cells.push({ id: ds, color });
                            }
                            return cells.map(cell => (
                                <motion.div
                                    key={cell.id}
                                    whileHover={{ scale: 1.2, zIndex: 10 }}
                                    className="aspect-square rounded-[3px] transition-colors duration-500"
                                    style={{ backgroundColor: cell.color }}
                                    title={cell.id}
                                />
                            ));
                        })()}
                    </div>
                    <div className="mt-6 flex justify-between items-center text-[8px] font-black uppercase tracking-[0.3em] text-text-tertiary opacity-40">
                        <span>Min Discipline</span>
                        <div className="flex gap-1.5">
                            <div className="w-2 h-2 rounded-[1px] bg-white/5" />
                            <div className="w-2 h-2 rounded-[1px] bg-gold/20" />
                            <div className="w-2 h-2 rounded-[1px] bg-gold/50" />
                            <div className="w-2 h-2 rounded-[1px] bg-gold" />
                        </div>
                        <span>Max Discipline</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Stats;

