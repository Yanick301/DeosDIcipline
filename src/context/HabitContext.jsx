import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DB } from '../lib/db';
import { TRANSLATIONS } from '../lib/i18n';
import { NotificationService } from '../services/NotificationService';

const HabitContext = createContext();

export const HabitProvider = ({ children }) => {
    const [habits, setHabits] = useState([]);
    const [completions, setCompletions] = useState({});
    const [settings, setSettings] = useState({});
    const [lang, setLang] = useState('en');
    const [onboardDone, setOnboardDone] = useState(false);
    const [xp, setXp] = useState(0);
    const [level, setLevel] = useState(1);
    const [userId, setUserId] = useState('');
    const [unlockedBadges, setUnlockedBadges] = useState([]);

    useEffect(() => {
        // Forced reset check (Version 5)
        const hasReset = localStorage.getItem('deos_v5_force_reset');
        if (!hasReset) {
            DB.clearAll();
            localStorage.setItem('deos_v5_force_reset', 'true');
            window.location.reload();
            return;
        }

        const id = DB.ensureUserId() || `Warrior-${Math.floor(Math.random() * 8999) + 1000}`;
        setUserId(id);
        setHabits(DB.getHabits());
        setCompletions(DB.getCompletions());
        const s = DB.getSettings();
        setSettings(s);
        setLang(s.lang || 'en');
        setOnboardDone(DB.getOnboardDone());
        setXp(DB.get('deos_xp', 0));
        setLevel(DB.get('deos_level', 1));
        setUnlockedBadges(DB.getUnlockedBadges());
    }, []);

    const t = useCallback((key, ...replacements) => {
        let str = TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS['en']?.[key] ?? key;
        replacements.forEach(r => { str = str.replace('%s', r); });
        return str;
    }, [lang]);

    useEffect(() => {
        // Notification loop - check every 60 seconds
        const interval = setInterval(() => {
            NotificationService.checkReminders(habits, completions, t);
        }, 60000);

        return () => clearInterval(interval);
    }, [habits, completions, t]);

    const awardXp = (amount) => {
        const newXp = (xp || 0) + amount;
        setXp(newXp);
        DB.set('deos_xp', newXp);

        // Simple level logic: 1000 XP per level
        const newLevel = Math.floor(newXp / 1000) + 1;
        if (newLevel > level) {
            setLevel(newLevel);
            DB.set('deos_level', newLevel);
        }

        checkBadges(newXp, completions);
    };

    const checkBadges = (currentXp, currentComps) => {
        const newlyUnlocked = [];
        const currentBadgeIds = new Set(unlockedBadges);

        // 1. XP Milestones
        if (currentXp >= 1000 && !currentBadgeIds.has('xp_1000')) newlyUnlocked.push('xp_1000');
        if (currentXp >= 5000 && !currentBadgeIds.has('xp_5000')) newlyUnlocked.push('xp_5000');

        // 2. Completion Milestones
        const totalDone = Object.values(currentComps || {}).reduce((acc, h) => {
            if (!h || typeof h !== 'object') return acc;
            return acc + Object.values(h).filter(v => v === 'done').length;
        }, 0);
        if (totalDone >= 1 && !currentBadgeIds.has('first_step')) newlyUnlocked.push('first_step');
        if (totalDone >= 10 && !currentBadgeIds.has('consistent')) newlyUnlocked.push('consistent');
        if (totalDone >= 100 && !currentBadgeIds.has('discipline_master')) newlyUnlocked.push('discipline_master');

        if (newlyUnlocked.length > 0) {
            const updated = [...unlockedBadges, ...newlyUnlocked];
            setUnlockedBadges(updated);
            DB.saveUnlockedBadges(updated);

            // Award bonus XP for badges: 500 XP per badge
            const bonusXp = newlyUnlocked.length * 500;
            const finalXp = currentXp + bonusXp;
            setXp(finalXp);
            DB.set('deos_xp', finalXp);
        }
    };

    const calculateMasterStreak = () => {
        const allDates = new Set();
        Object.values(completions || {}).forEach(hComps => {
            if (!hComps || typeof hComps !== 'object') return;
            Object.keys(hComps).forEach(date => {
                if (hComps[date] === 'done') allDates.add(date);
            });
        });

        const sortedDates = Array.from(allDates).sort().reverse();
        if (sortedDates.length === 0) return 0;

        let streak = 0;
        let curr = new Date();
        curr.setHours(0, 0, 0, 0);

        // Check if today or yesterday was the last completion to maintain streak
        const todayStr = curr.toISOString().split('T')[0];
        const yesterday = new Date(curr);
        yesterday.setDate(curr.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (!allDates.has(todayStr) && !allDates.has(yesterdayStr)) return 0;

        let checkDate = allDates.has(todayStr) ? curr : yesterday;

        while (true) {
            const ds = checkDate.toISOString().split('T')[0];
            if (allDates.has(ds)) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }
        return streak;
    };

    const calculateHabitStreak = (habitId) => {
        const hComps = completions[habitId] || {};
        const allDates = Object.keys(hComps).filter(d => hComps[d] === 'done').sort().reverse();
        if (allDates.length === 0) return 0;

        let streak = 0;
        let curr = new Date();
        curr.setHours(0, 0, 0, 0);

        const todayStr = curr.toISOString().split('T')[0];
        const yesterday = new Date(curr);
        yesterday.setDate(curr.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (!hComps[todayStr] && !hComps[yesterdayStr]) return 0;

        let checkDate = hComps[todayStr] ? curr : yesterday;

        while (true) {
            const ds = checkDate.toISOString().split('T')[0];
            if (hComps[ds] === 'done') {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }
        return streak;
    };

    const updateHabits = (newHabits) => {
        setHabits(newHabits);
        DB.saveHabits(newHabits);
    };

    const addHabit = (habit) => {
        const newHabits = [...habits, { ...habit, id: `h_${Date.now()}`, createdAt: Date.now() }];
        updateHabits(newHabits);
    };

    const updateHabit = (id, updated) => {
        const newHabits = habits.map(h => h.id === id ? { ...h, ...updated } : h);
        updateHabits(newHabits);
    };

    const deleteHabit = (id) => {
        const newHabits = habits.filter(h => h.id !== id);
        updateHabits(newHabits);

        // Also clean up completions
        const newComps = { ...completions };
        delete newComps[id];
        setCompletions(newComps);
        DB.saveCompletions(newComps);
    };

    const toggleCompletion = (habitId, dateStr, status) => {
        const newComps = { ...completions };
        if (!newComps[habitId]) newComps[habitId] = {};

        const isCompleting = newComps[habitId][dateStr] !== 'done' && status === 'done';

        if (newComps[habitId][dateStr] === status) {
            delete newComps[habitId][dateStr];
        } else {
            newComps[habitId][dateStr] = status;
        }

        if (isCompleting) {
            awardXp(50); // 50 XP per completion
        }

        setCompletions(newComps);
        DB.saveCompletions(newComps);
    };

    const changeLang = (l) => {
        setLang(l);
        const newSettings = { ...settings, lang: l };
        setSettings(newSettings);
        DB.saveSettings(newSettings);
    };

    const finishOnboarding = () => {
        setOnboardDone(true);
        DB.setOnboardDone(true);
    };

    return (
        <HabitContext.Provider value={{
            habits, updateHabits, addHabit, updateHabit, deleteHabit,
            completions, toggleCompletion, calculateMasterStreak, calculateHabitStreak,
            settings, lang, changeLang, t,
            onboardDone, finishOnboarding,
            xp, level, userId, unlockedBadges
        }}>
            {children}
        </HabitContext.Provider>
    );
};

export const useHabits = () => useContext(HabitContext);
