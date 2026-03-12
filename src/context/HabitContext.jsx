import React, { createContext, useContext, useState, useEffect } from 'react';
import { DB } from '../lib/db';
import { TRANSLATIONS } from '../lib/i18n';

const HabitContext = createContext();

export const HabitProvider = ({ children }) => {
    const [habits, setHabits] = useState([]);
    const [completions, setCompletions] = useState({});
    const [settings, setSettings] = useState({});
    const [lang, setLang] = useState('en');
    const [onboardDone, setOnboardDone] = useState(false);
    const [xp, setXp] = useState(0);
    const [level, setLevel] = useState(1);

    useEffect(() => {
        setHabits(DB.getHabits());
        setCompletions(DB.getCompletions());
        const s = DB.getSettings();
        setSettings(s);
        setLang(s.lang || 'en');
        setOnboardDone(DB.getOnboardDone());
        setXp(DB.get('deos_xp', 0));
        setLevel(DB.get('deos_level', 1));
    }, []);

    const t = (key, ...replacements) => {
        let str = TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS['en']?.[key] ?? key;
        replacements.forEach(r => { str = str.replace('%s', r); });
        return str;
    };

    const awardXp = (amount) => {
        const newXp = xp + amount;
        setXp(newXp);
        DB.set('deos_xp', newXp);

        // Simple level logic: 1000 XP per level
        const newLevel = Math.floor(newXp / 1000) + 1;
        if (newLevel > level) {
            setLevel(newLevel);
            DB.set('deos_level', newLevel);
            // Could trigger a level up animation/modal here
        }
    };

    const updateHabits = (newHabits) => {
        setHabits(newHabits);
        DB.saveHabits(newHabits);
    };

    const addHabit = (habit) => {
        const newHabits = [...habits, { ...habit, id: `h_${Date.now()}`, createdAt: Date.now() }];
        updateHabits(newHabits);
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
            habits, updateHabits, addHabit,
            completions, toggleCompletion,
            settings, lang, changeLang, t,
            onboardDone, finishOnboarding,
            xp, level
        }}>
            {children}
        </HabitContext.Provider>
    );
};

export const useHabits = () => useContext(HabitContext);
