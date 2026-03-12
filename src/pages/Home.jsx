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
            {/* Bento Box Dashboard Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Main Welcome & Progress (Spans 2 cols on desktop) */}
                <header className="glass-card md:col-span-2 flex items-center justify-between p-6">
                    <div className="space-y-2">
                        <span className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-medium block">
                            {formattedDate}
                        </span>
                        <h1 className="text-4xl font-light tracking-tight text-white leading-none">
                            {greeting(new Date().getHours())},<br />
                            <span className="font-medium">{userId}</span>
                        </h1>
                    </div>

                    {/* Refined Progress Ring */}
                    <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-full h-full transform -rotate-90 relative z-10">
                            <circle cx="40" cy="40" r="36" className="stroke-white/5 fill-none" strokeWidth="2" />
                            <motion.circle
                                cx="40" cy="40" r="36"
                                className="stroke-white fill-none"
                                strokeWidth="2"
                                strokeDasharray={226.2}
                                initial={{ strokeDashoffset: 226.2 }}
                                animate={{ strokeDashoffset: 226.2 - (progress / 100) * 226.2 }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                            <span className="text-xl font-medium text-white leading-none">{progress}%</span>
                        </div>
                    </div>
                </header>

                {/* Level & Streak Bento Block */}
                <div className="glass-card flex flex-col justify-between p-6 h-full min-h-[140px]">
                    <div className="flex justify-between items-start">
                        <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-medium">Ascension</span>
                        <span className="text-xl opacity-50">🔱</span>
                    </div>
                    <div>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-light text-white">{level}</span>
                            <span className="text-sm font-medium text-white/40 mb-1 border-l border-white/10 pl-2 ml-1">Lvl</span>
                        </div>
                        <div className="mt-2 text-xs font-medium text-gold/70 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-gold/70 shadow-[0_0_10px_rgba(212,175,55,0.5)]"></span>
                            {calculateMasterStreak()} Days Discipline
                        </div>
                    </div>
                </div>
            </div>

            {/* Habits List */}
            <section className="space-y-4">
                <div className="flex justify-between items-center px-1">
                    <h2 className="text-[14px] font-medium text-white/70">
                        {t('today')}
                    </h2>
                    <span className="text-[10px] font-medium px-2.5 py-1 bg-white/5 text-white/50 rounded-full border border-white/5">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                                <p className="text-[13px] font-medium text-white/50 px-1">
                                    {t('skipped_later')}
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                                <p className="text-[13px] font-medium text-gold/70 px-1">
                                    {t('completed')}
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
