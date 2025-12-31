import React, { useEffect, useRef, useState } from 'react';
import { Download, Share2, ArrowLeft, RefreshCw, Loader2, Heart, Type } from 'lucide-react';
import { generateRomanticMessage } from '../services/geminiService';
import { LayoutTheme } from '../types';
import { LAYOUTS } from './LayoutSelection';

interface StripResultProps {
  photos: string[];
  initialTheme: LayoutTheme;
  onRetake: () => void;
  onHome: () => void;
}

const dataURLtoBlob = (dataurl: string) => {
    const arr = dataurl.split(',');
    const match = arr[0].match(/:(.*?);/);
    const mime = match ? match[1] : 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
};

export const StripResult: React.FC<StripResultProps> = ({ photos, initialTheme, onRetake, onHome }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frameColor, setFrameColor] = useState(initialTheme.color);
  const [stripUrl, setStripUrl] = useState<string | null>(null);
  const [aiMessage, setAiMessage] = useState<string>("Writing a love note...");
  const [isGenerating, setIsGenerating] = useState(true);

  const selectedColorTheme = LAYOUTS.find(l => l.color === frameColor) || initialTheme;

  useEffect(() => {
    const fetchMessage = async () => {
        setIsGenerating(true);
        const msg = await generateRomanticMessage();
        setAiMessage(msg);
        setIsGenerating(false);
    };
    fetchMessage();
  }, []);

  useEffect(() => {
    if (!canvasRef.current || isGenerating) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High resolution canvas
    const imgWidth = 600;
    const imgHeight = 450; // 4:3
    const padding = 50;
    const gap = 30;
    const headerHeight = 0;
    const footerHeight = 450; 
    
    const stripWidth = imgWidth + (padding * 2);
    const stripHeight = (imgHeight * 4) + (gap * 3) + padding + footerHeight + headerHeight;

    canvas.width = stripWidth;
    canvas.height = stripHeight;

    // --- DRAW BACKGROUND & PATTERN ---
    ctx.fillStyle = frameColor;
    ctx.fillRect(0, 0, stripWidth, stripHeight);

    // Pattern Logic
    if (selectedColorTheme.pattern === 'hearts') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        const size = 30;
        for(let i=0; i<stripWidth; i+=60) {
            for(let j=0; j<stripHeight; j+=60) {
                ctx.beginPath();
                ctx.arc(i, j, 5, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    } else if (selectedColorTheme.pattern === 'film') {
         // Film strip holes
         ctx.fillStyle = '#FFFFFF';
         const holeW = 15;
         const holeH = 25;
         const holeGap = 40;
         for(let y=20; y < stripHeight; y+=holeGap) {
             ctx.fillRect(10, y, holeW, holeH);
             ctx.fillRect(stripWidth - 10 - holeW, y, holeW, holeH);
         }
    } else if (selectedColorTheme.pattern === 'stars') {
         ctx.fillStyle = '#FFFFFF';
         for(let i=0; i<50; i++) {
             const x = Math.random() * stripWidth;
             const y = Math.random() * stripHeight;
             const r = Math.random() * 2;
             ctx.beginPath();
             ctx.arc(x, y, r, 0, Math.PI * 2);
             ctx.fill();
         }
    }

    // --- DRAW PHOTOS ---
    const drawContent = async () => {
      let yPos = padding + headerHeight;
      
      for (const photoSrc of photos) {
        const img = new Image();
        img.src = photoSrc;
        await new Promise((resolve) => {
          img.onload = () => {
            // Draw Photo
            ctx.drawImage(img, padding, yPos, imgWidth, imgHeight);
            
            // Border around photo
            if (selectedColorTheme.pattern === 'film') {
                 ctx.strokeStyle = 'white';
                 ctx.lineWidth = 4;
                 ctx.strokeRect(padding, yPos, imgWidth, imgHeight);
            } else {
                 ctx.strokeStyle = 'rgba(0,0,0,0.05)';
                 ctx.lineWidth = 1;
                 ctx.strokeRect(padding, yPos, imgWidth, imgHeight);
            }
            
            yPos += imgHeight + gap;
            resolve(null);
          };
        });
      }

      // --- DRAW FOOTER ---
      const footerCenterY = yPos + (footerHeight / 2) - 40;
      
      // Date
      ctx.fillStyle = selectedColorTheme.textColor;
      ctx.font = '500 24px Quicksand';
      ctx.textAlign = 'center';
      ctx.globalAlpha = 0.7;
      const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');
      ctx.fillText(date, stripWidth / 2, yPos + 60);
      ctx.globalAlpha = 1.0;

      // Logo / Watermark
      ctx.font = 'bold 64px Quicksand';
      ctx.letterSpacing = '-2px';
      
      // CHECK FOR SPECIAL ADITI LAYOUT
      const watermarkText = selectedColorTheme.id === 'aditi' ? "Happy New Year" : "Adi's Studio";
      ctx.fillText(watermarkText, stripWidth / 2, yPos + 140);
      
      // Message
      ctx.font = '500 32px Quicksand';
      ctx.fillStyle = selectedColorTheme.secondaryColor;
      
      // Wrap text
      const maxWidth = stripWidth - 100;
      const words = aiMessage.split(' ');
      let line = '';
      let lineY = yPos + 220;
      
      for(let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, stripWidth/2, lineY);
          line = words[n] + ' ';
          lineY += 45;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, stripWidth/2, lineY);

      // Decoration
      if (selectedColorTheme.pattern !== 'film') {
          ctx.font = '40px serif';
          ctx.fillText("♥", stripWidth / 2, lineY + 60);
      }

      setStripUrl(canvas.toDataURL('image/png', 1.0));
    };

    drawContent();

  }, [photos, frameColor, aiMessage, isGenerating, selectedColorTheme]);

  const downloadStrip = () => {
    if (stripUrl) {
      const link = document.createElement('a');
      link.download = `adis-studio-love-${Date.now()}.png`;
      link.href = stripUrl;
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-love-bg pt-28 pb-12 px-4 flex flex-col items-center">
      
      <div className="flex flex-col lg:flex-row gap-12 items-start justify-center max-w-6xl w-full">
        
        {/* The Result */}
        <div className="relative shadow-2xl rounded-sm overflow-hidden bg-white mx-auto lg:mx-0 transition-all duration-500 ring-1 ring-gray-100">
           {isGenerating && (
               <div className="absolute inset-0 z-10 bg-white/90 backdrop-blur-sm flex items-center justify-center flex-col text-love-dark">
                   <Loader2 size={48} className="animate-spin mb-4 text-love-red" />
                   <p className="font-semibold animate-pulse font-sans">Developing photos...</p>
               </div>
           )}
           {/* Reduced width from w-[320px] to w-[260px] */}
           <canvas ref={canvasRef} className="max-w-full h-auto max-h-[75vh] w-[260px] shadow-sm" />
        </div>

        {/* Customization Panel */}
        <div className="w-full max-w-md bg-white p-8 rounded-[2rem] shadow-xl border border-pink-100 sticky top-28">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2 font-sans">
                    So Cute! <Heart fill="#FF2E63" className="text-love-red" />
                </h2>
                <p className="text-gray-500 font-sans">You can still change the frame style if you like.</p>
            </div>

            <div className="mb-8">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 font-sans">Frame Style</label>
                <div className="grid grid-cols-4 gap-3">
                    {LAYOUTS.map((c) => (
                        <button
                            key={c.id}
                            onClick={() => setFrameColor(c.color)}
                            className={`aspect-square rounded-2xl border-2 transition-all flex items-center justify-center relative overflow-hidden ${frameColor === c.color ? 'border-love-red shadow-lg scale-105' : 'border-transparent hover:border-gray-200'}`}
                            style={{ backgroundColor: c.color }}
                            title={c.name}
                        >
                             <span className="sr-only">{c.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <button 
                    onClick={downloadStrip}
                    disabled={isGenerating}
                    className="w-full py-4 bg-love-red text-white rounded-2xl font-bold shadow-lg shadow-red-200 hover:bg-red-600 hover:shadow-xl transition-all flex items-center justify-center gap-3 transform active:scale-95 font-sans"
                >
                    <Download size={20} />
                    Save to Gallery
                </button>

                 <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={onRetake}
                        className="py-3 border-2 border-gray-100 text-gray-600 rounded-xl font-bold hover:border-love-red hover:text-love-red transition-all flex items-center justify-center gap-2 font-sans"
                    >
                        <RefreshCw size={18} />
                        Retake
                    </button>
                    <button 
                         onClick={() => {
                             if(navigator.share && stripUrl) {
                                 const blob = dataURLtoBlob(stripUrl);
                                 const file = new File([blob], 'adis-studio-love.png', { type: 'image/png' });
                                 navigator.share({
                                     files: [file],
                                     title: "Adi's Studio",
                                     text: "Check out my cute photos!"
                                 }).catch(console.error);
                             } else {
                                 alert("Share not supported on this device.");
                             }
                         }}
                        className="py-3 border-2 border-gray-100 text-gray-600 rounded-xl font-bold hover:border-blue-400 hover:text-blue-500 transition-all flex items-center justify-center gap-2 font-sans"
                    >
                        <Share2 size={18} />
                        Share
                    </button>
                 </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100">
                 <div className="flex items-start gap-3">
                     <div className="bg-pink-100 p-2 rounded-full">
                         <Type size={16} className="text-love-red" />
                     </div>
                     <div>
                         <p className="text-xs text-gray-400 font-bold uppercase mb-1 font-sans">Note for you</p>
                         <p className="text-gray-700 font-medium text-sm leading-relaxed font-sans">"{aiMessage}"</p>
                     </div>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};