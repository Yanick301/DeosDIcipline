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

    const todayHabits = habits.filter(h => h.days.includes(today));
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
                    <h1 className="text-3xl font-black tracking-tight text-white mb-1">
                        {greeting(new Date().getHours())}
                    </h1>
                    <p className="text-airbnb text-[10px] font-black uppercase tracking-widest mb-1">
                        {userId}
                    </p>
                    <p className="text-text-secondary text-sm font-medium capitalize">
                        {formattedDate}
                    </p>
                </div>
                <div className="relative w-20 h-20">
                    <ProgressRing progress={progress} />
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
                    { label: t('streak'), value: calculateMasterStreak(), color: 'orange' },
                    { label: t('done'), value: doneHabits.length, color: 'airbnb' },
                    { label: t('score'), value: level, color: 'green' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * i }}
                        className="glass-card p-3 flex flex-col items-center justify-center text-center"
                    >
                        <span className="text-sm font-bold text-text-tertiary mb-1 uppercase tracking-widest leading-none">
                            {stat.label}
                        </span>
                        <span className={`text-2xl font-black ${stat.color === 'airbnb' ? 'text-airbnb' : stat.color === 'orange' ? 'text-orange-400' : 'text-green-400'}`}>
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
                    <div className="space-y-3">
                        {pendingHabits.map((h) => (
                            <HabitCard
                                key={h.id}
                                habit={h}
                                status={null}
                                streak={calculateHabitStreak(h.id)}
                                onComplete={toggleCompletion}
                                onNav={(id) => onEdit(id)}
                            />
                        ))}

                        {otherHabits.length > 0 && (
                            <p className="text-[11px] font-black uppercase tracking-widest text-text-tertiary pt-2 px-1">
                                {t('skipped_later')}
                            </p>
                        )}
                        {otherHabits.map((h) => (
                            <HabitCard
                                key={h.id}
                                habit={h}
                                status={completions[h.id]?.[dateStr]}
                                streak={calculateHabitStreak(h.id)}
                                onComplete={toggleCompletion}
                                onNav={(id) => onEdit(id)}
                            />
                        ))}

                        {doneHabits.length > 0 && (
                            <p className="text-[11px] font-black uppercase tracking-widest text-green-400 pt-2 px-1">
                                {t('completed')}
                            </p>
                        )}
                        {doneHabits.map((h) => (
                            <HabitCard
                                key={h.id}
                                habit={h}
                                status="done"
                                streak={calculateHabitStreak(h.id)}
                                onComplete={toggleCompletion}
                                onNav={(id) => onEdit(id)}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
