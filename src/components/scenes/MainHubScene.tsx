"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePortfolio, Scene } from "@/context/PortfolioState";
import { 
  Volume2, 
  VolumeX, 
  Settings, 
  Lock, 
  User, 
  Scroll, 
  Zap, 
  Compass, 
  Trophy, 
  Mail, 
  HelpCircle,
  Shield,
  MousePointerClick,
  Info
} from "lucide-react";
import { 
  playClickSound, 
  playHoverSound, 
  playMissionSound, 
  playCheckpointSound, 
  playAchievementUnlock, 
  playPortalAmbience, 
  playUnlockSound 
} from "@/utils/synth";

interface Destination {
  id: Scene;
  name: string;
  purpose: string;
  x: number;
  y: number;
  visualName: string;
  description: string;
  detailLabel?: string;
  detailValue?: string;
}

export const MainHubScene: React.FC = () => {
  const { setScene, volume, changeVolume, muted, toggleMute, visitedScenes, resetProgress } = usePortfolio();

  // Navigation states
  const [hoveredDest, setHoveredDest] = useState<Destination | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [transitioningTo, setTransitioningTo] = useState<Destination | null>(null);
  
  // Settings Dropdown State
  const [showSettings, setShowSettings] = useState(false);

  // Map panning & zooming states
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isZooming, setIsZooming] = useState(false);
  const zoomTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Set initial zoom on mount
  useEffect(() => {
    const initialScale = Math.min(window.innerWidth / 1000, window.innerHeight / 600) * 0.9;
    setZoom(Math.max(0.7, Math.min(1.1, initialScale)));
  }, []);

  // Cleanup zoom timeout
  useEffect(() => {
    return () => {
      if (zoomTimeoutRef.current) {
        clearTimeout(zoomTimeoutRef.current);
      }
    };
  }, []);

  // Lock rule: achievements is locked until user visits Ascent Trail (journey)
  const isAchievementsLocked = !visitedScenes.includes("journey");

  const destinations: Destination[] = [
    {
      id: "about",
      name: "ORIGIN FOREST",
      purpose: "About",
      x: 230,
      y: 200,
      visualName: "forest",
      description: "Know my story and background."
    },
    {
      id: "projects",
      name: "QUEST CITADEL",
      purpose: "Projects",
      x: 500,
      y: 110,
      visualName: "citadel",
      description: "Explore my products and missions.",
      detailLabel: "Main Mission",
      detailValue: "CollabKaro"
    },
    {
      id: "skills",
      name: "INNOVATION LAB",
      purpose: "Skills",
      x: 770,
      y: 200,
      visualName: "lab",
      description: "Explore my technical abilities."
    },
    {
      id: "journey",
      name: "ASCENT TRAIL",
      purpose: "Journey",
      x: 280,
      y: 430,
      visualName: "trail",
      description: "Walk through my growth journey."
    },
    {
      id: "achievements",
      name: "HALL OF LEGENDS",
      purpose: "Achievements",
      x: 500,
      y: 490,
      visualName: "legends",
      description: "View my unlocked achievements."
    },
    {
      id: "contact",
      name: "CONNECTION PORTAL",
      purpose: "Contact",
      x: 720,
      y: 430,
      visualName: "portal",
      description: "Let's build something amazing together."
    }
  ];

  // Center camera dynamically on mount, target change, or window resize
  useEffect(() => {
    const updateCamera = () => {
      if (transitioningTo) {
        const scaleVal = 1.8;
        setZoom(scaleVal);
        setPan({
          x: -transitioningTo.x * scaleVal + window.innerWidth / 2,
          y: -transitioningTo.y * scaleVal + window.innerHeight / 2
        });
      } else {
        // Keep the map fixed at the center of the window
        setPan({
          x: window.innerWidth / 2 - 500,
          y: window.innerHeight / 2 - 300
        });
      }
    };

    window.addEventListener("resize", updateCamera);
    updateCamera();

    return () => window.removeEventListener("resize", updateCamera);
  }, [transitioningTo]);

  // Keyboard navigation mappings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (transitioningTo) return;

      if (e.key === "ArrowRight") {
        const nextIdx = (selectedIndex + 1) % destinations.length;
        setSelectedIndex(nextIdx);
        setHoveredDest(destinations[nextIdx]);
        playHoverSound();
      } else if (e.key === "ArrowLeft") {
        const nextIdx = (selectedIndex - 1 + destinations.length) % destinations.length;
        setSelectedIndex(nextIdx);
        setHoveredDest(destinations[nextIdx]);
        playHoverSound();
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        handleNodeClick(destinations[selectedIndex]);
      } else if (e.key === "Escape") {
        setHoveredDest(null);
        setSelectedIndex(-1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, transitioningTo]);

  // Mouse wheel zoom support
  const handleWheel = (e: WheelEvent) => {
    if (transitioningTo) return;
    e.preventDefault();

    setIsZooming(true);
    if (zoomTimeoutRef.current) {
      clearTimeout(zoomTimeoutRef.current);
    }
    zoomTimeoutRef.current = setTimeout(() => {
      setIsZooming(false);
    }, 150);

    const zoomIntensity = 0.08;
    const zoomFactor = e.deltaY < 0 ? (1 + zoomIntensity) : (1 - zoomIntensity);
    setZoom((prevZoom) => {
      const newZoom = prevZoom * zoomFactor;
      return Math.max(0.5, Math.min(2.5, newZoom));
    });
  };

  useEffect(() => {
    const wrapper = mapWrapperRef.current;
    if (wrapper) {
      wrapper.addEventListener("wheel", handleWheel, { passive: false });
    }
    return () => {
      if (wrapper) {
        wrapper.removeEventListener("wheel", handleWheel);
      }
    };
  }, [transitioningTo]);

  // Node interaction triggers
  const handleNodeHover = (dest: Destination | null, index: number) => {
    if (transitioningTo) return;
    if (hoveredDest?.id === dest?.id) return;
    setHoveredDest(dest);
    setSelectedIndex(index);
    if (dest) {
      playHoverSound();
    }
  };

  const handleNodeClick = (dest: Destination) => {
    if (transitioningTo) return;
    
    // Check lock constraint
    if (dest.id === "achievements" && isAchievementsLocked) {
      playClickSound();
      return;
    }

    setTransitioningTo(dest);
    playClickSound();

    // Trigger destination-specific soundscape
    setTimeout(() => {
      switch (dest.id) {
        case "about":
          playPortalAmbience();
          break;
        case "projects":
          playMissionSound();
          break;
        case "skills":
          playUnlockSound();
          break;
        case "journey":
          playCheckpointSound();
          break;
        case "achievements":
          playAchievementUnlock();
          break;
        case "contact":
          playPortalAmbience();
          break;
      }
    }, 150);

    // Transition to scene after camera focuses and title reveals
    setTimeout(() => {
      setScene(dest.id);
    }, 1200);
  };

  const getDestinationIcon = (visualName: string, active: boolean) => {
    const strokeColor = active ? "#ffffff" : "#a3a3a3";
    const size = 13;

    switch (visualName) {
      case "forest": return <User className="text-[#10b981]" size={size} />;
      case "citadel": return <Shield className="text-[#ef4444]" size={size} />;
      case "lab": return <Zap className="text-[#3b82f6]" size={size} />;
      case "trail": return <Compass className="text-[#f97316]" size={size} />;
      case "legends": return <Trophy className="text-[#eab308]" size={size} />;
      case "portal": return <Mail className="text-[#8b5cf6]" size={size} />;
      default: return <HelpCircle size={size} />;
    }
  };

  const mapWrapperRef = useRef<HTMLDivElement>(null);

  // Colors dictionary matching mockup theme guidelines
  const themeColors: Record<string, { border: string, bg: string, text: string, glow: string, color: string }> = {
    forest: { border: "border-[#10b981]/50", bg: "bg-[#10b981]/5", text: "text-[#10b981]", glow: "shadow-[0_0_15px_rgba(16,185,129,0.15)]", color: "#10b981" },
    citadel: { border: "border-[#ef4444]/50", bg: "bg-[#ef4444]/5", text: "text-[#ef4444]", glow: "shadow-[0_0_15px_rgba(239,68,68,0.15)]", color: "#ef4444" },
    lab: { border: "border-[#3b82f6]/50", bg: "bg-[#3b82f6]/5", text: "text-[#3b82f6]", glow: "shadow-[0_0_15px_rgba(59,130,246,0.15)]", color: "#3b82f6" },
    trail: { border: "border-[#f97316]/50", bg: "bg-[#f97316]/5", text: "text-[#f97316]", glow: "shadow-[0_0_15px_rgba(249,115,22,0.15)]", color: "#f97316" },
    legends: { border: "border-[#eab308]/50", bg: "bg-[#eab308]/5", text: "text-[#eab308]", glow: "shadow-[0_0_15px_rgba(234,179,8,0.15)]", color: "#eab308" },
    portal: { border: "border-[#8b5cf6]/50", bg: "bg-[#8b5cf6]/5", text: "text-[#8b5cf6]", glow: "shadow-[0_0_15px_rgba(139,92,246,0.15)]", color: "#8b5cf6" },
  };

  return (
    <div 
      ref={mapWrapperRef}
      className="relative w-full h-screen overflow-hidden bg-[#020204] select-none text-white font-sans"
    >
      {/* Background stars / slow moving drift fog */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(40,40,40,0.15)_0%,transparent_70%)] pointer-events-none z-0" />
      <div 
        style={{ willChange: "transform, opacity" }}
        className="absolute inset-0 bg-[url('/loading_bg.png')] bg-cover opacity-5 pointer-events-none map-drift z-0" 
      />

      {/* Map Content Layer with smooth zoom transitions */}
      <div 
        style={{
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
          transition: isZooming ? "none" : "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
          transformOrigin: "center center",
          willChange: "transform"
        }}
        className="absolute w-[1000px] h-[600px]"
      >
        <svg viewBox="0 0 1000 600" className="w-full h-full pointer-events-none">
          {/* Main High-Fidelity Mockup Map Background Landscape */}
          <image href="/map_bg.jpg" x="0" y="0" width="1000" height="600" opacity="0.85" />

          {/* Background Compass Rose */}
          <g opacity="0.10" pointerEvents="none">
            <circle cx="500" cy="300" r="140" fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="4 8" className="compass-dial-cw" />
            <circle cx="500" cy="300" r="120" fill="none" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="40 10 5 10" className="compass-dial-cw" />
            <circle cx="500" cy="300" r="95" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="12 4" className="compass-dial-ccw" />
            <line x1="500" y1="180" x2="500" y2="420" stroke="#ffffff" strokeWidth="0.5" />
            <line x1="380" y1="300" x2="620" y2="300" stroke="#ffffff" strokeWidth="0.5" />
            <polygon points="500,170 504,185 496,185" fill="#ffffff" />
            <text x="500" y="162" fill="#ffffff" fontSize="9" fontFamily="monospace" textAnchor="middle">N</text>
            <text x="500" y="442" fill="#ffffff" fontSize="9" fontFamily="monospace" textAnchor="middle">S</text>
          </g>

          {/* Background Drifting Clouds */}
          <g opacity="0.05" pointerEvents="none">
            <g className="cloud-drift-1" transform="translate(0, 80)">
              <path d="M 0 20 A 12 12 0 0 1 15 8 A 15 15 0 0 1 40 8 A 12 12 0 0 1 55 20 A 8 8 0 0 1 55 28 Z" fill="#ffffff" />
            </g>
            <g className="cloud-drift-2" transform="translate(0, 240)">
              <path d="M 0 25 A 16 16 0 0 1 20 10 A 20 20 0 0 1 55 10 A 16 16 0 0 1 75 25 A 10 10 0 0 1 75 35 Z" fill="#ffffff" />
            </g>
            <g className="cloud-drift-3" transform="translate(0, 420)">
              <path d="M 0 18 A 10 10 0 0 1 12 7 A 12 12 0 0 1 32 7 A 10 10 0 0 1 42 18 Z" fill="#ffffff" />
            </g>
          </g>

          {/* Paths connecting locations to the central platform */}
          {destinations.map((dest) => {
            const isHovered = hoveredDest?.id === dest.id;
            const isLegendsLocked = dest.id === "achievements" && isAchievementsLocked;
            const theme = themeColors[dest.visualName] || themeColors.forest;

            return (
              <line
                key={`path-${dest.id}`}
                x1="500"
                y1="300"
                x2={dest.x}
                y2={dest.y}
                stroke={isHovered && !isLegendsLocked ? theme.color : "#242424"}
                strokeWidth={isHovered && !isLegendsLocked ? "2" : "1"}
                className={isHovered && !isLegendsLocked ? "path-flow" : ""}
                style={{ transition: "stroke 0.3s ease, stroke-width 0.3s ease", opacity: 0.6 }}
              />
            );
          })}

          {/* Path Energy Sparks */}
          <g pointerEvents="none">
            {destinations.map((dest) => {
              const isLegendsLocked = dest.id === "achievements" && isAchievementsLocked;
              if (isLegendsLocked) return null;
              
              return (
                <circle
                  key={`spark-${dest.id}`}
                  r="2.2"
                  fill="#ffffff"
                  className={`energy-spark spark-${dest.visualName}`}
                  style={{ filter: "drop-shadow(0 0 2px rgba(255,255,255,0.9))" }}
                />
              );
            })}
          </g>

          {/* Central Platform rings */}
          <g transform="translate(500, 300)" pointerEvents="none" opacity="0.8">
            <ellipse cx="0" cy="0" rx="38" ry="16" fill="none" stroke="#333" strokeWidth="1.5" />
            <ellipse cx="0" cy="0" rx="26" ry="10" fill="none" stroke="#fff" strokeWidth="0.6" strokeDasharray="3 3" />
          </g>

          {/* Avatar Sprite Stand and Dragon Pet */}
          <g transform="translate(500, 300)">
            <foreignObject x="-24" y="-52" width="48" height="60" pointerEvents="none">
              <div className="w-full h-full flex items-end justify-center">
                <img
                  src="/character.png"
                  alt="Player Stand Avatar"
                  className="h-11 object-contain select-none"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
            </foreignObject>

            {/* Pixel Dragon Pet */}
            <g transform="translate(18, -14)" pointerEvents="none">
              <polygon points="5,-5 8,-12 7,-4" fill="#f43f5e" className="flutter-wing" style={{ transformOrigin: "5px -4px" }} />
              <path d="M 8 2 Q 13 4 12 0" stroke="#be123c" strokeWidth="1.5" fill="none" />
              <ellipse cx="4" cy="-2" rx="5" ry="3.5" fill="#f43f5e" />
              <circle cx="0" cy="-6" r="2.8" fill="#f43f5e" />
              <circle cx="-1" cy="-7" r="0.5" fill="#000000" />
            </g>
          </g>

          {/* Animated Characters and Map Props */}
          <g pointerEvents="none">
            {/* Origin Forest Spirit (Deer) */}
            <g transform="translate(200, 215)" className="opacity-85">
              <ellipse cx="0" cy="8" rx="8" ry="3" fill="#10b981" opacity="0.2" className="map-pulse" />
              <rect x="-6" y="-3" width="12" height="6" rx="2" fill="#10b981" />
              <line x1="-4" y1="3" x2="-4" y2="8" stroke="#10b981" strokeWidth="1.5" />
              <line x1="-1" y1="3" x2="-1" y2="8" stroke="#10b981" strokeWidth="1.5" />
              <line x1="2" y1="3" x2="2" y2="8" stroke="#10b981" strokeWidth="1.5" />
              <line x1="5" y1="3" x2="5" y2="8" stroke="#10b981" strokeWidth="1.5" />
              <path d="M 4 -2 L 8 -8" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
              <ellipse cx="9" cy="-9" rx="3.5" ry="2" fill="#10b981" />
              <path d="M 8 -11 L 6 -15 M 8 -11 L 10 -15 M 10 -15 L 8 -17 M 6 -15 L 5 -17" stroke="#10b981" strokeWidth="1" strokeLinecap="round" />
              <circle cx="10" cy="-10" r="0.6" fill="#ffffff" />
            </g>

            {/* Quest Citadel Guardian */}
            <g transform="translate(465, 120)" className="opacity-85">
              <ellipse cx="0" cy="10" rx="6" ry="2" fill="#000000" opacity="0.3" />
              <path d="M -5 10 L -4 0 L 4 0 L 5 10 Z" fill="#ef4444" />
              <path d="M -4 2 L 4 2 L 3 9 L -3 9 Z" fill="#374151" />
              <circle cx="0" cy="-3" r="3.5" fill="#4b5563" />
              <rect x="-1" y="-6" width="2" height="3" fill="#ef4444" />
              <path d="M -7 -1 Q -7 6 -3 8 Q 1 6 1 -1 Z" fill="#9ca3af" stroke="#ef4444" strokeWidth="1" transform="translate(6, 2) scale(0.8)" />
              <line x1="-7" y1="-10" x2="-7" y2="12" stroke="#9ca3af" strokeWidth="1.2" />
              <polygon points="-7,-14 -9,-10 -5,-10" fill="#ef4444" />
            </g>

            {/* Quest Citadel Waving Flag */}
            <g transform="translate(530, 85)" className="opacity-85">
              <line x1="0" y1="-25" x2="0" y2="15" stroke="#4b5563" strokeWidth="1.5" />
              <circle cx="0" cy="-26" r="1.5" fill="#f59e0b" />
              <path d="M 0 -24 C 8 -26 12 -20 20 -24 L 20 -14 C 12 -10 8 -16 0 -14 Z" fill="#ef4444" className="waving-flag" />
            </g>

            {/* Innovation Lab Research Drone */}
            <g transform="translate(800, 185)" className="float-lab opacity-85">
              <ellipse cx="0" cy="25" rx="6" ry="1.8" fill="#3b82f6" opacity="0.15" className="map-pulse" />
              <circle cx="0" cy="0" r="7" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="3.5" fill="#3b82f6" opacity="0.75" className="map-flicker" />
              <circle cx="-1" cy="-1" r="1.2" fill="#ffffff" />
              <path d="M -7 0 L -12 -3 L -12 1 Z" fill="#475569" stroke="#3b82f6" strokeWidth="0.8" />
              <path d="M 7 0 L 12 -3 L 12 1 Z" fill="#475569" stroke="#3b82f6" strokeWidth="0.8" />
              <line x1="0" y1="7" x2="0" y2="12" stroke="#3b82f6" strokeWidth="1" />
              <circle cx="0" cy="13" r="0.8" fill="#3b82f6" />
            </g>

            {/* Ascent Trail Campfire */}
            <g transform="translate(315, 415)" className="opacity-85">
              <circle cx="0" cy="4" r="14" fill="#f97316" opacity="0.15" className="map-pulse" />
              <rect x="-8" y="2" width="16" height="3.5" rx="1" fill="#78350f" transform="rotate(-15)" />
              <rect x="-8" y="2" width="16" height="3.5" rx="1" fill="#78350f" transform="rotate(15)" />
              <path d="M -6 2 C -8 -4 0 -12 0 -12 C 0 -12 8 -4 6 2 Z" fill="#f97316" className="map-flicker" />
              <path d="M -3.5 2 C -5 -2 0 -7 0 -7 C 0 -7 5 -2 3.5 2 Z" fill="#eab308" className="map-pulse" />
              <circle cx="-3" cy="-14" r="0.8" fill="#f97316" className="map-flicker" />
              <circle cx="4" cy="-18" r="0.6" fill="#eab308" />
              <circle cx="0" cy="-24" r="0.7" fill="#f97316" />
            </g>

            {/* Connection Portal Wizard */}
            <g transform="translate(685, 440)" className="opacity-85">
              <ellipse cx="0" cy="11" rx="5" ry="1.8" fill="#000000" opacity="0.3" />
              <path d="M -4 11 L -2 -1 Q 0 -5 2 -1 L 4 11 Z" fill="#6d28d9" />
              <path d="M -3 1 L -5 10 L -1 9 Z" fill="#4c1d95" />
              <circle cx="0" cy="-5" r="2.5" fill="#fbcfe8" />
              <polygon points="-1.5,-4 1.5,-4 0,1" fill="#ffffff" />
              <path d="M -3.5 -6.5 L 3.5 -6.5 L 0 -14 Z" fill="#4c1d95" />
              <path d="M -4.5 -6.5 L 4.5 -6.5" stroke="#6d28d9" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="5" y1="-8" x2="5" y2="12" stroke="#78350f" strokeWidth="1" />
              <circle cx="5" cy="-9.5" r="2.2" fill="#8b5cf6" className="map-pulse" />
              <circle cx="5" cy="-9.5" r="1" fill="#ffffff" />
            </g>
          </g>

          {/* Render glowing interactive diamond markers */}
          {destinations.map((dest, index) => {
            const isHovered = hoveredDest?.id === dest.id;
            const isLegendsLocked = dest.id === "achievements" && isAchievementsLocked;
            const theme = themeColors[dest.visualName] || themeColors.forest;

            return (
              <g 
                key={`marker-${dest.id}`}
                transform={`translate(${dest.x}, ${dest.y})`}
                className="pointer-events-auto cursor-pointer"
                style={{ pointerEvents: "auto" }}
                onMouseEnter={() => handleNodeHover(dest, index)}
                onMouseLeave={() => handleNodeHover(null, -1)}
                onClick={() => handleNodeClick(dest)}
              >
                {/* Large invisible hit area for easy hover/click */}
                <circle cx="0" cy="0" r="45" fill="transparent" className="cursor-pointer" />

                {/* Glowing Aura ring on hover */}
                {isHovered && !isLegendsLocked && (
                  <ellipse cx="0" cy="0" rx="20" ry="10" fill="none" stroke={theme.color} strokeWidth="0.8" className="map-pulse" />
                )}

                {/* Rotating/Diamond marker node */}
                <g transform="rotate(45)">
                  <rect 
                    x="-5" 
                    y="-5" 
                    width="10" 
                    height="10" 
                    rx="1" 
                    fill="#050508" 
                    stroke={isLegendsLocked ? "#444" : theme.color} 
                    strokeWidth="1.5" 
                  />
                  {!isLegendsLocked && (
                    <rect x="-2" y="-2" width="4" height="4" fill={theme.color} />
                  )}
                  {isLegendsLocked && (
                    <circle cx="0" cy="0" r="1.2" fill="#888" />
                  )}
                </g>
              </g>
            );
          })}
        </svg>

        {/* Floating Location HUD Description Cards */}
        {destinations.map((dest, idx) => {
          const isHovered = hoveredDest?.id === dest.id;
          const isLegendsLocked = dest.id === "achievements" && isAchievementsLocked;
          const theme = themeColors[dest.visualName] || themeColors.forest;

          return (
            <div
              key={`card-${dest.id}`}
              onMouseEnter={() => handleNodeHover(dest, idx)}
              onMouseLeave={() => handleNodeHover(null, -1)}
              onClick={() => handleNodeClick(dest)}
              className={`absolute z-35 pointer-events-auto cursor-pointer p-3 rounded w-[225px] transition-all duration-300 select-none bg-[#07070a]/92 border backdrop-blur-md flex flex-col space-y-1.5 ${
                isLegendsLocked 
                  ? "opacity-50 hover:opacity-100 border-neutral-800" 
                  : `border-neutral-800/80 hover:border-white ${theme.glow}`
              } ${isHovered && !isLegendsLocked ? "border-white" : ""}`}
              style={{
                left: `${dest.x}px`,
                top: `${dest.y - 12}px`,
                transform: "translate(-50%, -100%)",
              }}
            >
              {/* Header block with Icon, title and category */}
              <div className="flex items-center space-x-2.5 border-b border-neutral-800/40 pb-1.5">
                <div className={`p-1 rounded bg-[#020204]/80 border ${isLegendsLocked ? "border-neutral-800" : theme.border}`}>
                  {getDestinationIcon(dest.visualName, isHovered)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-rajdhani text-xs font-bold tracking-wider text-white truncate uppercase -mb-0.5">
                    {dest.name}
                  </h3>
                  <span className="text-[7.5px] font-mono text-neutral-500 uppercase tracking-widest block">
                    {dest.purpose}
                  </span>
                </div>
                
                {/* Floating Node marker helper inside card header */}
                <div className="w-1.5 h-1.5 rounded-sm transform rotate-45 border" style={{ borderColor: isLegendsLocked ? "#444" : theme.color, backgroundColor: isLegendsLocked ? "transparent" : theme.color }} />
              </div>
              
              {/* Main short description */}
              <p className="text-[9px] text-[#a3a3c2] leading-normal font-sans uppercase">
                {dest.id === "achievements" && isAchievementsLocked 
                  ? "Locked: Complete Ascent Trail to unlock this area."
                  : dest.description
                }
              </p>

              {/* Special Quest details */}
              {dest.detailLabel && !isLegendsLocked && (
                <div className="pt-1 flex justify-between items-center text-[7.5px] font-mono border-t border-neutral-900/60">
                  <span className="text-neutral-500 uppercase">{dest.detailLabel}:</span>
                  <span className={`${theme.text} font-bold uppercase`}>{dest.detailValue}</span>
                </div>
              )}

              {/* Locked Indicator details */}
              {isLegendsLocked && (
                <div className="pt-1 flex items-center space-x-1.5 text-[7px] font-mono text-neutral-500 border-t border-neutral-900/60">
                  <Lock size={7} />
                  <span className="uppercase">Locked Area</span>
                </div>
              )}
            </div>
          );
        })}

        {/* Center platform static builder badge */}
        <div
          className="absolute bg-[#07070a]/92 border border-neutral-800/80 p-2 rounded w-[130px] flex flex-col items-center justify-center text-center select-none backdrop-blur-sm shadow-xl"
          style={{
            left: "500px",
            top: "336px",
            transform: "translateX(-50%)"
          }}
        >
          <span className="font-rajdhani text-[9px] font-bold text-white tracking-widest uppercase -mb-0.5">
            THE BUILDER
          </span>
          <span className="text-[6px] font-sans text-neutral-500 uppercase tracking-wider block">
            Your journey starts here.
          </span>
        </div>
      </div>

      {/* TOP LEFT OVERLAY: Sleek logo banner */}
      <div className="absolute top-6 left-6 z-20 flex items-center space-x-3 select-none pointer-events-none">
        {/* Modern geometric hex logo */}
        <div className="w-8 h-8 rounded border border-neutral-800 bg-[#0c0c12]/60 flex items-center justify-center text-white backdrop-blur-sm">
          <svg className="w-5 h-5 text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div className="flex flex-col">
          <h1 className="text-sm font-mono tracking-[0.25em] text-white font-bold leading-none">SHIVAM'S WORLD</h1>
          <span className="text-[8px] font-mono tracking-[0.2em] text-[#8a8a9d] uppercase mt-1">Explore. Learn. Build. Grow.</span>
        </div>
      </div>

      {/* TOP RIGHT OVERLAY: High-fidelity audio and settings controller */}
      <div className="absolute top-6 right-6 z-20 flex items-center space-x-3.5 bg-[#0a0a0f]/90 border border-neutral-800/80 px-4 py-2 rounded shadow-lg backdrop-blur-md">
        <div className="flex items-center space-x-1.5 text-[9px] font-mono text-neutral-400 font-bold uppercase tracking-wider">
          <span>SOUND</span>
          <button 
            onClick={toggleMute}
            className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
          </button>
        </div>

        {/* ON / OFF Switch toggle */}
        <button
          onClick={toggleMute}
          className={`px-2.5 py-0.5 rounded text-[8px] font-mono font-bold tracking-widest transition-all cursor-pointer ${
            !muted 
              ? "bg-[#eab308] text-black shadow-[0_0_8px_rgba(234,179,8,0.3)]" 
              : "bg-neutral-800 text-neutral-500"
          }`}
        >
          {muted ? "OFF" : "ON"}
        </button>

        {/* Volume slider details */}
        <div className="flex items-center space-x-2.5 border-l border-neutral-800/60 pl-3">
          <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest">VOLUME</span>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.05"
            value={volume}
            onChange={(e) => changeVolume(parseFloat(e.target.value))}
            className="w-16 h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-white"
          />
          <span className="text-[9px] font-mono text-neutral-400 w-6 text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>

        {/* Settings wheel cog */}
        <div className="relative border-l border-neutral-800/60 pl-3 flex items-center">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <Settings size={13} />
          </button>
          
          {showSettings && (
            <div className="absolute right-0 top-6 mt-2 w-32 bg-[#0c0c12] border border-neutral-800 rounded shadow-xl py-1 z-30 text-right animate-[fadeIn_0.1s_ease-out]">
              <button 
                onClick={() => {
                  resetProgress();
                  setShowSettings(false);
                }}
                className="w-full text-right px-3 py-1.5 text-[8.5px] font-mono text-[#a3a3a3] hover:bg-neutral-900 hover:text-white transition-colors block cursor-pointer uppercase tracking-wider"
              >
                Reset Progress
              </button>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM LEFT OVERLAY: Sleek mockup-accurate player card */}
      <div className="absolute bottom-6 left-6 z-20 pointer-events-none select-none">
        <div className="bg-[#0a0a0f]/90 border border-neutral-800/80 p-4 rounded w-[280px] shadow-2xl backdrop-blur-md flex flex-col space-y-3">
          {/* Top row: Avatar picture and name info */}
          <div className="flex items-center space-x-3.5 pb-2.5 border-b border-neutral-800/50">
            {/* Round profile image picture generated */}
            <div className="w-12 h-12 rounded-md border border-neutral-800 overflow-hidden bg-neutral-900 flex-shrink-0">
              <img 
                src="/shivam_avatar.png" 
                alt="Shivam Singh Headshot" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider truncate">Shivam Singh</h2>
              <p className="text-[7.5px] text-neutral-400 font-sans leading-tight mt-0.5 uppercase tracking-wide">
                Student Founder | Developer | Entrepreneur
              </p>
            </div>
          </div>

          {/* Middle row: Active quest status */}
          <div className="flex flex-col space-y-1">
            <span className="text-[7px] font-mono text-neutral-500 uppercase tracking-widest">CURRENT QUEST</span>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[9px] font-mono text-white font-bold tracking-wider uppercase">
                Building CollabKaro
              </span>
            </div>
          </div>

          {/* Bottom row: Level / XP progress bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-end text-[7px] font-mono text-neutral-500 uppercase tracking-wider">
              <span className="text-white font-bold">LVL 12</span>
              <span>2,450 / 5,000 XP</span>
            </div>
            <div className="w-full h-1 bg-neutral-900 rounded overflow-hidden relative flex items-center">
              <div className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] rounded" style={{ width: "49%" }} />
              {/* N Circle indicator */}
              <div className="absolute right-1 w-2.5 h-2.5 rounded-full bg-black border border-neutral-800 text-[5px] font-mono flex items-center justify-center text-white">N</div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM CENTER OVERLAY: Sleek instruction helpers */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none select-none bg-[#0a0a0f]/90 border border-neutral-800/80 px-4 py-2 rounded flex items-center space-x-4 backdrop-blur-sm shadow-xl">
        <div className="flex items-center space-x-1.5 text-[8.5px] font-mono text-neutral-400 uppercase tracking-widest">
          <Info size={11} className="text-[#a3a3c2]" />
          <span>Hover to discover</span>
        </div>
        <div className="w-px h-3 bg-neutral-800" />
        <div className="flex items-center space-x-1.5 text-[8.5px] font-mono text-neutral-400 uppercase tracking-widest">
          <MousePointerClick size={11} className="text-[#a3a3c2]" />
          <span>Click to explore</span>
        </div>
      </div>

      {/* BOTTOM RIGHT OVERLAY: Navigation tip overlay */}
      <div className="absolute bottom-6 right-6 z-20 pointer-events-none select-none">
        <div className="bg-[#0a0a0f]/90 border border-neutral-800/80 p-3 rounded w-[220px] shadow-2xl backdrop-blur-md flex items-start space-x-2.5">
          {/* Compass/Star SVG decoration */}
          <div className="p-1 rounded bg-[#020204]/60 border border-neutral-800 mt-0.5 text-neutral-400">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M16.2 7.8l-2 5.6-5.6 2 2-5.6 5.6-2z" />
            </svg>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-[7.5px] font-mono text-neutral-500 uppercase tracking-widest block font-bold">
              NAVIGATION TIP
            </span>
            <p className="text-[8.5px] font-sans text-neutral-300 leading-normal uppercase">
              Every path has a story. Choose your destination.
            </p>
          </div>
        </div>
      </div>

      {/* FLOATING VERTICAL CONTROLS (Right Edge) */}
      <div className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 flex flex-col space-y-3">
        {/* Map Guide button */}
        <button className="w-12 h-12 rounded bg-[#0a0a0f]/90 border border-neutral-800/80 flex flex-col items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-500 transition-all cursor-pointer backdrop-blur-sm group">
          <HelpCircle size={15} />
          <span className="text-[5px] font-mono uppercase tracking-widest mt-1 block">GUIDE</span>
        </button>

        {/* Achievements button */}
        <button className="w-12 h-12 rounded bg-[#0a0a0f]/90 border border-neutral-800/80 flex flex-col items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-500 transition-all cursor-pointer backdrop-blur-sm group">
          <Trophy size={15} />
          <span className="text-[5px] font-mono uppercase tracking-widest mt-1 block">TRIAL</span>
        </button>
      </div>

      {/* CINEMATIC TRANSITION BANNER OVERLAY */}
      {transitioningTo && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col justify-center items-center select-none animate-[fadeIn_0.3s_ease-out]">
          <div className="space-y-3 text-center">
            <h2 className="text-[9px] font-mono tracking-[0.3em] uppercase text-neutral-500 animate-pulse">
              INITIALIZING TRAVEL PATH
            </h2>
            <h1 className="text-xl sm:text-2xl font-mono tracking-[0.2em] uppercase text-white font-bold animate-[textScale_1s_ease-out]">
              ENTERING {transitioningTo.name}...
            </h1>
            <div className="flex items-center justify-center space-x-1.5 pt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span className="text-[9px] font-mono text-[#a3a3a3] tracking-widest lowercase">establishing context lines...</span>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Keyframes for transition scaling inside style tag */}
      <style jsx global>{`
        @keyframes textScale {
          0% { transform: scale(0.96); filter: blur(2px); opacity: 0.1; }
          100% { transform: scale(1.02); filter: blur(0px); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default MainHubScene;
