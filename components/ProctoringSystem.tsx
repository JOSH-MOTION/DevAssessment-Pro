import React, { useEffect, useRef, useState } from 'react';
import { ProctorLog } from '../types';

interface ProctoringSystemProps {
  isActive: boolean;
  onLog: (log: ProctorLog) => void;
}

const ProctoringSystem: React.FC<ProctoringSystemProps> = ({ isActive, onLog }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (isActive) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(s => {
          setStream(s);
          if (videoRef.current) videoRef.current.srcObject = s;
          setHasPermission(true);
        })
        .catch(err => {
          console.error("Camera access denied", err);
          onLog({
            timestamp: Date.now(),
            type: 'snapshot',
            details: 'Identity verification feed unavailable'
          });
        });

      const handleBlur = () => {
        onLog({
          timestamp: Date.now(),
          type: 'window-blur',
          details: 'Window lost focus'
        });
      };

      window.addEventListener('blur', handleBlur);
      return () => {
        window.removeEventListener('blur', handleBlur);
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      };
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive || !hasPermission) return;
    const interval = setInterval(() => {
      onLog({
        timestamp: Date.now(),
        type: 'snapshot',
        details: 'Periodic identity verification'
      });
    }, 45000);
    return () => clearInterval(interval);
  }, [isActive, hasPermission]);

  if (!isActive) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative w-48 h-32 bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
        {!hasPermission ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <i className="fas fa-video-slash text-rose-300 mb-2"></i>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Feed Disabled</span>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover grayscale opacity-80"
          />
        )}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-white/90 backdrop-blur rounded-lg border border-slate-200">
          <div className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-pulse"></div>
          <span className="text-[8px] font-black uppercase text-slate-900 tracking-tighter">Secured Feed</span>
        </div>
      </div>
    </div>
  );
};

export default ProctoringSystem;