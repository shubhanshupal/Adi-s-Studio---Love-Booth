import React, { useRef } from 'react';
import { ArrowLeft, ChevronRight, ChevronLeft } from 'lucide-react';
import { LayoutTheme } from '../types';

interface LayoutSelectionProps {
  onSelect: (layout: LayoutTheme) => void;
  onBack: () => void;
}

export const LAYOUTS: LayoutTheme[] = [
    { id: 'aditi', name: 'Special for Aditi', description: 'Happy New Year Edition', color: '#FFE4E1', textColor: '#D81B60', secondaryColor: '#880E4F', pattern: 'hearts' },
    { id: 'classic', name: 'Classic White', description: 'Timeless & Clean', color: '#FFFFFF', textColor: '#000000', secondaryColor: '#FF2E63', pattern: 'none' },
    { id: 'film', name: 'Film Noir', description: 'Retro Cinema Style', color: '#1a1a1a', textColor: '#FFFFFF', secondaryColor: '#FF2E63', pattern: 'film' },
    { id: 'hearts', name: 'Love Letter', description: 'For Your Sweetheart', color: '#FFC0CB', textColor: '#C71585', secondaryColor: '#FFFFFF', pattern: 'hearts' },
    { id: 'stars', name: 'Starry Night', description: 'Dreamy & Magical', color: '#1E1B4B', textColor: '#E0E7FF', secondaryColor: '#FDBA74', pattern: 'stars' },
    { id: 'cream', name: 'Soft Cream', description: 'Warm & Cozy', color: '#FFFDD0', textColor: '#5D4037', secondaryColor: '#D2691E', pattern: 'none' },
    { id: 'mint', name: 'Fresh Mint', description: 'Bright & Airy', color: '#E0F2F1', textColor: '#004D40', secondaryColor: '#00897B', pattern: 'none' },
];

export const LayoutSelection: React.FC<LayoutSelectionProps> = ({ onSelect, onBack }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 240; 
      scrollContainerRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const renderPatternPreview = (layout: LayoutTheme) => {
      switch(layout.pattern) {
          case 'film':
              return (
                  <div className="absolute inset-0 pointer-events-none flex justify-between px-1">
                      <div className="h-full border-l-2 border-dashed border-white/20"></div>
                      <div className="h-full border-r-2 border-dashed border-white/20"></div>
                  </div>
              );
          case 'hearts':
              return (
                  <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle,_transparent_20%,_#fff_20%,_#fff_80%,_transparent_80%,_transparent),_radial-gradient(circle,_transparent_20%,_#fff_20%,_#fff_80%,_transparent_80%,_transparent)] bg-[length:20px_20px] [background-position:0_0,_10px_10px]"></div>
              );
          case 'stars':
              return (
                  <div className="absolute inset-0 pointer-events-none opacity-30 text-[8px] text-white flex flex-wrap content-between p-2">
                       <span>★</span><span>✦</span><span>★</span><span>✦</span>
                  </div>
              );
          default:
              return null;
      }
  }

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 flex flex-col items-center relative">
      
      {/* Header */}
      <div className="text-center mb-10 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight">choose your layout</h2>
          <p className="text-sm text-gray-500 italic">Select from our collection of photo booth layouts</p>
      </div>

      {/* Carousel Container */}
      <div className="relative w-full max-w-6xl flex items-center justify-center">
          
          {/* Nav Button Left */}
          <button 
            onClick={() => scroll('left')}
            className="hidden md:flex absolute left-0 z-10 w-10 h-10 bg-white rounded-full shadow-lg items-center justify-center text-gray-400 hover:text-love-red hover:scale-110 transition-all border border-gray-100"
          >
              <ChevronLeft size={20} />
          </button>

          {/* Scroll Area */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-8 px-12 w-full scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
              {LAYOUTS.map((layout, index) => (
                  <div 
                    key={layout.id}
                    onClick={() => onSelect(layout)}
                    className="flex-shrink-0 snap-center cursor-pointer group"
                  >
                      {/* Card */}
                      <div className="w-[140px] md:w-[180px] bg-white rounded-t-[3rem] rounded-b-[3rem] p-3 pb-6 shadow-lg border border-gray-100 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:border-love-pink/30 relative overflow-visible">
                          
                          {/* Ribbon for Aditi */}
                          {layout.id === 'aditi' && (
                              <div className="absolute -top-3 -right-3 z-30 transform rotate-12 drop-shadow-md animate-bounce" style={{ animationDuration: '3s' }}>
                                  <span className="text-4xl">🎀</span>
                              </div>
                          )}

                          {/* Preview Area */}
                          <div 
                            className="aspect-[1/3] w-full rounded-[2.2rem] border border-gray-100 mb-4 relative overflow-hidden flex flex-col items-center py-3 gap-1.5 shadow-inner"
                            style={{ backgroundColor: layout.color }}
                          >
                                {renderPatternPreview(layout)}

                                {/* Mock Photos */}
                                <div className="w-[80%] aspect-[4/3] bg-black/10 rounded-[2px] z-10" />
                                <div className="w-[80%] aspect-[4/3] bg-black/10 rounded-[2px] z-10" />
                                <div className="w-[80%] aspect-[4/3] bg-black/10 rounded-[2px] z-10" />
                                <div className="w-[80%] aspect-[4/3] bg-black/10 rounded-[2px] z-10" />
                                
                                {/* Mock Text */}
                                <div className="mt-1 text-[5px] font-bold opacity-70 z-10" style={{ color: layout.textColor }}>
                                    {layout.id === 'aditi' ? "Happy New Year" : "ADI'S STUDIO"}
                                </div>
                          </div>

                          {/* Info */}
                          <div className="text-center px-1">
                              <h3 className="font-bold text-xs md:text-sm text-gray-800 mb-0.5 group-hover:text-love-red transition-colors truncate">{layout.name}</h3>
                              <p className="text-[9px] md:text-[10px] text-gray-400 font-medium truncate">{layout.description}</p>
                          </div>
                          
                          {/* Hover Overlay - now clipped to border radius of card to avoid covering ribbon if it was inside, but ribbon is outside now */}
                          <div className="absolute inset-0 bg-love-red/0 group-hover:bg-love-red/5 transition-colors pointer-events-none rounded-t-[3rem] rounded-b-[3rem]" />
                      </div>
                  </div>
              ))}
          </div>

          {/* Nav Button Right */}
          <button 
            onClick={() => scroll('right')}
            className="hidden md:flex absolute right-0 z-10 w-10 h-10 bg-white rounded-full shadow-lg items-center justify-center text-gray-400 hover:text-love-red hover:scale-110 transition-all border border-gray-100"
          >
              <ChevronRight size={20} />
          </button>
      </div>

    </div>
  );
};