import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { LayoutSelection, LAYOUTS } from './components/LayoutSelection';
import { Booth } from './components/Booth';
import { StripResult } from './components/StripResult';
import { AppScreen, LayoutTheme } from './types';

function App() {
  const [screen, setScreen] = useState<AppScreen>('home');
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedLayout, setSelectedLayout] = useState<LayoutTheme>(LAYOUTS[0]);

  const handleStart = () => {
    setScreen('layout');
  };

  const handleLayoutSelect = (layout: LayoutTheme) => {
    setSelectedLayout(layout);
    setScreen('booth');
  };

  const handleCaptureComplete = (capturedPhotos: string[]) => {
    setPhotos(capturedPhotos);
    setScreen('result');
  };

  const handleRetake = () => {
    setPhotos([]);
    setScreen('booth');
  };

  const handleNavigate = (target: AppScreen) => {
      // Confirm if leaving booth
      if (screen === 'booth' && target !== 'booth') {
          if(!window.confirm("Stop taking photos?")) return;
      }
      setScreen(target);
  };

  return (
    <div className="font-sans text-gray-900 selection:bg-pink-200">
      <Navbar onNavigate={handleNavigate} />
      
      <main>
        {screen === 'home' && (
          <Home onStart={handleStart} />
        )}

        {screen === 'layout' && (
          <LayoutSelection 
            onSelect={handleLayoutSelect}
            onBack={() => setScreen('home')}
          />
        )}
        
        {screen === 'booth' && (
          <Booth 
            onCaptureComplete={handleCaptureComplete}
            onCancel={() => setScreen('layout')}
          />
        )}
        
        {screen === 'result' && (
          <StripResult 
            photos={photos} 
            initialTheme={selectedLayout}
            onRetake={handleRetake}
            onHome={() => setScreen('home')}
          />
        )}
      </main>
    </div>
  );
}

export default App;