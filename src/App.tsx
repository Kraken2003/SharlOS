import React, { useState } from 'react';
import Matrix from './components/Matrix';
import Terminal from './components/Terminal';
import NonDeveloperPage from './components/NonDeveloperPage';

type Screen = 'matrix' | 'terminal' | 'non-developer';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('matrix');

  const handlePillChoice = (pill: 'red' | 'blue') => {
    if (pill === 'red') {
      setCurrentScreen('terminal');
    } else {
      setCurrentScreen('non-developer');
    }
  };

  switch (currentScreen) {
    case 'matrix':
      return <Matrix onPillChoice={handlePillChoice} />;
    case 'terminal':
      return <Terminal />;
    case 'non-developer':
      return <NonDeveloperPage />;
    default:
      return <Matrix onPillChoice={handlePillChoice} />;
  }
}