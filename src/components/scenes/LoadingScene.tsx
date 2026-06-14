"use client";

import React, { useEffect, useState } from "react";
import { usePortfolio } from "@/context/PortfolioState";
import { playLoadingAmbience, stopLoadingAmbience, playCompletionSound } from "@/utils/synth";

export const LoadingScene: React.FC = () => {
  const { setScene } = usePortfolio();
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("LOADING PLAYER DATA...");

  useEffect(() => {
    // Start looping drone
    playLoadingAmbience();

    const intervalTime = 30; // ms per tick
    const totalTicks = 100;
    let tickCount = 0;

    const messages = [
      "CONNECTING TO SHIVAM'S SERVERS...",
      "FETCHING DEVELOPER CREDENTIALS...",
      "CALIBRATING ABILITY TREE...",
      "OPENING QUEST LOG...",
      "SYNCING ACHIEVEMENTS...",
      "READY TO SPAWN!"
    ];

    const timer = setInterval(() => {
      tickCount += 1;
      const currentProgress = Math.min(100, Math.floor((tickCount / totalTicks) * 100));
      setProgress(currentProgress);

      const msgIndex = Math.min(
        messages.length - 1,
        Math.floor((currentProgress / 100) * messages.length)
      );
      setMessage(messages[msgIndex]);

      if (tickCount >= totalTicks) {
        clearInterval(timer);
        stopLoadingAmbience();
        playCompletionSound();
        setTimeout(() => {
          setScene("profile_unlock");
        }, 800);
      }
    }, intervalTime);

    return () => {
      clearInterval(timer);
      stopLoadingAmbience();
    };
  }, [setScene]);

  return (
    <div 
      className="flex flex-col justify-between items-center w-full h-screen bg-cover bg-center select-none text-text-primary px-6 py-12 relative font-sans"
      style={{ backgroundImage: "url('/loading_bg.png')" }}
    >
      {/* Dark overlay for city contrast */}
      <div className="absolute inset-0 bg-black/45 z-0" />

      {/* Top spacing */}
      <div className="z-10" />

      {/* Center content: Character sprite and title */}
      <div className="flex flex-col items-center max-w-lg w-full space-y-6 z-10">
        
        {/* Title */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl sm:text-5xl font-mono tracking-wider text-white">
            SHIVAM SINGH
          </h1>
          <p className="text-sm font-sans tracking-widest text-[#a3a3c2] uppercase">
            {message}
          </p>
        </div>

        {/* Character Sprite Display */}
        <div className="h-32 flex items-end justify-center relative my-4">
          <img 
            src="/character.png" 
            alt="Pixel Character" 
            className="h-28 object-contain animate-bounce" 
            style={{ imageRendering: "pixelated" }}
          />
        </div>

        {/* Progress Display */}
        <div className="w-full max-w-sm space-y-2">
          {/* Classic rounded pixel-style progress container */}
          <div className="w-full h-5 bg-[#0f0f16]/90 border-2 border-[#20202e] rounded-full overflow-hidden p-0.5 relative flex items-center justify-center">
            <div 
              className="h-full bg-gradient-to-r from-[#7a55ff] to-[#9966ff] rounded-full transition-all ease-out duration-75 absolute left-0.5 top-0.5"
              style={{ width: `calc(${progress}% - 4px)` }}
            />
            <span className="z-10 font-sans text-xs text-white font-bold drop-shadow">
              {progress}%
            </span>
          </div>
        </div>

      </div>

      {/* Bottom Tip Bar */}
      <div className="w-full max-w-md bg-[#0c0c12]/95 border border-[#20202e] p-3 rounded text-center z-10 font-sans text-xs text-[#8a8a9d] leading-relaxed">
        <span className="font-bold text-[#7a55ff]">TIP:</span> Every great builder starts with a single line of code.
      </div>
    </div>
  );
};
export default LoadingScene;
