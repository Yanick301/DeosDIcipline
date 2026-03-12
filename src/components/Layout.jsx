import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, BarChart2, Award, User, Plus, Users, Timer, Book } from 'lucide-react';
import { useHabits } from '../context/HabitContext';

// Simple media query hook
const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(false);
    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) setMatches(media.matches);
        const listener = () => setMatches(media.matches);
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, [matches, query]);
    return matches;
};

const Layout = ({ children, activeTab, setActiveTab }) => {
    const { t } = useHabits();
    const mdAndUp = useMediaQuery('(min-width: 768px)');

    const tabs = [
        { id: 'home', icon: Home, label: t('home') },
        { id: 'timer', icon: Timer, label: t('timer_nav') || 'Focus' },
        { id: 'stats', icon: BarChart2, label: t('stats') },
        { id: 'add', icon: Plus, isFab: true },
        { id: 'community', icon: Users, label: t('community') },
        { id: 'journal', icon: Book, label: t('journal') },
        { id: 'profile', icon: User, label: t('profile') },
    ];

    return (
        <div className="flex min-h-screen bg-surface-100 text-white font-sans selection:bg-airbnb/30 relative overflow-hidden">
            {/* Magnificent Background Effects */}
            <div className="bg-noise" />
            <div className="ambient-glow" />
            <div className="fixed top-0 left-0 w-full h-32 bg-gradient-to-b from-obsidian to-transparent pointer-events-none z-10 opacity-60" />

            {/* Main Content Area */}
            <main className="flex-1 pb-40 md:pl-28 lg:pl-64 max-w-7xl mx-auto w-full px-6 pt-16 relative z-10 transition-all duration-300">
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

            {/* Responsive Navigation */}
            <nav className="
                fixed z-50 transition-all duration-500
                /* Mobile: Bottom Bar */
                bottom-6 left-1/2 -translate-x-1/2 w-[96%] max-w-[600px] h-20 
                flex flex-row items-center justify-between px-3 
                bg-surface-200/40 backdrop-blur-3xl border border-white/10 rounded-[32px] 
                shadow-[0_20px_50px_rgba(0,0,0,0.5)]
                
                /* Desktop: Left Sidebar */
                md:top-0 md:left-0 md:bottom-auto md:translate-x-0 md:w-24 md:h-screen md:rounded-none md:border-t-0 md:border-l-0 md:border-b-0 md:border-r 
                md:flex-col md:justify-center md:py-10 md:space-y-6 md:bg-surface-200/60
                
                /* Large Desktop: Expanded Sidebar */
                lg:w-64 lg:items-start lg:pl-8
            ">

                {/* Desktop Logo Space */}
                <div className="hidden lg:block absolute top-10 left-8">
                    <h2 className="text-xl font-light text-white tracking-tight flex flex-col">
                        <span className="text-white/40 text-[10px] uppercase tracking-widest font-medium mb-1">System</span>
                        <div className="flex items-center gap-1.5 font-medium">
                            <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"></span>
                            DeOs
                        </div>
                    </h2>
                </div>

                {tabs.map((tab) => {
                    if (tab.isFab) {
                        return (
                            <div key="add-fab" className="relative w-14 shrink-0 md:w-full lg:px-4">
                                <motion.button
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveTab('add')}
                                    className="
                                        w-14 h-14 bg-white/10 backdrop-blur-md rounded-[20px] flex items-center justify-center text-white border border-white/10
                                        /* Mobile positioning */
                                        absolute -top-10 left-1/2 -translate-x-1/2
                                        /* Desktop positioning */
                                        md:static md:w-14 md:h-14 md:mx-auto md:translate-x-0
                                        /* Large Desktop */
                                        lg:w-full lg:rounded-[20px] lg:gap-3 lg:hover:bg-white/15
                                    "
                                >
                                    <Plus size={mdAndUp ? 22 : 24} strokeWidth={2} />
                                    <span className="hidden lg:block font-medium tracking-tight">New Habit</span>
                                </motion.button>
                            </div>
                        );
                    }

                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex flex-col items-center justify-center transition-all duration-300
                                /* Mobile */
                                relative flex-1 h-full
                                /* Desktop */
                                md:w-full md:h-14 md:rounded-2xl
                                /* Large Desktop */
                                lg:flex-row lg:justify-start lg:px-4 lg:gap-4 lg:w-[calc(100%-2rem)]
                                ${isActive ? 'text-white' : 'text-white/40 hover:text-white/80'}
                            `}
                        >
                            {/* Icon Container */}
                            <motion.div
                                animate={{
                                    y: (!mdAndUp && isActive) ? -4 : 0
                                }}
                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                className={`
                                    relative p-2 rounded-2xl transition-colors
                                    ${isActive && mdAndUp ? 'lg:bg-transparent lg:text-white' : ''}
                                `}
                            >
                                <tab.icon
                                    size={mdAndUp ? 22 : 20}
                                    strokeWidth={isActive ? 2 : 1.5}
                                />
                                {isActive && !mdAndUp && (
                                    <motion.div
                                        layoutId="tab-pill"
                                        className="absolute inset-0 bg-white/10 rounded-xl -z-10"
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </motion.div>

                            {/* Label */}
                            <span className={`
                                font-medium tracking-wide capitalize transition-all duration-500
                                /* Mobile Label */
                                absolute bottom-2 text-[8px]
                                ${isActive && !mdAndUp ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-75 md:hidden'}
                                /* Large Desktop Label */
                                lg:static lg:opacity-100 lg:translate-y-0 lg:scale-100 lg:text-[13px]
                            `}>
                                {tab.label}
                            </span>

                            {/* Desktop Active Highlight */}
                            {isActive && mdAndUp && (
                                <motion.div
                                    layoutId="desktop-active"
                                    className="absolute inset-0 bg-airbnb/5 border-l-2 border-airbnb lg:rounded-2xl lg:border-l-0 -z-10"
                                    initial={false}
                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                                />
                            )}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default Layout;
