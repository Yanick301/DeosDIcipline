import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Leaf, CloudRain, Wind } from 'lucide-react';
import { SoundService } from '../services/SoundService';

const MODES = {
    FOCUS: { label: 'Focus', time: 25 * 60, color: 'var(--color-gold)' },
    SHORT: { label: 'Short Break', time: 5 * 60, color: '#30D158' },
    LONG: { label: 'Long Break', time: 15 * 60, color: '#0A84FF' }
};

const SOUNDS = [
    { id: 'none', icon: VolumeX, label: 'Silence' },
    { id: 'rain', icon: CloudRain, label: 'Rain' },
    { id: 'forest', icon: Leaf, label: 'Forest' },
    { id: 'wind', icon: Wind, label: 'Wind' }
];

const FocusTimer = () => {
    const [mode, setMode] = useState('FOCUS');
    const [timeLeft, setTimeLeft] = useState(MODES.FOCUS.time);
    const [isActive, setIsActive] = useState(false);
    const [sound, setSound] = useState('none');

    useEffect(() => {
        if (isActive && sound !== 'none') {
            SoundService.play(sound);
        } else {
            SoundService.stop();
        }
        return () => SoundService.stop();
    }, [isActive, sound]);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            // Notification or Sound
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(MODES[mode].time);
    };

    const handleModeChange = (newMode) => {
        setMode(newMode);
        setIsActive(false);
        setTimeLeft(MODES[newMode].time);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = (timeLeft / MODES[mode].time) * 100;

    return (
        <div className="flex flex-col items-center justify-center space-y-12 py-10">
            {/* Header / Mode Switcher */}
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                {Object.keys(MODES).map((m) => (
                    <button
                        key={m}
                        onClick={() => handleModeChange(m)}
                        className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === m ? 'bg-gold text-obsidian shadow-lg gold-glow' : 'text-text-tertiary'
                            }`}
                    >
                        {MODES[m].label}
                    </button>
                ))}
            </div>

            {/* Main Timer Display */}
            <div className="relative w-72 h-72 flex items-center justify-center">
                {/* Background Ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                        cx="144"
                        cy="144"
                        r="130"
                        className="stroke-white/5 fill-none"
                        strokeWidth="8"
                    />
                    <motion.circle
                        cx="144"
                        cy="144"
                        r="130"
                        className="fill-none"
                        style={{ stroke: MODES[mode].color }}
                        strokeWidth="8"
                        strokeLinecap="round"
                        initial={{ strokeDasharray: "816.8", strokeDashoffset: "0" }}
                        animate={{ strokeDashoffset: `${816.8 * (1 - progress / 100)}` }}
                        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
                    />
                </svg>

                {/* Inner Glow/Shadow Area */}
                <div className="w-60 h-60 rounded-full glass-premium flex flex-col items-center justify-center gold-glow border-gold/10">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={timeLeft}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-6xl font-black text-white tracking-tighter"
                        >
                            {formatTime(timeLeft)}
                        </motion.span>
                    </AnimatePresence>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gold/60 mt-2">
                        {isActive ? 'Deep Focus' : 'Ready'}
                    </span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-8">
                <button
                    onClick={resetTimer}
                    className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-text-tertiary hover:text-white transition-colors"
                >
                    <RotateCcw size={24} />
                </button>

                <button
                    onClick={toggleTimer}
                    className="w-20 h-20 rounded-[28px] bg-gold flex items-center justify-center text-obsidian shadow-2xl gold-glow hover:scale-105 active:scale-95 transition-all"
                >
                    {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                </button>

                <div className="relative group">
                    <button className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-text-tertiary">
                        <Volume2 size={24} />
                    </button>

                    {/* Sound Selector Tooltip-style */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                        <div className="glass-premium p-2 rounded-2xl flex gap-2 border-gold/20">
                            {SOUNDS.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => setSound(s.id)}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${sound === s.id ? 'bg-gold text-obsidian' : 'text-text-tertiary hover:bg-white/5'
                                        }`}
                                >
                                    <s.icon size={18} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quote / Motivation */}
            <p className="max-w-[240px] text-center text-xs font-medium text-text-tertiary italic leading-relaxed">
                "Small steps in the right direction can turn out to be the biggest steps of your life."
            </p>
        </div>
    );
};

export default FocusTimer;
