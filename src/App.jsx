import React, { useState } from 'react';
import { HabitProvider, useHabits } from './context/HabitContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Stats from './pages/Stats';
import Awards from './pages/Awards';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding';
import AddHabit from './pages/AddHabit';
import Community from './pages/Community';
import Programs from './pages/Programs';
import Journal from './pages/Journal';
import FocusTimer from './components/FocusTimer';
import LevelUpOverlay from './components/LevelUpOverlay';
import './index.css';

const AppContent = () => {
  const { onboardDone, habits } = useHabits();
  const [activeTab, setActiveTab] = useState('home');
  const [editingHabitId, setEditingHabitId] = useState(null);

  if (!onboardDone) return <Onboarding />;

  const handleNav = (tab, habitId = null) => {
    setEditingHabitId(habitId);
    setActiveTab(tab);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'home': return <Home onEdit={(id) => handleNav('add', id)} />;
      case 'stats': return <Stats />;
      case 'timer': return <FocusTimer />;
      case 'journal': return <Journal />;
      case 'community': return <Community />;
      case 'programs': return <Programs />;
      case 'awards': return <Awards />;
      case 'profile': return <Profile />;
      case 'add':
        return <AddHabit
          onDone={() => handleNav('home')}
          editingHabit={habits.find(h => h.id === editingHabitId)}
        />;
      default: return <Home />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={(tab) => handleNav(tab)}>
      <div className="page-transition">
        {renderScreen()}
      </div>
    </Layout>
  );
};

function App() {
  return (
    <HabitProvider>
      <LevelUpOverlay />
      <AppContent />
    </HabitProvider>
  );
}

export default App;
