import React from 'react';
import { useHabits } from '../context/HabitContext';

const QuoteCard = () => {
    const { t } = useHabits();

    // Simplified rotation for now
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const keys = ['q1', 'q2', 'q3', 'q4'];
    const key = keys[dayOfYear % keys.length];

    return (
        <div className="relative glass-card bg-airbnb/5 border-airbnb/10 p-6 overflow-hidden">
            <span className="absolute -top-4 -left-2 text-8xl text-airbnb/10 font-serif leading-none italic select-none">“</span>
            <div className="relative z-10 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-airbnb">
                    {t('inspiration')}
                </span>
                <p className="text-white text-lg font-medium italic leading-relaxed">
                    "{t(key)}"
                </p>
                <p className="text-text-tertiary text-xs font-bold uppercase tracking-wider">— DEOS</p>
            </div>
        </div>
    );
};

export default QuoteCard;
