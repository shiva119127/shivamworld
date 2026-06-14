"use client";

import React from "react";
import { usePortfolio } from "@/context/PortfolioState";
import { ArrowLeft } from "lucide-react";

export const AboutScene: React.FC = () => {
  const { setScene, triggerHover, triggerClick } = usePortfolio();

  const handleBack = () => {
    triggerClick();
    setScene("main_hub");
  };

  return (
    <div className="flex flex-col justify-center items-center w-full min-h-screen bg-[#050508] text-text-primary px-6 py-8 relative overflow-hidden select-none font-sans animate-[fadeIn_0.4s_ease-out]">
      
      <div className="max-w-5xl w-full flex flex-col space-y-8 z-10">
        
        {/* Navigation Header */}
        <div className="flex justify-between items-center border-b border-[#20202e] pb-3 text-[10px] font-mono text-[#8a8a9d] uppercase tracking-wider">
          <button 
            onClick={handleBack}
            onMouseEnter={triggerHover}
            className="flex items-center space-x-2 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft size={12} />
            <span>BACK TO HUB</span>
          </button>
          <span>AREA: ABOUT</span>
        </div>

        {/* Title Block */}
        <div className="space-y-1">
          <h1 className="text-2xl font-mono tracking-wider text-white uppercase">ABOUT SHIVAM</h1>
          <p className="text-[10px] font-mono text-[#7a55ff] uppercase tracking-widest">LEVEL 1</p>
        </div>

        {/* About Grid Layout (3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center pt-2">
          
          {/* Column 1: Biography */}
          <div className="space-y-4 text-[#a3a3c2] leading-relaxed text-xs">
            <p>
              Hi, I'm Shivam Singh, a passionate web developer and student founder who loves building digital products that solve real-world problems.
            </p>
            <p>
              I love turning ideas into functional products and continuously learning new technologies.
            </p>
            <p>
              I believe in consistency, creativity, and creating impact through code.
            </p>
          </div>

          {/* Column 2: Center character sprite */}
          <div className="flex justify-center items-center py-6 md:py-0">
            <div className="h-64 flex items-end justify-center relative">
              <img 
                src="/character.png" 
                alt="Shivam Pixel Character" 
                className="h-56 object-contain"
                style={{ imageRendering: "pixelated" }}
              />
              {/* Subtle shadow ground under the sprite */}
              <div className="absolute bottom-0 w-24 h-2 bg-black/40 rounded-full filter blur-[1px] -z-10" />
            </div>
          </div>

          {/* Column 3: Stats Details */}
          <div className="space-y-4">
            
            {/* Stat Box: Role */}
            <div className="p-4 bg-[#0c0c12]/80 border border-[#20202e] rounded space-y-1 hover:border-[#7a55ff] transition-colors">
              <span className="text-[9px] font-mono text-[#7a55ff] uppercase tracking-wider block">ROLE</span>
              <p className="text-xs font-mono font-bold text-white uppercase">Student Founder</p>
            </div>

            {/* Stat Box: Focus */}
            <div className="p-4 bg-[#0c0c12]/80 border border-[#20202e] rounded space-y-1 hover:border-[#7a55ff] transition-colors">
              <span className="text-[9px] font-mono text-[#7a55ff] uppercase tracking-wider block">FOCUS</span>
              <p className="text-xs font-mono font-bold text-white uppercase leading-relaxed">Web Development, Startups, AI</p>
            </div>

            {/* Stat Box: Mission */}
            <div className="p-4 bg-[#0c0c12]/80 border border-[#20202e] rounded space-y-1 hover:border-[#7a55ff] transition-colors">
              <span className="text-[9px] font-mono text-[#7a55ff] uppercase tracking-wider block">MISSION</span>
              <p className="text-xs font-mono font-bold text-white uppercase leading-relaxed">Build products that create real impact</p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AboutScene;
