"use client";

import React, { useState } from "react";
import { usePortfolio } from "@/context/PortfolioState";
import { ArrowLeft, Trophy, Award, BookOpen, Heart, X } from "lucide-react";

interface Achievement {
  id: string;
  name: string;
  requirement: string;
  description: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

export const AchievementsScene: React.FC = () => {
  const { setScene, unlockedAchievements, triggerHover, triggerClick } = usePortfolio();
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const achievements: Achievement[] = [
    {
      id: "founder_mindset",
      name: "FOUNDER MINDSET",
      requirement: "Started the journey as a founder",
      description: "Successfully researched and conceived a marketplace B2B SaaS platform to bridge creator-brand collaborations.",
      icon: Trophy
    },
    {
      id: "built_real_projects",
      name: "BUILT REAL PROJECTS",
      requirement: "Created impactful real-world projects",
      description: "Coded dynamic database-driven applications using production-ready TypeScript, React, and server frameworks.",
      icon: Award
    },
    {
      id: "continuous_learner",
      name: "CONTINUOUS LEARNER",
      requirement: "Always learning new technologies",
      description: "Mastered fundamental concepts in Java, DSA, Web Stack, and AI agent frameworks.",
      icon: BookOpen
    },
    {
      id: "startup_builder",
      name: "IMPACT FOCUSED",
      requirement: "Passionate about creating impact",
      description: "Committed to building software that solves market problems and drives real-world user engagement.",
      icon: Heart
    }
  ];

  const handleBack = () => {
    triggerClick();
    setScene("journey");
  };

  const handleBackHub = () => {
    triggerClick();
    setScene("main_hub");
  };

  const viewDetails = (ach: Achievement, isUnlocked: boolean) => {
    triggerClick();
    if (isUnlocked) {
      setSelectedAchievement(ach);
    }
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
            <span>BACK TO JOURNEY</span>
          </button>
          
          <button 
            onClick={handleBackHub}
            onMouseEnter={triggerHover}
            className="hover:text-white transition-colors cursor-pointer"
          >
            BACK TO HUB
          </button>
        </div>

        {/* Title Block */}
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-mono tracking-wider text-white uppercase">ACHIEVEMENTS</h1>
          <p className="text-[10px] font-mono text-[#7a55ff] uppercase tracking-widest">LEVEL 5</p>
        </div>

        {/* Achievements Grid (4 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {achievements.map((ach) => {
            const isUnlocked = unlockedAchievements.includes(ach.id) || true; // Set true for display representation
            const Icon = ach.icon;

            return (
              <div 
                key={ach.id}
                onClick={() => viewDetails(ach, isUnlocked)}
                onMouseEnter={triggerHover}
                className={`p-5 rounded border flex flex-col items-center text-center justify-between cursor-pointer transition-all duration-150 ${
                  isUnlocked 
                    ? "border-[#7a55ff] bg-[#11111d] hover:shadow-[0_0_15px_rgba(122,85,255,0.15)] hover:scale-102" 
                    : "border-[#20202e] bg-[#0c0c12]/40 opacity-50"
                }`}
              >
                {/* Shield badge badge */}
                <div className="w-16 h-16 rounded-full border-2 border-[#7a55ff]/80 bg-[#0c0c12] flex items-center justify-center text-[#7a55ff] mb-4">
                  <Icon size={24} />
                </div>

                <div className="space-y-1 w-full flex-1 flex flex-col justify-between">
                  <h3 className="text-xs font-mono font-bold tracking-wide text-white uppercase leading-normal">
                    {ach.name}
                  </h3>
                  <p className="text-[10px] text-[#8a8a9d] font-sans leading-normal uppercase mt-2">
                    {ach.requirement}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Status bar */}
        <div className="text-center text-[10px] font-mono text-[#8a8a9d] uppercase tracking-widest pt-2">
          Achievements Unlocked: 4 / 4
        </div>

      </div>

      {/* Modal Detail Overlay HUD */}
      {selectedAchievement && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-6 select-none animate-[fadeIn_0.2s_ease-out]">
          <div className="max-w-md w-full bg-[#0c0c12] border-2 border-[#7a55ff] rounded p-6 space-y-6 relative shadow-[0_0_35px_rgba(122,85,255,0.2)]">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedAchievement(null)}
              onMouseEnter={triggerHover}
              className="absolute top-4 right-4 p-1 bg-[#111116] border border-[#20202e] rounded text-[#8a8a9d] hover:text-white cursor-pointer"
            >
              <X size={12} />
            </button>

            {/* Modal Header */}
            <div className="space-y-1 border-b border-[#20202e] pb-4">
              <span className="text-[9px] font-mono text-[#7a55ff] tracking-widest uppercase block">
                UNLOCKED ACHIEVEMENT
              </span>
              <h2 className="text-lg font-mono font-bold text-white uppercase">{selectedAchievement.name}</h2>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-[#8a8a9d] uppercase block">RECORDED ARCHIVE:</span>
              <p className="text-xs text-[#a3a3c2] leading-relaxed font-sans">{selectedAchievement.description}</p>
            </div>

            {/* Close CTA */}
            <button
              onClick={() => setSelectedAchievement(null)}
              onMouseEnter={triggerHover}
              className="glow-btn w-full py-2 bg-[#111116] text-center block"
            >
              DISMISS TROPHY
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default AchievementsScene;
