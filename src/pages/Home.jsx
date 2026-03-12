import React from 'react';
import { motion } from 'framer-motion';
import { useHabits } from '../context/HabitContext';
import HabitCard from '../components/HabitCard';
import ProgressRing from '../components/ProgressRing';
import QuoteCard from '../components/QuoteCard';

const Home = ({ onEdit }) => {
    const { habits, completions, toggleCompletion, calculateMasterStreak, calculateHabitStreak, t, lang, level, xp, userId } = useHabits();

    const today = new Date().getDay();
    const dateStr = new Date().toISOString().split('T')[0];

    const todayHabits = habits.filter(h => Array.isArray(h.days) && h.days.includes(today));
    const doneHabits = todayHabits.filter(h => completions[h.id]?.[dateStr] === 'done');
    const pendingHabits = todayHabits.filter(h => !completions[h.id]?.[dateStr]);
    const otherHabits = todayHabits.filter(h => {
        const s = completions[h.id]?.[dateStr];
        return s === 'skipped' || s === 'postponed';
    });

    const progress = todayHabits.length > 0 ? Math.round((doneHabits.length / todayHabits.length) * 100) : 0;

    const greeting = (h) => {
        if (h < 5) return t('good_night');
        if (h < 12) return t('good_morning');
        if (h < 17) return t('good_afternoon');
        if (h < 21) return t('good_evening');
        return t('good_night');
    };

    const formattedDate = new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="space-y-8 pb-32">
            {/* Header */}
            <header className="flex justify-between items-end">
                <div>
                    <span className="text-gold text-[10px] font-black uppercase tracking-[0.4em] mb-2 block opacity-70">
                        {userId}
                    </span>
                    <h1 className="text-4xl font-black tracking-tighter text-white mb-2 leading-none">
                        {greeting(new Date().getHours())}
                    </h1>
                    <p className="text-text-tertiary text-xs font-bold tracking-wide uppercase opacity-40">
                        {formattedDate}
                    </p>
                </div>
                <div className="relative w-20 h-20">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="40" cy="40" r="36" className="stroke-white/5 fill-none" strokeWidth="4" />
                        <motion.circle
                            cx="40" cy="40" r="36"
                            className="stroke-gold fill-none"
                            strokeWidth="4"
                            strokeDasharray={226.2}
                            initial={{ strokeDashoffset: 226.2 }}
                            animate={{ strokeDashoffset: 226.2 - (progress / 100) * 226.2 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-black text-white leading-none">{progress}%</span>
                    </div>
                </div>
            </header>

            {/* Quote */}
            <QuoteCard />

            {/* Stats Quick Look */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: t('streak'), value: calculateMasterStreak(), color: 'gold', icon: '🔥' },
                    { label: t('done'), value: doneHabits.length, color: 'gold', icon: '✅' },
                    { label: t('score'), value: level, color: 'gold', icon: '🔱' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 25,
                            delay: 0.05 * i
                        }}
                        className="glass-premium p-4 flex flex-col items-center justify-center text-center relative overflow-hidden group"
                    >
                        <div className="absolute -right-1 -top-1 text-2xl opacity-10 grayscale group-hover:grayscale-0 transition-all duration-500">
                            {stat.icon}
                        </div>
                        <span className="text-[9px] font-black text-white/30 mb-2 uppercase tracking-[0.2em] leading-none z-10">
                            {stat.label}
                        </span>
                        <span className={`text-2xl font-black z-10 text-gold-light`}>
                            {stat.value}
                        </span>
                    </motion.div>
                ))}
            </div>

            {/* Habits List */}
            <section className="space-y-4">
                <div className="flex justify-between items-center px-1">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-text-tertiary">
                        {t('today')}
                    </h2>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-airbnb/20 text-airbnb rounded-full">
                        {pendingHabits.length} {t('left')}
                    </span>
                </div>

                {todayHabits.length === 0 ? (
                    <div className="glass-card py-12 flex flex-col items-center justify-center text-center space-y-3">
                        <span className="text-4xl text-white opacity-20">🎯</span>
                        <div>
                            <h3 className="text-white font-bold">{t('no_habits_title')}</h3>
                            <p className="text-text-tertiary text-sm">{t('no_habits_body')}</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Pending Items */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {pendingHabits.map((h) => (
                                <HabitCard
                                    key={h.id}
                                    habit={h}
                                    status={null}
                                    dateStr={dateStr}
                                    streak={calculateHabitStreak(h.id)}
                                    onComplete={toggleCompletion}
                                    onNav={(id) => onEdit(id)}
                                />
                            ))}
                        </div>

                        {/* Skipped / Later */}
                        {otherHabits.length > 0 && (
                            <div className="space-y-3">
                                <p className="text-[11px] font-black uppercase tracking-widest text-text-tertiary px-1">
                                    {t('skipped_later')}
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {otherHabits.map((h) => (
                                        <HabitCard
                                            key={h.id}
                                            habit={h}
                                            status={completions[h.id]?.[dateStr]}
                                            dateStr={dateStr}
                                            streak={calculateHabitStreak(h.id)}
                                            onComplete={toggleCompletion}
                                            onNav={(id) => onEdit(id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Completed Items */}
                        {doneHabits.length > 0 && (
                            <div className="space-y-3">
                                <p className="text-[11px] font-black uppercase tracking-widest text-gold px-1">
                                    {t('completed')}
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {doneHabits.map((h) => (
                                        <HabitCard
                                            key={h.id}
                                            habit={h}
                                            status="done"
                                            dateStr={dateStr}
                                            streak={calculateHabitStreak(h.id)}
                                            onComplete={toggleCompletion}
                                            onNav={(id) => onEdit(id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
