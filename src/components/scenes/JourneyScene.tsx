"use client";

import React, { useState } from "react";
import { usePortfolio } from "@/context/PortfolioState";
import { playCheckpointSound } from "@/utils/synth";
import { ArrowLeft, X, Code, Monitor, Zap, GraduationCap, Laptop, Brain, HelpCircle } from "lucide-react";

interface Milestone {
  level: number;
  title: string;
  subtitle: string;
  date: string;
  description: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

export const JourneyScene: React.FC = () => {
  const { setScene, triggerHover, triggerClick, unlockAchievement } = usePortfolio();
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  const milestones: Milestone[] = [
    {
      level: 1,
      title: "Started Programming",
      subtitle: "First Line of Code",
      date: "2021",
      description: "Discovered the terminal console, compiled basic hello-world applications, and learned logic variables.",
      icon: Code
    },
    {
      level: 2,
      title: "Learned HTML/CSS",
      subtitle: "Visual Web Discovery",
      date: "2022",
      description: "Learned semantic document elements and styled visual responsive wireframe mockups.",
      icon: Monitor
    },
    {
      level: 3,
      title: "Discovered JavaScript",
      subtitle: "Dynamic Page Control",
      date: "2022",
      description: "Mastered ES6 features, callback queues, event routing, and DOM manipulation.",
      icon: Zap
    },
    {
      level: 4,
      title: "Entered College",
      subtitle: "Collaborative Acceleration",
      date: "2023",
      description: "Began formal computer science courses, joined developer study circles, and ran terminal CLI tools.",
      icon: GraduationCap
    },
    {
      level: 5,
      title: "Built Projects",
      subtitle: "Full-Stack Integrations",
      date: "2024",
      description: "Constructed comprehensive database-driven web platforms using React, Node.js, and APIs.",
      icon: Laptop
    },
    {
      level: 6,
      title: "Exploring AI",
      subtitle: "Intelligent Agent Pipelines",
      date: "2026",
      description: "Integrating neural models, context vector parameters, and multi-agent pipelines.",
      icon: Brain
    },
    {
      level: 7,
      title: "Future Loading...",
      subtitle: "Next Major Milestone",
      date: "Ongoing",
      description: "Scaling ventures, mastering advanced systems, and constructing tomorrow's tech.",
      icon: HelpCircle
    }
  ];

  const handleBack = () => {
    triggerClick();
    setScene("main_hub");
  };

  const handleViewAchievements = () => {
    triggerClick();
    setScene("achievements");
  };

  const openMilestone = (m: Milestone) => {
    triggerClick();
    playCheckpointSound();
    setSelectedMilestone(m);
    unlockAchievement("continuous_learner");
  };

  const closeMilestone = () => {
    triggerClick();
    setSelectedMilestone(null);
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
          
          <button 
            onClick={handleViewAchievements}
            onMouseEnter={triggerHover}
            className="hover:text-white transition-colors cursor-pointer"
          >
            VIEW ACHIEVEMENTS →
          </button>
        </div>

        {/* Title Block */}
        <div className="space-y-1">
          <h1 className="text-2xl font-mono tracking-wider text-white uppercase">JOURNEY</h1>
          <p className="text-[10px] font-mono text-[#7a55ff] uppercase tracking-widest">LEVEL 4</p>
        </div>

        {/* Horizontal Level Map Layout */}
        <div className="py-10 relative w-full flex flex-col justify-center items-center">
          
          {/* Horizontal connecting track line */}
          <div className="absolute w-full h-[2px] bg-[#20202e] z-0" style={{ top: "35px" }} />

          {/* Connected Grid of Level Nodes */}
          <div className="grid grid-cols-2 sm:grid-cols-7 gap-6 w-full relative z-10">
            {milestones.map((m) => {
              const Icon = m.icon;
              const isFuture = m.level === 7;
              
              return (
                <div 
                  key={m.level}
                  onClick={() => openMilestone(m)}
                  onMouseEnter={triggerHover}
                  className="flex flex-col items-center text-center cursor-pointer group space-y-3"
                >
                  
                  {/* Pin Node circle */}
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                    isFuture 
                      ? "border-dashed border-[#20202e] bg-[#0c0c12] text-[#8a8a9d]" 
                      : "border-[#7a55ff] bg-[#11111d] text-[#7a55ff] group-hover:bg-[#7a55ff] group-hover:text-white group-hover:scale-110 shadow-[0_0_10px_rgba(122,85,255,0.15)]"
                  }`}>
                    <Icon size={18} />
                  </div>

                  {/* Level details */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-[#8a8a9d] block">LEVEL {m.level}</span>
                    <h3 className="text-[10px] font-mono font-bold tracking-wide text-white uppercase leading-normal">
                      {m.title}
                    </h3>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Quote Card */}
        <div className="bg-[#0c0c12]/90 border border-[#20202e] p-6 rounded-md text-center max-w-2xl mx-auto w-full space-y-2">
          <p className="text-sm italic text-[#a3a3c2]">
            "The journey of a builder is never ending. Keep learning. Keep building. Keep growing."
          </p>
          <span className="text-[10px] font-mono text-[#7a55ff] tracking-widest block">- SHIVAM SINGH</span>
        </div>

      </div>

      {/* Modal Detail Overlay HUD */}
      {selectedMilestone && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-6 select-none animate-[fadeIn_0.2s_ease-out]">
          <div className="max-w-md w-full bg-[#0c0c12] border-2 border-[#7a55ff] rounded p-6 space-y-6 relative shadow-[0_0_30px_rgba(122,85,255,0.2)]">
            
            {/* Close Button */}
            <button 
              onClick={closeMilestone}
              onMouseEnter={triggerHover}
              className="absolute top-4 right-4 p-1 bg-[#111116] border border-[#20202e] rounded text-[#8a8a9d] hover:text-white cursor-pointer"
            >
              <X size={12} />
            </button>

            {/* Modal Header */}
            <div className="space-y-1 border-b border-[#20202e] pb-4">
              <span className="text-[9px] font-mono text-[#7a55ff] tracking-widest uppercase block">
                JOURNAL LEVEL {selectedMilestone.level}
              </span>
              <h2 className="text-lg font-mono font-bold text-white uppercase">{selectedMilestone.title}</h2>
              <p className="text-[10px] text-[#8a8a9d] font-mono mt-0.5">{selectedMilestone.subtitle} ({selectedMilestone.date})</p>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-[#8a8a9d] uppercase block">LOG ARCHIVE:</span>
              <p className="text-xs text-[#a3a3c2] leading-relaxed font-sans">{selectedMilestone.description}</p>
            </div>

            {/* Close CTA */}
            <button
              onClick={closeMilestone}
              onMouseEnter={triggerHover}
              className="glow-btn w-full py-2 bg-[#111116] text-center block"
            >
              DISMISS LOG
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default JourneyScene;
