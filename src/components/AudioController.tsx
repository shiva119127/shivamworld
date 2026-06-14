"use client";

import React, { useState } from "react";
import { usePortfolio } from "@/context/PortfolioState";
import { Volume2, VolumeX, RotateCcw } from "lucide-react";

export const AudioController: React.FC = () => {
  const { 
    currentScene, 
    volume, 
    changeVolume, 
    muted, 
    toggleMute, 
    resetProgress, 
    triggerHover, 
    triggerClick 
  } = usePortfolio();

  const [isHovered, setIsHovered] = useState(false);

  // Don't show global audio controllers on the loading scene to keep the experience minimal
  if (currentScene === "loading") return null;

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    changeVolume(v);
  };

  return (
    <div 
      onMouseEnter={() => { triggerHover(); setIsHovered(true); }}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed top-4 right-4 z-40 flex items-center space-x-3 bg-card/85 backdrop-blur-md border border-custom-border px-3.5 py-2 rounded-md transition-all duration-300 select-none"
    >
      
      {/* Reset Progress Button (Represented as a Respawn CTA) */}
      {(currentScene !== "profile_unlock" && currentScene !== "world_entry") && (
        <button
          onClick={resetProgress}
          onMouseEnter={triggerHover}
          title="RELOAD DIGITAL WORLD (RESET PROGRESS)"
          className="p-1.5 hover:text-text-primary text-text-secondary bg-surface border border-custom-border rounded hover:border-text-secondary transition-all cursor-pointer"
        >
          <RotateCcw size={14} />
        </button>
      )}

      {/* Mute/Unmute Toggle Button */}
      <button 
        onClick={() => { triggerClick(); toggleMute(); }}
        className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer p-1"
      >
        {muted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>

      {/* Volume Slider Slider (Expands on hover) */}
      <div className={`flex items-center transition-all duration-300 ease-out overflow-hidden ${isHovered ? "w-24 opacity-100 pr-1" : "w-0 opacity-0"}`}>
        <input 
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={muted ? 0 : volume}
          onChange={handleVolumeChange}
          onMouseEnter={triggerHover}
          className="w-full h-1 bg-surface rounded-lg appearance-none cursor-pointer accent-text-primary"
          style={{
            background: `linear-gradient(to right, #ffffff 0%, #ffffff ${(muted ? 0 : volume) * 100}%, #242424 ${(muted ? 0 : volume) * 100}%, #242424 100%)`
          }}
        />
      </div>

      {/* Vol percentage display */}
      <span className="text-[10px] font-mono text-text-secondary min-w-[24px] text-right">
        {muted ? "MUT" : `${Math.round(volume * 100)}%`}
      </span>

      {/* Custom Styles for styling the HTML range track */}
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          transition: transform 0.1s ease;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.3);
        }
      `}</style>

    </div>
  );
};
export default AudioController;
