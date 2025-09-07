import React, { useState, useEffect } from 'react';
import Matrix from './components/Matrix';
import Terminal from './components/Terminal';
import CyberpunkProfile from './components/CyberpunkProfile';

type Screen = 'matrix' | 'terminal' | 'cyberpunk';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('matrix');

  // Handle URL routing
  useEffect(() => {
    const path = window.location.pathname;
    
    if (path === '/redpill' || path === '/SharlOS/redpill') {
      setCurrentScreen('terminal');
    } else if (path === '/bluepill' || path === '/SharlOS/bluepill') {
      setCurrentScreen('cyberpunk');
    } else {
      setCurrentScreen('matrix');
    }
  }, []);

  // Update URL when screen changes
  useEffect(() => {
    const path = window.location.pathname;
    // Detect if we're on GitHub Pages by checking if path starts with /SharlOS/
    const basePath = path.startsWith('/SharlOS/') ? '/SharlOS' : '';
    
    if (currentScreen === 'terminal' && !path.includes('/redpill')) {
      window.history.pushState({}, '', `${basePath}/redpill`);
    } else if (currentScreen === 'cyberpunk' && !path.includes('/bluepill')) {
      window.history.pushState({}, '', `${basePath}/bluepill`);
    } else if (currentScreen === 'matrix' && path !== basePath && path !== '/') {
      window.history.pushState({}, '', basePath || '/');
    }
  }, [currentScreen]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      
      if (path === '/redpill' || path === '/SharlOS/redpill') {
        setCurrentScreen('terminal');
      } else if (path === '/bluepill' || path === '/SharlOS/bluepill') {
        setCurrentScreen('cyberpunk');
      } else {
        setCurrentScreen('matrix');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handlePillChoice = (pill: 'red' | 'blue') => {
    if (pill === 'red') {
      setCurrentScreen('terminal');
    } else {
      setCurrentScreen('cyberpunk');
    }
  };

  const handleBack = () => {
    setCurrentScreen('matrix');
  };

  switch (currentScreen) {
    case 'matrix':
      return <Matrix onPillChoice={handlePillChoice} />;
    case 'terminal':
      return <Terminal onBack={handleBack} />;
    case 'cyberpunk':
      return <CyberpunkProfile onBack={handleBack} />;
    default:
      return <Matrix onPillChoice={handlePillChoice} />;
  }
}