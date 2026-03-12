import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, BarChart2, Award, User, Plus, Users, Zap, Book } from 'lucide-react';
import { useHabits } from '../context/HabitContext';

const Layout = ({ children, activeTab, setActiveTab }) => {
    const { t } = useHabits();

    const tabs = [
        { id: 'home', icon: Home, label: t('home') },
        { id: 'stats', icon: BarChart2, label: t('stats') },
        { id: 'community', icon: Users, label: t('community') },
        { id: 'add', icon: Plus, isFab: true },
        { id: 'programs', icon: Zap, label: t('programs') },
        { id: 'journal', icon: Book, label: t('journal') },
        { id: 'profile', icon: User, label: t('profile') },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-surface-100 text-white font-sans selection:bg-airbnb/30">
            <main className="flex-1 pb-24 max-w-md mx-auto w-full px-4 pt-12">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Floating Tab Bar */}
            <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-[420px] h-20 bg-surface-200/40 backdrop-blur-3xl border border-white/10 rounded-[32px] flex items-center justify-between px-4 z-50 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                {tabs.map((tab) => {
                    if (tab.isFab) {
                        return (
                            <div key="add-fab" className="relative -top-8 px-1">
                                <motion.button
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setActiveTab('add')}
                                    className="w-16 h-16 bg-airbnb rounded-full flex items-center justify-center shadow-[0_10px_25px_rgba(255,56,92,0.4)] text-white border-4 border-surface-100"
                                >
                                    <Plus size={32} strokeWidth={3} />
                                </motion.button>
                            </div>
                        );
                    }

                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-col items-center justify-center min-w-[44px] h-full relative transition-all duration-500`}
                        >
                            <motion.div
                                animate={isActive ? { y: -4 } : { y: 0 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                className={`relative p-2 rounded-2xl transition-colors ${isActive ? 'bg-airbnb/10 text-airbnb' : 'text-text-tertiary hover:text-white/40'}`}
                            >
                                <tab.icon
                                    size={20}
                                    strokeWidth={isActive ? 2.5 : 2}
                                    className="transition-all duration-300"
                                />
                                {isActive && (
                                    <motion.div
                                        layoutId="tab-pill"
                                        className="absolute inset-0 bg-airbnb/5 rounded-2xl -z-10"
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </motion.div>
                            <span className={`absolute bottom-2 text-[7px] font-black tracking-[0.15em] uppercase transition-all duration-500 ${isActive ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-75'}`}>
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default Layout;
