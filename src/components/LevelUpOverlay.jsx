import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHabits } from '../context/HabitContext';
import { Trophy, Award, Zap, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SoundService } from '../services/SoundService';
import { HapticService } from '../services/HapticService';
import { BADGES } from '../lib/constants';

const LevelUpOverlay = () => {
    const { lastUnlocked, setLastUnlocked, t } = useHabits();

    useEffect(() => {
        if (lastUnlocked) {
            // Trigger Sensory Feedback
            SoundService.play('levelUp');
            HapticService.success();

            // Big blast for level up or badges
            confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#D4AF37', '#ffffff', '#B8860B']
            });

            // Auto close after 5 seconds if not closed manually
            const timer = setTimeout(() => {
                setLastUnlocked(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [lastUnlocked, setLastUnlocked]);

    if (!lastUnlocked) return null;

    const isLevel = lastUnlocked.type === 'level';
    const badge = !isLevel ? BADGES.find(b => b.id === lastUnlocked.value) : null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-obsidian/90 backdrop-blur-3xl"
                onClick={() => setLastUnlocked(null)}
            >
                <motion.div
                    initial={{ scale: 0.5, y: 100, rotate: -10 }}
                    animate={{ scale: 1, y: 0, rotate: 0 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="glass-premium p-10 flex flex-col items-center text-center max-w-sm border-gold/40 gold-glow relative overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Background Shine */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-gold/10 via-transparent to-gold/10 animate-pulse" />

                    <div className="relative mb-8">
                        <div className="w-24 h-24 rounded-full bg-gold/20 flex items-center justify-center text-5xl border border-gold/50 shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                            {isLevel ? '🔱' : (badge?.emoji || '✨')}
                        </div>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                            className="absolute inset-0 border-2 border-dashed border-gold/30 rounded-full scale-125"
                        />
                    </div>

                    <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-gold mb-2">
                        {isLevel ? 'God Tier Ascension' : 'Relic Recovered'}
                    </h2>

                    <h1 className="text-4xl font-black text-white tracking-tighter mb-4">
                        {isLevel ? `Level ${lastUnlocked.value}` : t(badge?.nameKey)}
                    </h1>

                    <p className="text-sm font-medium text-text-secondary leading-relaxed mb-8">
                        {isLevel
                            ? 'You have transcended your previous limits. Your discipline is absolute.'
                            : t(badge?.descKey)}
                    </p>

                    <button
                        onClick={() => setLastUnlocked(null)}
                        className="px-10 py-3 rounded-full bg-gold text-obsidian text-xs font-black uppercase tracking-widest shadow-xl gold-glow hover:scale-105 active:scale-95 transition-all"
                    >
                        Accept Honor
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default LevelUpOverlay;
