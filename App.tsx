import React, { useState, useEffect } from 'react';
import { UserData, AppStatus } from './types';
import WelcomeScreen from './components/WelcomeScreen';
import GameScreen from './components/GameScreen';
import IdentityCard from './components/IdentityCard';
import AudioPlayer from './components/AudioPlayer';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.WELCOME);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [level, setLevel] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Load progress from local storage on mount
    const savedLevel = localStorage.getItem('riddle_app_level');
    const savedUser = localStorage.getItem('riddle_app_user');
    
    if (savedLevel) setLevel(parseInt(savedLevel, 10));
    if (savedUser) {
      setUserData(JSON.parse(savedUser));
      // If user exists, we can technically skip welcome, but let's show welcome for audio consent flow
      // Or simply populate fields. For this specific request, "every time entered find different questions",
      // we might want to keep level but maybe not skip the welcome screen completely to re-affirm identity.
      // However, to make it seamless:
      // setStatus(AppStatus.WELCOME); 
    }
  }, []);

  const handleStart = (data: UserData) => {
    setUserData(data);
    localStorage.setItem('riddle_app_user', JSON.stringify(data));
    setIsPlaying(true); // User interacted, start music
    setStatus(AppStatus.PLAYING);
    
    // Check if they already finished
    if (level > 100) {
      setStatus(AppStatus.VICTORY);
    }
  };

  const handleLevelComplete = () => {
    const nextLevel = level + 1;
    setLevel(nextLevel);
    localStorage.setItem('riddle_app_level', nextLevel.toString());

    if (nextLevel > 100) {
      setStatus(AppStatus.VICTORY);
    } else {
      // Force re-render of GameScreen to fetch new riddle? 
      // React key prop on GameScreen handles this.
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-black text-white flex flex-col relative overflow-hidden">
      {/* Persistent Audio */}
      <AudioPlayer isPlaying={isPlaying} />

      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-900/10 rounded-full blur-[100px]"></div>
        <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      </div>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center justify-center w-full z-10 py-10">
        
        {status === AppStatus.WELCOME && (
          <WelcomeScreen onStart={handleStart} />
        )}

        {status === AppStatus.PLAYING && (
          <GameScreen 
            key={level} // Changing key forces component remount -> new fetch
            level={level} 
            onLevelComplete={handleLevelComplete} 
          />
        )}

        {status === AppStatus.VICTORY && userData && (
          <div className="text-center animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-600 mb-8 font-kufi">
              مبروك! لقد أتممت التحدي
            </h1>
            <IdentityCard userData={userData} />
            <button 
               onClick={() => {
                 localStorage.removeItem('riddle_app_level');
                 setLevel(1);
                 setStatus(AppStatus.PLAYING);
               }}
               className="mt-12 text-gray-500 hover:text-white underline text-sm"
            >
               إعادة التحدي من البداية
            </button>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full text-center p-4 text-gray-600 text-xs z-10 font-mono">
        &copy; {new Date().getFullYear()} RIDDLE MASTER AI
      </footer>
    </div>
  );
};

export default App;