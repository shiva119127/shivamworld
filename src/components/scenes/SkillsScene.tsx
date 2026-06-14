"use client";

import React from "react";
import { usePortfolio } from "@/context/PortfolioState";
import { ArrowLeft, Star } from "lucide-react";

interface SkillItem {
  name: string;
  level: number;
}

export const SkillsScene: React.FC = () => {
  const { setScene, triggerHover, triggerClick } = usePortfolio();

  const skills: SkillItem[] = [
    { name: "HTML / CSS", level: 85 },
    { name: "JavaScript", level: 80 },
    { name: "React.js", level: 75 },
    { name: "Node.js", level: 70 },
    { name: "MongoDB", level: 65 },
    { name: "Git & Github", level: 80 },
    { name: "UI / UX Design", level: 60 }
  ];

  const unlocks = [
    "Build Real Projects",
    "Solve Complex Problems",
    "Help Others",
    "Create Impact"
  ];

  const handleBack = () => {
    triggerClick();
    setScene("main_hub");
  };

  return (
    <div className="flex flex-col justify-center items-center w-full min-h-screen bg-[#050508] text-text-primary px-6 py-8 relative overflow-hidden select-none font-sans animate-[fadeIn_0.4s_ease-out]">
      
      <div className="max-w-4xl w-full flex flex-col space-y-8 z-10">
        
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
          <span>AREA: SKILLS</span>
        </div>

        {/* Title Block */}
        <div className="space-y-1">
          <h1 className="text-2xl font-mono tracking-wider text-white uppercase">SKILLS</h1>
          <p className="text-[10px] font-mono text-[#7a55ff] uppercase tracking-widest">LEVEL 3</p>
        </div>

        {/* Skills Layout Grid (Left: Skill Meters, Right: XP/Unlocks) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start pt-2">
          
          {/* Left Column (3/5 Width): Skill Meters */}
          <div className="md:col-span-3 space-y-4">
            {skills.map((skill, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#a3a3c2] uppercase font-bold">{skill.name}</span>
                  <span className="text-[#8a8a9d]">LVL {skill.level}</span>
                </div>
                {/* Pixelated meter container */}
                <div className="w-full h-4 bg-[#0f0f16] border border-[#20202e] rounded p-0.5 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#7a55ff] to-[#8866ff] rounded transition-all duration-500"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Right Column (2/5 Width): XP Status & Unlocks */}
          <div className="md:col-span-2 space-y-6">
            
            {/* XP Box */}
            <div className="p-5 bg-[#0c0c12] border border-[#20202e] rounded space-y-3">
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-[#8a8a9d] uppercase tracking-wider block">CURRENT XP</span>
                <span className="text-base font-mono font-bold text-white block">650 / 1000</span>
              </div>
              <div className="w-full h-3 bg-[#0f0f16] border border-[#20202e] rounded-full overflow-hidden p-0.5">
                <div className="h-full bg-[#7a55ff] rounded-full" style={{ width: "65%" }} />
              </div>
            </div>

            {/* Unlocks List */}
            <div className="p-5 bg-[#0c0c12] border border-[#20202e] rounded space-y-4">
              <span className="text-[9px] font-mono text-[#8a8a9d] uppercase tracking-wider block border-b border-[#20202e] pb-2">
                UNLOCKS
              </span>
              
              <div className="space-y-3">
                {unlocks.map((unlock, idx) => (
                  <div key={idx} className="flex items-center space-x-3 text-xs text-[#a3a3c2]">
                    <Star size={12} className="text-[#7a55ff] fill-[#7a55ff]/10 shrink-0" />
                    <span className="font-mono uppercase text-[11px] tracking-wide">{unlock}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default SkillsScene;
