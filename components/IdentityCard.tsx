import React, { useEffect, useRef } from 'react';
import { UserData } from '../types';

interface IdentityCardProps {
  userData: UserData;
}

const IdentityCard: React.FC<IdentityCardProps> = ({ userData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // We can also draw this on a canvas for downloading, but for now we create a beautiful DOM element
    // The user can screenshot it or we could use html2canvas in a real production app.
  }, []);

  return (
    <div className="flex flex-col items-center justify-center animate-fade-in px-4">
      <div className="relative w-full max-w-md aspect-[1.586/1] rounded-2xl overflow-hidden shadow-2xl transform transition-transform hover:rotate-1 hover:scale-105 duration-500 group cursor-pointer border-2 border-amber-500/50">
        
        {/* Background */}
        <div className="absolute inset-0 bg-slate-900">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-amber-500/20 via-transparent to-purple-900/40"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-6 border-4 border-double border-amber-500/30 m-2 rounded-xl">
          
          {/* Header */}
          <div className="flex justify-between items-start">
             <div>
                <h2 className="text-amber-400 font-bold text-xl font-kufi tracking-widest uppercase">Riddle Master</h2>
                <p className="text-xs text-purple-300 tracking-[0.2em] mt-1">ELITE MEMBERSHIP</p>
             </div>
             <div className="w-12 h-12 rounded-full border-2 border-amber-400 flex items-center justify-center bg-black/50 shadow-[0_0_15px_rgba(251,191,36,0.5)]">
               <span className="text-2xl">👑</span>
             </div>
          </div>

          {/* User Info */}
          <div className="text-right mt-4">
            <div className="mb-1">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-0.5">الاسم / Name</span>
              <h1 className="text-2xl font-bold text-white font-amiri drop-shadow-md">{userData.name}</h1>
            </div>
            
            <div className="flex justify-end gap-6 mt-4">
               <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-0.5">الكود / ID</span>
                  <p className="text-sm text-purple-200 font-mono">RM-100-COMPLETED</p>
               </div>
               <div className="text-right">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-0.5">انستقرام / IG</span>
                  <p className="text-sm text-amber-300 font-mono" dir="ltr">{userData.instagram}</p>
               </div>
            </div>
          </div>

          {/* Footer & Signature */}
          <div className="flex justify-between items-end mt-4">
             <div className="opacity-70">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=I_AM_A_RIDDLE_MASTER" alt="QR" className="w-12 h-12 mix-blend-screen rounded-sm" />
             </div>
             <div className="text-center">
                <div className="h-px w-24 bg-amber-500/50 mb-1"></div>
                <p className="font-english text-2xl text-white/80" style={{fontFamily: "'Reem Kufi', sans-serif", fontStyle: 'italic'}}>Approved</p>
             </div>
          </div>

          {/* Holographic effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
        </div>
      </div>

      <p className="mt-8 text-gray-400 text-sm">التقط لقطة شاشة للبطاقة وشاركها على انستقرام!</p>
      
      <div className="mt-6 flex gap-4">
        <a 
          href={`https://instagram.com/${userData.instagram.replace('@','')}`} 
          target="_blank" 
          rel="noreferrer"
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:shadow-pink-500/50 transition-all"
        >
          مشاركة الإنجاز
        </a>
      </div>
    </div>
  );
};

export default IdentityCard;