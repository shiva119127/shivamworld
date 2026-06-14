"use client";

import React, { useState, useEffect } from "react";
import { usePortfolio, Scene } from "@/context/PortfolioState";
import { User, Scroll, Zap, Compass, Mail } from "lucide-react";

interface MenuItem {
  id: Scene;
  title: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

export const MainHubScene: React.FC = () => {
  const { setScene, triggerHover, triggerClick } = usePortfolio();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const menuItems: MenuItem[] = [
    {
      id: "about",
      title: "ABOUT",
      label: "Origin Story",
      description: "Know my story",
      icon: User
    },
    {
      id: "projects",
      title: "PROJECTS",
      label: "Quest Log",
      description: "See what I'm building",
      icon: Scroll
    },
    {
      id: "skills",
      title: "SKILLS",
      label: "Ability Tree",
      description: "My technical powers",
      icon: Zap
    },
    {
      id: "journey",
      title: "JOURNEY",
      label: "Adventure Path",
      description: "The path so far",
      icon: Compass
    },
    {
      id: "contact",
      title: "CONTACT",
      label: "Communication Portal",
      description: "Let's build together",
      icon: Mail
    }
  ];

  // Enable keyboard arrow-key navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let nextIndex = selectedIndex;

      if (e.key === "ArrowRight") {
        nextIndex = (selectedIndex + 1) % menuItems.length;
        triggerHover();
      } else if (e.key === "ArrowLeft") {
        nextIndex = (selectedIndex - 1 + menuItems.length) % menuItems.length;
        triggerHover();
      } else if (e.key === "ArrowDown") {
        // Jump down from top row (0,1,2) to bottom row (3,4)
        if (selectedIndex < 3) {
          nextIndex = Math.min(4, selectedIndex + 3);
        }
        triggerHover();
      } else if (e.key === "ArrowUp") {
        // Jump up from bottom row (3,4) to top row (0,1,2)
        if (selectedIndex >= 3) {
          nextIndex = selectedIndex - 3;
        }
        triggerHover();
      } else if (e.key === "Enter") {
        triggerClick();
        setScene(menuItems[selectedIndex].id);
        return;
      } else {
        return;
      }

      setSelectedIndex(nextIndex);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, triggerHover, triggerClick, setScene, menuItems]);

  const handleCardClick = (index: number, id: Scene) => {
    triggerClick();
    setSelectedIndex(index);
    setScene(id);
  };

  return (
    <div className="flex flex-col justify-between w-full h-screen bg-[#050508] text-text-primary px-6 py-6 relative overflow-hidden select-none font-sans">
      
      {/* Top HUD Stats bar */}
      <div className="flex justify-between items-center z-10 text-[10px] font-mono text-[#8a8a9d] uppercase tracking-wider border-b border-[#20202e] pb-3">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>PLAYER: SHIVAM</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>LVL 1 FOUNDER</span>
          <div className="flex items-center space-x-2">
            <span>XP 0 / 1000</span>
            <div className="w-24 h-2 bg-[#0f0f16] border border-[#20202e] rounded-full overflow-hidden p-0.5">
              <div className="h-full bg-[#7a55ff] rounded-full" style={{ width: "35%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Hub Menu Body */}
      <div className="flex-1 flex flex-col justify-center items-center max-w-4xl w-full mx-auto space-y-12 z-10">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-mono tracking-widest text-white">
            SHIVAM'S WORLD
          </h1>
          <p className="text-xs font-mono tracking-widest text-[#7a55ff] uppercase">
            EXPLORE. LEARN. BUILD. GROW.
          </p>
        </div>

        {/* 3-Top / 2-Bottom Grid Container */}
        <div className="w-full flex flex-col space-y-4">
          {/* Top Row: About, Projects, Skills */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {menuItems.slice(0, 3).map((item, index) => {
              const Icon = item.icon;
              const isSelected = selectedIndex === index;

              return (
                <div
                  key={item.id}
                  onClick={() => handleCardClick(index, item.id)}
                  onMouseEnter={() => {
                    triggerHover();
                    setSelectedIndex(index);
                  }}
                  className={`game-card p-5 rounded cursor-pointer transition-all duration-150 flex flex-col items-center justify-center text-center text-xs ${
                    isSelected ? "border-[#7a55ff] bg-[#11111d] shadow-[0_0_15px_rgba(122,85,255,0.15)] scale-102" : "border-[#20202e] bg-[#0c0c12]/80"
                  }`}
                >
                  <Icon className={`mb-3 ${isSelected ? "text-[#7a55ff]" : "text-[#8a8a9d]"}`} size={20} />
                  <h3 className={`font-mono text-sm tracking-widest ${isSelected ? "text-white" : "text-[#a3a3c2]"}`}>
                    {item.title}
                  </h3>
                  <p className="text-[10px] text-[#8a8a9d] mt-1.5 font-sans uppercase">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Bottom Row: Journey, Contact (centered width) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto w-full">
            {menuItems.slice(3, 5).map((item, idx) => {
              const index = idx + 3;
              const Icon = item.icon;
              const isSelected = selectedIndex === index;

              return (
                <div
                  key={item.id}
                  onClick={() => handleCardClick(index, item.id)}
                  onMouseEnter={() => {
                    triggerHover();
                    setSelectedIndex(index);
                  }}
                  className={`game-card p-5 rounded cursor-pointer transition-all duration-150 flex flex-col items-center justify-center text-center text-xs ${
                    isSelected ? "border-[#7a55ff] bg-[#11111d] shadow-[0_0_15px_rgba(122,85,255,0.15)] scale-102" : "border-[#20202e] bg-[#0c0c12]/80"
                  }`}
                >
                  <Icon className={`mb-3 ${isSelected ? "text-[#7a55ff]" : "text-[#8a8a9d]"}`} size={20} />
                  <h3 className={`font-mono text-sm tracking-widest ${isSelected ? "text-white" : "text-[#a3a3c2]"}`}>
                    {item.title}
                  </h3>
                  <p className="text-[10px] text-[#8a8a9d] mt-1.5 font-sans uppercase">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Bottom Floor Platform & Standing Character Sprite */}
      <div className="w-full flex flex-col items-center z-10 border-t border-[#20202e] pt-4">
        
        {/* Floor platform */}
        <div className="w-full h-1 bg-[#20202e] mb-4 relative">
          {/* Character standing in the center */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <img 
              src="/character.png" 
              alt="Standing Sprite" 
              className="h-16 object-contain" 
              style={{ imageRendering: "pixelated" }}
            />
          </div>
        </div>

        {/* Console Keyboard prompt indicators */}
        <div className="w-full max-w-4xl flex justify-between items-center text-[10px] font-mono text-[#8a8a9d] uppercase tracking-widest">
          <div>Use arrow keys to navigate</div>
          <div className="flex space-x-1">
            <span className="border border-[#20202e] px-2 py-0.5 rounded bg-[#0c0c12]">↑</span>
            <span className="border border-[#20202e] px-2 py-0.5 rounded bg-[#0c0c12]">↓</span>
            <span className="border border-[#20202e] px-2 py-0.5 rounded bg-[#0c0c12]">←</span>
            <span className="border border-[#20202e] px-2 py-0.5 rounded bg-[#0c0c12]">→</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default MainHubScene;
