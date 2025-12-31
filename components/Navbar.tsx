import React from 'react';
import { Heart, Phone, Camera, Github } from 'lucide-react';
import { AppScreen } from '../types';

interface NavbarProps {
  onNavigate: (screen: AppScreen) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-6 px-4 pointer-events-none">
      <nav className="bg-white/90 backdrop-blur-md shadow-lg rounded-full px-4 md:px-8 py-3 flex items-center justify-between w-full max-w-5xl pointer-events-auto border border-white/50">
        
        {/* Logo Section */}
        <div 
            className="flex items-center cursor-pointer group pr-4 md:pr-8"
            onClick={() => onNavigate('home')}
        >
            <span className="font-bold text-lg md:text-2xl text-love-dark tracking-tight flex items-center gap-2 whitespace-nowrap">
              <Camera size={20} className="text-love-red" />
              Adi's Studio
            </span>
        </div>

        {/* Center Links - Now visible on mobile */}
        <div className="flex space-x-4 md:space-x-8 items-center text-xs md:text-sm font-semibold text-gray-500 mx-auto">
            <button onClick={() => onNavigate('home')} className="hover:text-love-red transition-colors">home</button>
            <button onClick={() => onNavigate('layout')} className="hover:text-love-red transition-colors">layouts</button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4 pl-4 md:pl-8">
             <a 
              href="tel:6260296788"
              className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-full text-gray-600 hover:bg-love-red hover:text-white transition-all"
              title="Call Your Baby"
            >
              <Phone size={16} />
            </a>
        </div>

      </nav>
    </div>
  );
};