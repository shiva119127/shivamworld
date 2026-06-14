"use client";

import React, { useEffect } from "react";
import { usePortfolio } from "@/context/PortfolioState";
import { playPortalAmbience, stopPortalAmbience, playHubTheme } from "@/utils/synth";

export const WorldEntryScene: React.FC = () => {
  const { setScene } = usePortfolio();

  useEffect(() => {
    // Play cosmic wind audio loop
    playPortalAmbience();

    // Transition after 2.5 seconds
    const timer = setTimeout(() => {
      stopPortalAmbience();
      // Start main hub background loop
      playHubTheme();
      setScene("main_hub");
    }, 2500);

    return () => {
      clearTimeout(timer);
      stopPortalAmbience();
    };
  }, [setScene]);

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen bg-background select-none text-text-primary px-6 relative overflow-hidden">
      
      {/* Dynamic Cosmic Portal Vector Ring Animation */}
      <div className="absolute w-[600px] h-[600px] rounded-full border border-custom-border/20 flex items-center justify-center animate-[spin_30s_linear_infinite]">
        <div className="w-[500px] h-[500px] rounded-full border border-dashed border-custom-border/30 flex items-center justify-center animate-[spin_20s_linear_infinite_reverse]">
          <div className="w-[380px] h-[380px] rounded-full border border-custom-border/40 flex items-center justify-center animate-[spin_10s_linear_infinite]">
            <div className="w-[200px] h-[200px] rounded-full border border-dotted border-custom-border/50" />
          </div>
        </div>
      </div>

      {/* Grid line grid overlay expanding */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] bg-[size:40px_40px] animate-[gridZoom_2.5s_ease-out_infinite]" />

      <div className="relative text-center space-y-4 z-10 animate-[textReveal_2.5s_ease-out_infinite]">
        <h2 className="text-[10px] font-mono tracking-[0.3em] uppercase text-text-secondary">INITIALIZING SPAWN POINT</h2>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-[0.25em] uppercase text-text-primary">
          ENTERING SHIVAM'S WORLD
        </h1>
        <div className="flex items-center justify-center space-x-1.5 pt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-text-primary animate-ping" />
          <span className="text-xs font-mono text-text-secondary tracking-widest lowercase">establishing portal links...</span>
        </div>
      </div>

      {/* Styling for custom animation sequences */}
      <style jsx global>{`
        @keyframes gridZoom {
          0% {
            transform: scale(1) translateZ(0);
            opacity: 0.2;
          }
          100% {
            transform: scale(1.8) translateZ(0);
            opacity: 0.8;
          }
        }
        @keyframes textReveal {
          0% {
            transform: scale(0.95);
            filter: blur(4px);
            opacity: 0.1;
          }
          10% {
            filter: blur(0px);
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: scale(1.05);
            opacity: 0;
          }
        }
      `}</style>

    </div>
  );
};
export default WorldEntryScene;
