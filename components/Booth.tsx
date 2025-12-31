import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, X, Check, Heart, Sparkles, Filter } from 'lucide-react';
import { generateCheer } from '../services/geminiService';
import { FilterType } from '../types';

interface BoothProps {
  onCaptureComplete: (photos: string[]) => void;
  onCancel: () => void;
}

const FILTERS: { id: FilterType; name: string; class: string }[] = [
    { id: 'normal', name: 'Normal', class: 'filter-normal' },
    { id: 'grayscale', name: 'B&W', class: 'filter-grayscale' },
    { id: 'sepia', name: 'Sepia', class: 'filter-sepia' },
    { id: 'soft', name: 'Soft', class: 'filter-soft' },
    { id: 'vintage', name: 'Vintage', class: 'filter-vintage' },
];

export const Booth: React.FC<BoothProps> = ({ onCaptureComplete, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('normal');
  const [cheer, setCheer] = useState<string>("Ready?");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showIntroSparkle, setShowIntroSparkle] = useState(true);

  // Sparkle Effect on Mount
  useEffect(() => {
    const timer = setTimeout(() => setShowIntroSparkle(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Start Camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false 
        });
        setStream(mediaStream);
        if (videoRef.current) videoRef.current.srcObject = mediaStream;
      } catch (err) {
        console.error("Camera error", err);
        alert("Camera access denied or missing.");
      }
    };
    startCamera();
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, []);

  // Sync stream ref
  useEffect(() => {
    if (stream && videoRef.current) videoRef.current.srcObject = stream;
  }, [stream]);

  const takePhoto = useCallback(() => {
    if (videoRef.current && !isProcessing) {
      setIsProcessing(true);
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Horizontal flip
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        
        // Apply Filter to Context
        if (activeFilter === 'grayscale') ctx.filter = 'grayscale(1)';
        else if (activeFilter === 'sepia') ctx.filter = 'sepia(0.6) contrast(1.2)';
        else if (activeFilter === 'soft') ctx.filter = 'contrast(0.9) brightness(1.1) saturate(1.2)';
        else if (activeFilter === 'vintage') ctx.filter = 'sepia(0.3) contrast(1.1) brightness(0.9) grayscale(0.2)';
        else ctx.filter = 'none';

        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        
        // Flash Effect
        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 200);

        setCapturedPhotos(prev => {
           const newPhotos = [...prev, dataUrl];
           
           // If we have 4 photos, finish
           if (newPhotos.length >= 4) {
               setTimeout(() => onCaptureComplete(newPhotos), 1000);
           } else {
               // Schedule next countdown
               setTimeout(() => {
                   setIsProcessing(false);
                   setCountdown(3);
                   generateCheer().then(setCheer);
               }, 2000); // 2 second pause to review photo
           }
           return newPhotos;
        });
      }
    }
  }, [onCaptureComplete, activeFilter, isProcessing]);

  // Countdown Timer Effect
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (countdown === 0 && !isProcessing) {
      // Trigger photo when countdown hits 0
      takePhoto();
      setCountdown(null); // Stop countdown immediately to prevent double triggers
    }
    return () => clearTimeout(timer);
  }, [countdown, isProcessing, takePhoto]);

  const startSession = () => {
    if (capturedPhotos.length === 0 && !countdown) {
        setCapturedPhotos([]);
        setCountdown(3);
        setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-love-bg pt-24 pb-10 px-4 flex flex-col lg:flex-row gap-8 items-center justify-center relative overflow-hidden font-sans">
      
      {/* Sparkle Intro */}
      {showIntroSparkle && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
             <div className="animate-ping absolute inset-0 bg-pink-200/20"></div>
             <Sparkles className="text-yellow-400 w-32 h-32 animate-spin duration-1000" />
        </div>
      )}

      {/* Left: Main Camera View */}
      <div className="relative w-full max-w-2xl aspect-[4/3] bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-white z-10 group">
        
        {/* Flash */}
        <div className={`absolute inset-0 bg-white pointer-events-none z-50 transition-opacity duration-150 ${isFlashing ? 'opacity-100' : 'opacity-0'}`} />
        
        {/* Video Feed */}
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className={`w-full h-full object-cover transform -scale-x-100 transition-all duration-300 rounded-2xl ${FILTERS.find(f => f.id === activeFilter)?.class}`}
        />

        {/* Countdown Overlay */}
        {countdown !== null && countdown > 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-20 rounded-2xl">
            <span className="text-[120px] font-bold text-white drop-shadow-[0_0_15px_rgba(255,46,99,0.8)] animate-pulse font-sans">
              {countdown}
            </span>
          </div>
        )}

        {/* AI Cheer / Status */}
        <div className="absolute top-6 left-0 right-0 text-center z-20">
            <span className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full text-love-red font-bold text-sm border border-pink-100 shadow-lg font-sans">
                <Sparkles size={16} className="text-yellow-400 fill-yellow-400" /> {cheer}
            </span>
        </div>

        {/* Filter Controls (Bottom of Video) */}
        {countdown === null && capturedPhotos.length === 0 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-white/90 p-2 rounded-2xl backdrop-blur-md border border-pink-100 shadow-lg overflow-x-auto max-w-[90%] scrollbar-hide z-20">
                {FILTERS.map((f) => (
                    <button
                        key={f.id}
                        onClick={() => setActiveFilter(f.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all font-sans ${activeFilter === f.id ? 'bg-love-red text-white shadow-md' : 'bg-transparent text-gray-500 hover:bg-pink-50'}`}
                    >
                        {f.name}
                    </button>
                ))}
            </div>
        )}
      </div>

      {/* MOBILE Layout: Horizontal Preview & Buttons below Camera */}
      <div className="flex flex-col w-full md:hidden gap-6 z-10">
          
          {/* Horizontal Preview Strip */}
          <div className="bg-white p-2 rounded-xl shadow-lg border border-gray-100">
             <div className="flex justify-between gap-2">
                 {[0, 1, 2, 3].map((idx) => (
                      <div key={idx} className="aspect-[4/3] bg-gray-50 w-full rounded-md relative overflow-hidden border border-gray-100">
                          {capturedPhotos[idx] ? (
                              <img src={capturedPhotos[idx]} className="w-full h-full object-cover" alt={`Shot ${idx+1}`} />
                          ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                  {idx === capturedPhotos.length && countdown !== null ? (
                                      <div className="w-4 h-4 border-2 border-love-red border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <span className="text-gray-300 text-[10px] font-bold">{idx + 1}</span>
                                  )}
                              </div>
                          )}
                      </div>
                  ))}
             </div>
          </div>

          {/* Mobile Buttons */}
          <div className="flex flex-col gap-3">
            {capturedPhotos.length === 0 && !countdown && (
                <button 
                    onClick={startSession}
                    className="w-full py-4 bg-love-red hover:bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                    <Camera size={20} /> START
                </button>
            )}
            
            {capturedPhotos.length === 0 && !countdown && (
                <button 
                    onClick={onCancel}
                    className="w-full py-3 bg-white hover:bg-gray-50 text-gray-400 hover:text-gray-600 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 border border-gray-100 shadow-sm"
                >
                    <X size={18} /> EXIT
                </button>
            )}

            {(capturedPhotos.length > 0 || countdown !== null) && (
                 <div className="text-center text-love-red/80 text-xs font-bold animate-pulse bg-white/80 py-2 rounded-full">
                     {capturedPhotos.length === 4 ? "Developing Photos..." : "Don't move! Pose for the camera!"}
                 </div>
            )}
          </div>
      </div>

      {/* DESKTOP Layout: Vertical Strip Sidebar */}
      <div className="w-[180px] hidden md:flex flex-col gap-6 z-10 h-full justify-center shrink-0">
          
          {/* Visual Strip Container */}
          <div className="bg-white p-3 pb-6 rounded-sm shadow-xl shadow-pink-100/50 transition-transform duration-300 relative border border-gray-100">
              {/* Strip Holes Mockup */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-love-bg rounded-full z-0 opacity-100"></div>

              <div className="flex flex-col gap-2 relative z-10">
                  {[0, 1, 2, 3].map((idx) => (
                      <div key={idx} className="aspect-[4/3] bg-gray-50 w-full relative overflow-hidden border border-gray-100 rounded-[2px]">
                          {capturedPhotos[idx] ? (
                              <img src={capturedPhotos[idx]} className="w-full h-full object-cover" alt={`Shot ${idx+1}`} />
                          ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                  {idx === capturedPhotos.length && countdown !== null ? (
                                      <div className="w-8 h-8 border-2 border-love-red border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <span className="text-gray-200 text-xs font-bold">{idx + 1}</span>
                                  )}
                              </div>
                          )}
                      </div>
                  ))}
              </div>
              <div className="mt-4 text-center">
                   <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase font-sans">Adi's Studio</p>
              </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {capturedPhotos.length === 0 && !countdown && (
                <button 
                    onClick={startSession}
                    className="w-full py-4 bg-love-red hover:bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
                >
                    <Camera size={20} /> START
                </button>
            )}
            
            {capturedPhotos.length === 0 && !countdown && (
                <button 
                    onClick={onCancel}
                    className="w-full py-3 bg-white hover:bg-gray-50 text-gray-400 hover:text-gray-600 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 border border-gray-100 shadow-sm"
                >
                    <X size={18} /> EXIT
                </button>
            )}
            
            {(capturedPhotos.length > 0 || countdown !== null) && (
                 <div className="text-center text-love-red/80 text-xs font-bold animate-pulse">
                     {capturedPhotos.length === 4 ? "Developing Photos..." : "Don't move!"}
                 </div>
            )}
          </div>
      </div>
    </div>
  );
};