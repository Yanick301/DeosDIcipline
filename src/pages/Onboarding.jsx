import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHabits } from '../context/HabitContext';
import { Globe, Bell, ChevronRight, Check } from 'lucide-react';

const Onboarding = () => {
    const { changeLang, lang, t, finishOnboarding } = useHabits();
    const [step, setStep] = useState(1);

    const variants = {
        enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (direction) => ({ x: direction < 0 ? 300 : -300, opacity: 0 })
    };

    return (
        <div className="fixed inset-0 bg-surface-100 flex flex-col items-center justify-center p-6 text-center">
            <AnimatePresence mode="wait" custom={step}>
                {step === 1 && (
                    <motion.div
                        key="step1"
                        custom={1}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="space-y-8 w-full max-w-sm"
                    >
                        <div className="flex justify-center">
                            <div className="w-20 h-20 bg-airbnb/10 rounded-[28px] flex items-center justify-center text-airbnb shadow-inner shadow-airbnb/20">
                                <Globe size={40} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-black text-white">{t('onboard_lang')}</h1>
                            <p className="text-text-secondary">{t('splash_subtitle')}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { id: 'fr', label: 'Français' },
                                { id: 'en', label: 'English' }
                            ].map((l) => (
                                <button
                                    key={l.id}
                                    onClick={() => changeLang(l.id)}
                                    className={`p-6 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center gap-3 ${lang === l.id ? 'border-airbnb bg-airbnb/5 text-white' : 'border-white/5 bg-surface-200 text-text-tertiary'}`}
                                >
                                    <span className="text-lg font-bold">{l.label}</span>
                                    {lang === l.id && <Check size={20} className="text-airbnb" />}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setStep(2)}
                            className="w-full h-16 bg-white text-black rounded-3xl font-black text-lg flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all"
                        >
                            {t('onboard_next')} <ChevronRight size={20} />
                        </button>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        custom={1}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="space-y-8 w-full max-w-sm"
                    >
                        <div className="flex justify-center">
                            <div className="w-20 h-20 bg-airbnb/10 rounded-[28px] flex items-center justify-center text-airbnb">
                                <Bell size={40} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-black text-white">{t('onboard_notif_title')}</h1>
                            <p className="text-text-secondary leading-relaxed">
                                {t('onboard_notif_body')}
                            </p>
                        </div>
                        <div className="space-y-3">
                            <button
                                onClick={finishOnboarding}
                                className="w-full h-16 bg-airbnb text-white rounded-3xl font-black text-lg flex items-center justify-center shadow-lg shadow-airbnb/20"
                            >
                                {t('onboard_notif_btn')}
                            </button>
                            <button
                                onClick={finishOnboarding}
                                className="w-full h-12 bg-transparent text-text-tertiary rounded-3xl font-bold"
                            >
                                {t('onboard_notif_skip')}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Onboarding;
