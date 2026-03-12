import React from 'react';
import { motion } from 'framer-motion';
import { useHabits } from '../context/HabitContext';
import { Settings, Bell, Download, Trash2, Globe, Heart } from 'lucide-react';

const Profile = () => {
    const { t, lang, changeLang } = useHabits();

    const handleReset = () => {
        if (confirm(t('reset_confirm'))) {
            localStorage.clear();
            window.location.reload();
        }
    };

    return (
        <div className="space-y-8 pb-32">
            <header className="flex flex-col items-center py-8">
                <div className="w-24 h-24 bg-gradient-to-tr from-airbnb to-orange-400 rounded-full flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-airbnb/30 mb-4">
                    D
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight">DeOs Warrior</h1>
                <p className="text-text-tertiary text-xs font-bold uppercase tracking-[0.3em] mt-1">Level 12 Discipline</p>
            </header>

            {/* Settings Sections */}
            <section className="space-y-4">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-text-tertiary px-1">
                    {t('settings')}
                </h2>

                <div className="glass-card divide-y divide-white/5 p-0 overflow-hidden">
                    <div className="flex items-center gap-4 p-5">
                        <Globe size={20} className="text-airbnb" />
                        <span className="flex-1 font-bold text-sm text-white">{t('language')}</span>
                        <div className="flex bg-white/5 rounded-xl p-1">
                            <button
                                onClick={() => changeLang('fr')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${lang === 'fr' ? 'bg-airbnb text-white shadow-lg' : 'text-text-tertiary'}`}
                            >
                                FR
                            </button>
                            <button
                                onClick={() => changeLang('en')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${lang === 'en' ? 'bg-airbnb text-white shadow-lg' : 'text-text-tertiary'}`}
                            >
                                EN
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-5">
                        <Bell size={20} className="text-sky-400" />
                        <span className="flex-1 font-bold text-sm text-white">{t('notifications')}</span>
                        <div className="w-12 h-6 bg-green-500 rounded-full relative">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                        </div>
                    </div>
                </div>

                <div className="glass-card divide-y divide-white/5 p-0 overflow-hidden">
                    <button className="w-full flex items-center gap-4 p-5 hover:bg-white/5 transition-colors">
                        <Download size={20} className="text-purple-400" />
                        <span className="flex-1 font-bold text-sm text-white text-left">{t('export')}</span>
                    </button>
                    <button
                        onClick={handleReset}
                        className="w-full flex items-center gap-4 p-5 hover:bg-red-500/10 transition-colors group"
                    >
                        <Trash2 size={20} className="text-red-500" />
                        <span className="flex-1 font-bold text-sm text-red-500 text-left">{t('reset')}</span>
                    </button>
                </div>
            </section>

            {/* About */}
            <footer className="text-center space-y-4 pt-10">
                <div className="flex items-center justify-center gap-2 text-text-tertiary text-[10px] font-black uppercase tracking-widest">
                    Made with <Heart size={12} className="text-airbnb fill-airbnb" /> by Antigravity
                </div>
                <p className="text-[10px] font-bold text-text-tertiary opacity-40 uppercase tracking-widest">
                    DeOs Discipline v4.0.0
                </p>
            </footer>
        </div>
    );
};

export default Profile;
