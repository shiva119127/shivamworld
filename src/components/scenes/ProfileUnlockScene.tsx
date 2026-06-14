"use client";

import React, { useState } from "react";
import { usePortfolio } from "@/context/PortfolioState";
import { playUnlockSound } from "@/utils/synth";

export const ProfileUnlockScene: React.FC = () => {
  const { setScene, triggerHover, triggerClick } = usePortfolio();
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleUnlock = () => {
    if (isUnlocking) return;
    setIsUnlocking(true);
    triggerClick();
    playUnlockSound();

    setTimeout(() => {
      setScene("world_entry");
    }, 600);
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen bg-[#050508] select-none text-text-primary px-6 relative overflow-hidden font-sans">
      
      {/* Interactive starry atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(122,85,255,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className={`flex flex-col items-center max-w-sm w-full space-y-8 transition-all duration-500 ease-in-out ${isUnlocking ? "scale-[2.5] opacity-0 blur-md" : ""}`}>
        
        {/* Header Block */}
        <div className="text-center space-y-2">
          <h1 className="text-xl sm:text-2xl font-mono tracking-wider text-white flex items-center justify-center space-x-2">
            🔒 PLAYER FOUND
          </h1>
          <p className="text-xs font-sans text-[#7a55ff] tracking-widest uppercase animate-pulse">
            CLICK TO CONTINUE
          </p>
        </div>

        {/* Profile Avatar Frame Box */}
        <div 
          onClick={handleUnlock}
          onMouseEnter={triggerHover}
          className="w-48 h-48 bg-[#0c0c12] border-4 border-[#7a55ff]/80 relative overflow-hidden cursor-pointer group transition-all duration-300 ease-out hover:border-[#7a55ff] hover:scale-105 hover:shadow-[0_0_25px_rgba(122,85,255,0.25)]"
        >
          {/* Diagnostic HUD stats inside the image box */}
          <div className="absolute top-1.5 left-2 text-[8px] font-mono text-text-secondary/50 uppercase">
            ID: SS-99127
          </div>
          <div className="absolute top-1.5 right-2 text-[8px] font-mono text-text-secondary/50 uppercase">
            CLASS: DEVR
          </div>

          {/* Character Sprite cropped as avatar */}
          <div className="w-full h-full flex items-center justify-center p-2 relative">
            <img 
              src="/character.png" 
              alt="Avatar Profile" 
              className="w-36 h-36 object-contain translate-y-6 select-none group-hover:scale-110 transition-transform duration-300"
              style={{ imageRendering: "pixelated" }}
            />

            {/* Glowing scan bar line */}
            <div className="absolute left-0 w-full h-[2px] bg-[#7a55ff]/60 top-0 animate-[scan_3s_infinite_linear]" />
          </div>
        </div>

        {/* Details Card instruction below */}
        <button 
          onClick={handleUnlock}
          onMouseEnter={triggerHover}
          className="bg-[#0c0c12] border border-[#20202e] px-5 py-2.5 rounded text-center text-xs font-sans text-[#8a8a9d] hover:border-[#7a55ff] transition-all hover:text-white"
        >
          Click on the avatar to enter the world
        </button>

      </div>
      
      {/* Dynamic Keyframes for scanbar inside the style tag */}
      <style jsx global>{`
        @keyframes scan {
          0% { top: 5%; opacity: 0.1; }
          10% { opacity: 0.9; }
          90% { opacity: 0.9; }
          100% { top: 95%; opacity: 0.1; }
        }
      `}</style>

    </div>
  );
};
export default ProfileUnlockScene;
