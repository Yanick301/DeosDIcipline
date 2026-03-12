import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, BarChart2, Award, User, Plus } from 'lucide-react';
import { useHabits } from '../context/HabitContext';

const Layout = ({ children, activeTab, setActiveTab }) => {
    const { t } = useHabits();

    const tabs = [
        { id: 'home', icon: Home, label: t('home') },
        { id: 'stats', icon: BarChart2, label: t('stats') },
        { id: 'add', icon: Plus, isFab: true },
        { id: 'awards', icon: Award, label: t('awards') },
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
            <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-[400px] h-20 bg-surface-200/80 backdrop-blur-2xl border border-white/5 rounded-[32px] flex items-center justify-around px-2 z-50 shadow-2xl shadow-black/50">
                {tabs.map((tab) => {
                    if (tab.isFab) {
                        return (
                            <div key="add-fab" className="relative -top-8">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setActiveTab('add')}
                                    className="w-16 h-16 bg-airbnb rounded-full flex items-center justify-center shadow-lg shadow-airbnb/30 text-white"
                                >
                                    <Plus size={32} strokeWidth={2.5} />
                                </motion.button>
                            </div>
                        );
                    }

                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-col items-center gap-1 transition-colors duration-300 ${isActive ? 'text-airbnb' : 'text-text-tertiary'}`}
                        >
                            <motion.div
                                animate={isActive ? { y: -2, scale: 1.1 } : { y: 0, scale: 1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                <tab.icon size={24} strokeWidth={isActive ? 2.2 : 1.8} />
                            </motion.div>
                            <span className="text-[10px] font-bold tracking-tight uppercase leading-none">
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
