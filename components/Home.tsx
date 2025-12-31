import React, { useEffect, useState } from 'react';
import { Camera, Star, Sparkles, Heart } from 'lucide-react';

interface HomeProps {
  onStart: () => void;
}

export const Home: React.FC<HomeProps> = ({ onStart }) => {
  const [mounted, setMounted] = useState(false);
  // Countdown stopped at 0
  const [timeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 relative flex flex-col items-center">
      
      {/* Top Banner */}
      <div className="fixed top-0 left-0 right-0 bg-love-red text-white text-[10px] md:text-xs py-1.5 text-center font-bold z-40">
        Do not forget share your photos with me! 😉
      </div>

      {/* Countdown Card */}
      <div className={`bg-white rounded-[2rem] p-6 shadow-xl border border-pink-100 max-w-lg w-full mb-12 transform transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} relative overflow-hidden`}>
         <div className="absolute top-0 right-0 bg-love-red text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">FOR LOVE</div>
         <div className="flex items-center justify-between">
             <div className="bg-red-50 p-4 rounded-full">
                 <Star className="text-love-red fill-love-red" size={32} />
             </div>
             <div className="text-center flex-1 px-4">
                 <h3 className="text-love-red font-bold text-xs tracking-widest mb-2">HAPPY NEW YEAR</h3>
                 <div className="flex justify-center gap-4 text-gray-800 font-bold text-2xl">
                     <div className="flex flex-col items-center"><span className="text-love-dark">{String(timeLeft.days).padStart(2, '0')}</span><span className="text-[9px] text-gray-400 font-normal">DAYS</span></div>
                     <span className="text-love-red">:</span>
                     <div className="flex flex-col items-center"><span className="text-love-dark">{String(timeLeft.hours).padStart(2, '0')}</span><span className="text-[9px] text-gray-400 font-normal">HOURS</span></div>
                     <span className="text-love-red">:</span>
                     <div className="flex flex-col items-center"><span className="text-love-dark">{String(timeLeft.minutes).padStart(2, '0')}</span><span className="text-[9px] text-gray-400 font-normal">MINS</span></div>
                     <span className="text-love-red">:</span>
                     <div className="flex flex-col items-center"><span className="text-love-dark">{String(timeLeft.seconds).padStart(2, '0')}</span><span className="text-[9px] text-gray-400 font-normal">SECS</span></div>
                 </div>
                 <p className="text-[10px] text-gray-400 mt-2">Let's make this year magical!</p>
             </div>
         </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl relative">
          
          {/* Left Floating Strip */}
          <div className="hidden md:block transform -rotate-6 animate-float">
             <div className="w-32 bg-white p-2 pb-8 shadow-2xl rounded-sm">
                 <div className="space-y-2">
                     <div className="h-24 bg-gray-200 grayscale rounded-sm bg-[url('https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300')] bg-cover"></div>
                     <div className="h-24 bg-gray-200 grayscale rounded-sm bg-[url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300')] bg-cover"></div>
                     <div className="h-24 bg-gray-200 grayscale rounded-sm bg-[url('https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300')] bg-cover"></div>
                 </div>
                 <div className="mt-4 text-center text-[8px] text-gray-400 font-serif">ADI'S STUDIO</div>
             </div>
          </div>

          {/* Center Text */}
          <div className="text-center z-10 px-4">
              <div className="flex items-center justify-center gap-4 mb-2">
                  <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight leading-tight">Happy New Year</h1>
              </div>
              
              <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white mb-8 max-w-lg mx-auto shadow-sm">
                  <Heart className="w-6 h-6 text-love-red mx-auto mb-2 fill-love-red animate-pulse" />
                  <p className="text-gray-800 font-medium italic leading-relaxed">
                      "To my dearest Aditi, may this new year bring you as much joy, laughter, and beauty as you bring into my life every single day. I love you endlessly!"
                  </p>
              </div>

              <p className="text-gray-500 mb-8 text-sm">
                  Capture the moment, cherish the magic, relive the love.
              </p>

              <button 
                onClick={onStart}
                className="bg-love-red text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl shadow-red-200 hover:scale-105 hover:shadow-2xl transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                  START <Camera size={20} />
              </button>
          </div>

          {/* Right Floating Strip */}
          <div className="hidden md:block transform rotate-6 animate-float-delayed">
             <div className="w-32 bg-white p-2 pb-8 shadow-2xl rounded-sm">
                 <div className="space-y-2">
                     <div className="h-24 bg-gray-200 sepia rounded-sm bg-[url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300')] bg-cover"></div>
                     <div className="h-24 bg-gray-200 sepia rounded-sm bg-[url('https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300')] bg-cover"></div>
                     <div className="h-24 bg-gray-200 sepia rounded-sm bg-[url('https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=300')] bg-cover"></div>
                 </div>
                 <div className="mt-4 text-center text-[8px] text-gray-400 font-serif">ADI'S STUDIO</div>
             </div>
          </div>

      </div>
    </div>
  );
};