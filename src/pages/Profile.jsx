import React from 'react';
import { motion } from 'framer-motion';
import { useHabits } from '../context/HabitContext';
import { Settings, LogOut, Shield, Bell, HelpCircle, Heart, Globe, Trash2, Github } from 'lucide-react';
import { NotificationService } from '../services/NotificationService';

const Profile = () => {
    const { t, lang, changeLang, xp, level, userId } = useHabits();

    const nextLevelXp = level * 1000;
    const currentLevelBaseXp = (level - 1) * 1000;
    const progress = ((xp - currentLevelBaseXp) / (nextLevelXp - currentLevelBaseXp)) * 100;

    const handleReset = () => {
        if (confirm(t('reset_confirm'))) {
            localStorage.clear();
            window.location.reload();
        }
    };

    return (
        <div className="space-y-8 pb-32">
            <header className="flex flex-col items-center py-8">
                <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-tr from-airbnb to-orange-400 rounded-full flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-airbnb/30 mb-4">
                        D
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-surface-200 border-4 border-surface-100 rounded-full flex items-center justify-center text-xs font-black text-airbnb">
                        {level}
                    </div>
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight">DeOs Warrior</h1>
                <div className="group relative mt-2">
                    <p className="text-text-tertiary text-[10px] font-black uppercase tracking-[0.3em] bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                        {userId}
                    </p>
                </div>
                <div className="w-full max-w-[200px] mt-4 space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-text-tertiary">
                        <span>{xp} XP</span>
                        <span>{nextLevelXp} XP</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-airbnb shadow-[0_0_10px_rgba(255,56,92,0.5)]"
                        />
                    </div>
                </div>
            </header>

            {/* Settings & Security */}
            <section className="space-y-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-tertiary px-2">Settings & Security</h2>
                <div className="grid grid-cols-1 gap-3">
                    <button
                        onClick={async () => {
                            const granted = await NotificationService.requestPermission();
                            if (granted) alert('Notifications Enabled! 🔱');
                        }}
                        className="glass-premium p-5 flex items-center justify-between group hover:border-gold/30 transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center">
                                <Bell size={20} />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold text-white">Enable Notifications</p>
                                <p className="text-[10px] text-text-tertiary uppercase tracking-widest">Get daily habit alarms</p>
                            </div>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                    </button>

                    {[
                        { icon: Shield, label: 'Privacy Policy', sub: 'How we guard your data' },
                        { icon: HelpCircle, label: 'Support & FAQ', sub: 'Get help with your journey' }
                    ].map((item, i) => (
                        <button key={i} className="glass-premium p-5 flex items-center gap-4 group hover:border-white/20 transition-all">
                            <div className="w-10 h-10 rounded-xl bg-white/5 text-text-tertiary flex items-center justify-center">
                                <item.icon size={20} />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold text-white">{item.label}</p>
                                <p className="text-[10px] text-text-tertiary uppercase tracking-widest">{item.sub}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

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
                    Made with <Heart size={12} className="text-airbnb fill-airbnb" /> by DeOs
                </div>
                <p className="text-[10px] font-bold text-text-tertiary opacity-40 uppercase tracking-widest">
                    DeOs Discipline v4.0.0
                </p>
            </footer>
        </div>
    );
};

export default Profile;
