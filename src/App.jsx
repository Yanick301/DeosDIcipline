import React, { useState } from 'react';
import { HabitProvider, useHabits } from './context/HabitContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Stats from './pages/Stats';
import Awards from './pages/Awards';
import Profile from './pages/Profile';
import Community from './pages/Community';
import Programs from './pages/Programs';
import Journal from './pages/Journal';
import './index.css';

const AppContent = () => {
  const { onboardDone, currentScreen, setScreen } = useHabits();
  const [activeTab, setActiveTab] = useState('home');

  if (!onboardDone) return <Onboarding />;

  const renderScreen = () => {
    switch (activeTab) {
      case 'home': return <Home />;
      case 'stats': return <Stats />;
      case 'journal': return <Journal />;
      case 'community': return <Community />;
      case 'programs': return <Programs />;
      case 'awards': return <Awards />;
      case 'profile': return <Profile />;
      case 'add': return <AddHabit onDone={() => setActiveTab('home')} />;
      default: return <Home />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderScreen()}
    </Layout>
  );
};

function App() {
  return (
    <HabitProvider>
      <AppContent />
    </HabitProvider>
  );
}

export default App;
