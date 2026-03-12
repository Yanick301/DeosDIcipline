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
            <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-[420px] h-20 bg-surface-200/90 backdrop-blur-2xl border border-white/5 rounded-[32px] flex items-center justify-between px-4 z-50 shadow-2xl shadow-black/50">
                {tabs.map((tab) => {
                    if (tab.isFab) {
                        return (
                            <div key="add-fab" className="relative -top-8 px-1">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setActiveTab('add')}
                                    className="w-14 h-14 bg-airbnb rounded-full flex items-center justify-center shadow-lg shadow-airbnb/30 text-white"
                                >
                                    <Plus size={28} strokeWidth={3} />
                                </motion.button>
                            </div>
                        );
                    }

                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-col items-center justify-center min-w-[40px] transition-all duration-300 ${isActive ? 'text-airbnb' : 'text-text-tertiary'}`}
                        >
                            <motion.div
                                animate={isActive ? { y: -2, scale: 1.1 } : { y: 0, scale: 1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                className="relative"
                            >
                                <tab.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                                {isActive && (
                                    <motion.div
                                        layoutId="tab-dot"
                                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-airbnb rounded-full"
                                    />
                                )}
                            </motion.div>
                            <span className={`text-[8px] font-black tracking-tight uppercase leading-none mt-1 transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0 scale-75 h-0'}`}>
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
