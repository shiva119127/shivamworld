"use client";

import React, { useState } from "react";
import { usePortfolio } from "@/context/PortfolioState";
import { playMissionSound } from "@/utils/synth";
import { ArrowLeft, ExternalLink } from "lucide-react";

interface OtherProject {
  title: string;
  desc: string;
  tech: string;
  link: string;
}

export const ProjectsScene: React.FC = () => {
  const { setScene, triggerHover, triggerClick, unlockAchievement } = usePortfolio();
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  const otherProjects: OtherProject[] = [
    {
      title: "Portfolio Website",
      desc: "Personal portfolio built with passion",
      tech: "Next.js // TS",
      link: "#"
    },
    {
      title: "StudyMate",
      desc: "A student productivity web application",
      tech: "React // Express",
      link: "#"
    },
    {
      title: "CodeSnippets",
      desc: "A collection of useful code & resources",
      tech: "HTML // CSS",
      link: "#"
    }
  ];

  const handleBack = () => {
    triggerClick();
    setScene("main_hub");
  };

  const handleViewFeatured = () => {
    triggerClick();
    playMissionSound();
    unlockAchievement("founder_mindset");
    unlockAchievement("built_real_projects");
    // Open project link
    window.open("https://github.com/shiva119127/collabkaro", "_blank");
  };

  const handleViewOther = (proj: OtherProject) => {
    triggerClick();
    playMissionSound();
    unlockAchievement("built_real_projects");
  };

  return (
    <div className="flex flex-col justify-center items-center w-full min-h-screen bg-[#050508] text-text-primary px-6 py-8 relative overflow-hidden select-none font-sans animate-[fadeIn_0.4s_ease-out]">
      
      <div className="max-w-5xl w-full flex flex-col space-y-6 z-10">
        
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
          <span>AREA: PROJECTS</span>
        </div>

        {/* Title Block */}
        <div className="space-y-1">
          <h1 className="text-2xl font-mono tracking-wider text-white uppercase">PROJECTS</h1>
          <p className="text-[10px] font-mono text-[#7a55ff] uppercase tracking-widest">LEVEL 2</p>
        </div>

        {/* Featured Project Layout (Left Details, Right Laptop Image) */}
        <div className="p-6 bg-[#0c0c12]/85 border border-[#20202e] rounded-md grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* Details Column */}
          <div className="space-y-5">
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-[#8a8a9d] uppercase tracking-widest block">FEATURED PROJECT</span>
              <h2 className="text-2xl font-mono font-bold text-white flex items-center space-x-2">
                <span className="text-[#7a55ff] font-bold">●</span> <span>CollabKaro</span>
              </h2>
            </div>
            
            <p className="text-xs text-[#a3a3c2] leading-relaxed font-sans">
              A platform that connects brands with content creators for seamless collaborations.
            </p>

            <div className="flex flex-wrap gap-3 items-center">
              <span className="text-[9px] font-mono px-3 py-1 bg-[#11111d] text-[#7a55ff] border border-[#7a55ff]/40 rounded-full font-bold">
                STATUS: ACTIVE
              </span>
              
              <button
                onClick={handleViewFeatured}
                onMouseEnter={triggerHover}
                className="text-[9px] font-mono px-4 py-1.5 bg-[#0c0c12] border border-[#20202e] rounded text-white hover:border-[#7a55ff] hover:bg-[#151524] transition-all flex items-center space-x-1 cursor-pointer"
              >
                <span>VIEW PROJECT</span>
                <ExternalLink size={10} />
              </button>
            </div>
          </div>

          {/* Laptop Column */}
          <div className="flex justify-center items-center">
            <img 
              src="/laptop.png" 
              alt="CollabKaro Laptop Preview" 
              className="max-h-48 object-contain"
              style={{ imageRendering: "pixelated" }}
            />
          </div>

        </div>

        {/* Other Projects Panel */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-mono text-[#8a8a9d] uppercase tracking-widest">OTHER PROJECTS</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {otherProjects.map((proj, idx) => {
              const isHovered = hoveredProject === proj.title;
              return (
                <div
                  key={idx}
                  onClick={() => handleViewOther(proj)}
                  onMouseEnter={() => {
                    triggerHover();
                    setHoveredProject(proj.title);
                  }}
                  onMouseLeave={() => setHoveredProject(null)}
                  className={`p-4 bg-[#0c0c12]/70 border rounded cursor-pointer transition-all duration-150 flex flex-col justify-between ${
                    isHovered ? "border-[#7a55ff] bg-[#11111d] shadow-[0_0_10px_rgba(122,85,255,0.1)] translate-y-[-2px]" : "border-[#20202e]"
                  }`}
                >
                  <div className="space-y-1">
                    <h4 className={`text-xs font-mono font-bold uppercase ${isHovered ? "text-white" : "text-[#a3a3c2]"}`}>
                      {proj.title}
                    </h4>
                    <p className="text-[10px] text-[#8a8a9d] font-sans leading-relaxed">
                      {proj.desc}
                    </p>
                  </div>
                  <div className="text-[9px] font-mono text-[#7a55ff] pt-3 uppercase">
                    {proj.tech}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="text-center text-[9px] font-mono text-[#8a8a9d]/50 uppercase tracking-widest pt-2">
            More projects coming soon...
          </div>
        </div>

      </div>

    </div>
  );
};

export default ProjectsScene;
