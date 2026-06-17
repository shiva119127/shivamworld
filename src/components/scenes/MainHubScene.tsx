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
  HelpCircle 
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
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const zoomTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup zoom timeout
  useEffect(() => {
    return () => {
      if (zoomTimeoutRef.current) {
        clearTimeout(zoomTimeoutRef.current);
      }
    };
  }, []);

  const mapWrapperRef = useRef<HTMLDivElement>(null);

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
      detailLabel: "PRIMARY MISSION",
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
      description: "View unlocked achievements."
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
        const initialScale = Math.min(window.innerWidth / 1000, window.innerHeight / 600) * 0.9;
        const scaleVal = Math.max(0.7, Math.min(1.1, initialScale));
        setZoom(scaleVal);
        setPan({
          x: -(500 * scaleVal) + window.innerWidth / 2,
          y: -(300 * scaleVal) + window.innerHeight / 2
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

  // Drag-to-pan mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    if (transitioningTo) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || transitioningTo) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Drag-to-pan touch events (mobile support)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (transitioningTo) return;
    if (e.touches.length === 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || transitioningTo) return;
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setPan({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      });
    }
  };

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
    const size = 18;

    switch (visualName) {
      case "forest": return <User className="text-[#a3a3c2] group-hover:text-white" size={size} />;
      case "citadel": return <Scroll className="text-[#a3a3c2] group-hover:text-white" size={size} />;
      case "lab": return <Zap className="text-[#a3a3c2] group-hover:text-white" size={size} />;
      case "trail": return <Compass className="text-[#a3a3c2] group-hover:text-white" size={size} />;
      case "legends": return <Trophy className="text-[#a3a3c2] group-hover:text-white" size={size} />;
      case "portal": return <Mail className="text-[#a3a3c2] group-hover:text-white" size={size} />;
      default: return <HelpCircle size={size} />;
    }
  };

  return (
    <div 
      ref={mapWrapperRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
      className={`relative w-full h-screen overflow-hidden bg-[#050505] select-none text-white font-sans ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
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
          transition: (isDragging || isZooming) ? "none" : "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
          transformOrigin: "center center",
          willChange: "transform"
        }}
        className="absolute w-[1000px] h-[600px] pointer-events-none"
      >
        <svg viewBox="0 0 1000 600" className="w-full h-full">
          {/* Background Compass Rose */}
          <g opacity="0.12" pointer-events="none">
            {/* Outer Dial rotating clockwise */}
            <circle cx="500" cy="300" r="140" fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="4 8" className="compass-dial-cw" />
            <circle cx="500" cy="300" r="120" fill="none" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="40 10 5 10" className="compass-dial-cw" />
            {/* Inner Dial rotating counter-clockwise */}
            <circle cx="500" cy="300" r="95" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="12 4" className="compass-dial-ccw" />
            {/* Static Directional Cross */}
            <line x1="500" y1="180" x2="500" y2="420" stroke="#ffffff" strokeWidth="0.5" />
            <line x1="380" y1="300" x2="620" y2="300" stroke="#ffffff" strokeWidth="0.5" />
            <polygon points="500,170 504,185 496,185" fill="#ffffff" />
            <text x="500" y="162" fill="#ffffff" fontSize="9" fontFamily="monospace" textAnchor="middle">N</text>
            <text x="500" y="442" fill="#ffffff" fontSize="9" fontFamily="monospace" textAnchor="middle">S</text>
            <text x="632" y="303" fill="#ffffff" fontSize="9" fontFamily="monospace" textAnchor="middle">E</text>
            <text x="368" y="303" fill="#ffffff" fontSize="9" fontFamily="monospace" textAnchor="middle">W</text>
          </g>

          {/* Background Drifting Clouds */}
          <g opacity="0.06" pointer-events="none">
            {/* Cloud 1 */}
            <g className="cloud-drift-1" transform="translate(0, 80)">
              <path d="M 0 20 A 12 12 0 0 1 15 8 A 15 15 0 0 1 40 8 A 12 12 0 0 1 55 20 A 8 8 0 0 1 55 28 Z" fill="#ffffff" />
            </g>
            {/* Cloud 2 */}
            <g className="cloud-drift-2" transform="translate(0, 240)">
              <path d="M 0 25 A 16 16 0 0 1 20 10 A 20 20 0 0 1 55 10 A 16 16 0 0 1 75 25 A 10 10 0 0 1 75 35 Z" fill="#ffffff" />
            </g>
            {/* Cloud 3 */}
            <g className="cloud-drift-3" transform="translate(0, 420)">
              <path d="M 0 18 A 10 10 0 0 1 12 7 A 12 12 0 0 1 32 7 A 10 10 0 0 1 42 18 Z" fill="#ffffff" />
            </g>
          </g>

          {/* Paths connecting locations to the central platform */}
          {destinations.map((dest) => {
            const isHovered = hoveredDest?.id === dest.id;
            const isLegendsLocked = dest.id === "achievements" && isAchievementsLocked;

            return (
              <line
                key={`path-${dest.id}`}
                x1="500"
                y1="300"
                x2={dest.x}
                y2={dest.y}
                stroke={isHovered && !isLegendsLocked ? "#ffffff" : "#242424"}
                strokeWidth={isHovered && !isLegendsLocked ? "2" : "1"}
                className={isHovered && !isLegendsLocked ? "path-flow" : ""}
                style={{ transition: "stroke 0.3s ease, stroke-width 0.3s ease" }}
              />
            );
          })}

          {/* Path Energy Sparks */}
          <g pointer-events="none">
            {destinations.map((dest) => {
              const isLegendsLocked = dest.id === "achievements" && isAchievementsLocked;
              if (isLegendsLocked) return null; // Sparks don't flow to locked zones
              
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

          {/* Central Platform & Player Stand */}
          <g transform="translate(500, 300)" className="pointer-events-auto">
            {/* Base platform ring */}
            <ellipse cx="0" cy="0" rx="60" ry="26" fill="#101010" stroke="#242424" strokeWidth="2.5" />
            <ellipse cx="0" cy="0" rx="42" ry="18" fill="#151515" stroke="#242424" strokeWidth="1" />
            
            {/* The avatar sprite stand */}
            <foreignObject x="-24" y="-55" width="48" height="60">
              <div className="w-full h-full flex items-end justify-center">
                <img
                  src="/character.png"
                  alt="Player Stand Avatar"
                  className="h-12 object-contain select-none"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
            </foreignObject>

            {/* Pixel Dragon Pet */}
            <g transform="translate(18, -14)">
              {/* Dragon wings with fluttering animation */}
              <polygon points="5,-5 8,-12 7,-4" fill="#f43f5e" className="flutter-wing" style={{ transformOrigin: "5px -4px" }} />
              {/* Dragon tail */}
              <path d="M 8 2 Q 13 4 12 0" stroke="#be123c" strokeWidth="1.5" fill="none" />
              {/* Dragon body */}
              <ellipse cx="4" cy="-2" rx="5" ry="3.5" fill="#f43f5e" />
              {/* Dragon head */}
              <circle cx="0" cy="-6" r="2.8" fill="#f43f5e" />
              {/* Dragon eye */}
              <circle cx="-1" cy="-7" r="0.5" fill="#000000" />
              <circle cx="-1" cy="-7" r="0.2" fill="#ffffff" />
              {/* Tiny horns */}
              <path d="M 2 -8.5 L 3 -10.5 M 0.5 -8.8 L 1 -11" stroke="#be123c" strokeWidth="0.8" />
            </g>
            
            {/* Title Badge overlay */}
            <g transform="translate(0, 36)">
              <rect x="-60" y="-12" width="120" height="24" rx="3" fill="#101010" stroke="#242424" strokeWidth="1" />
              <text textAnchor="middle" y="0" fill="#ffffff" fontSize="8" fontFamily="monospace" letterSpacing="1.5" fontWeight="bold">THE BUILDER</text>
              <text textAnchor="middle" y="8" fill="#a3a3a3" fontSize="6" fontFamily="sans-serif">Your journey starts here.</text>
            </g>
          </g>

          {/* Render Isometric Destinations */}
          {destinations.map((dest, index) => {
            const isHovered = hoveredDest?.id === dest.id;
            const isLegendsLocked = dest.id === "achievements" && isAchievementsLocked;

            return (
              <g 
                key={dest.id}
                transform={`translate(${dest.x}, ${dest.y})`}
                className={`pointer-events-auto cursor-pointer group transition-opacity duration-300 ${isLegendsLocked ? "opacity-35" : ""}`}
                onMouseEnter={() => handleNodeHover(dest, index)}
                onMouseLeave={() => handleNodeHover(null, -1)}
                onClick={() => handleNodeClick(dest)}
              >
                {/* Visual drawings block (pointer events disabled to prevent child hover flicker) */}
                <g className="pointer-events-none">
                  {/* Highlight Halo for hovered elements */}
                  {isHovered && !isLegendsLocked && (
                    <ellipse cx="0" cy="10" rx="50" ry="24" fill="none" stroke="#ffffff" strokeWidth="0.5" className="map-pulse" />
                  )}

                  {/* Floating Bobbing Island Group */}
                  <g className={`float-${dest.visualName}`}>
                    {/* Draw Visual Architecture */}
                    {dest.visualName === "citadel" && (
                      <g>
                        <path d="M-40,10 L0,-10 L40,10 L0,30 Z" fill="#141414" stroke="#242424" />
                        <path d="M-40,10 L-40,20 L0,40 L0,30 Z" fill="#0c0c0c" />
                        <path d="M40,10 L40,20 L0,40 L0,30 Z" fill="#080808" />
                        <rect x="-24" y="-35" width="11" height="40" fill="#121212" stroke="#242424" />
                        <polygon points="-25,-35 -18.5,-47 -12,-35" fill="#1a1a1a" stroke="#242424" />
                        <rect x="13" y="-35" width="11" height="40" fill="#121212" stroke="#242424" />
                        <polygon points="12,-35 18.5,-47 25,-35" fill="#1a1a1a" stroke="#242424" />
                        <rect x="-9" y="-50" width="18" height="55" fill="#161616" stroke="#242424" />
                        <polygon points="-11,-50 0,-64 11,-50" fill="#1c1c1c" stroke="#242424" />
                        <rect x="-3" y="-35" width="6" height="8" fill="#ffaa44" className="map-flicker" />
                        <rect x="-19" y="-20" width="3" height="5" fill="#ff9933" className="map-flicker" />
                        <rect x="20" y="-20" width="3" height="5" fill="#ff9933" className="map-flicker" />

                        {/* Waving Flag */}
                        <g transform="translate(0, -64)">
                          <line x1="0" y1="0" x2="0" y2="-12" stroke="#9ca3af" strokeWidth="0.8" />
                          <polygon points="0,-12 9,-9 0,-6" fill="#be123c" className="waving-flag" />
                        </g>

                        {/* Castle Guardian */}
                        <g transform="translate(24, 6)">
                          <rect x="-3" y="-10" width="6" height="10" rx="1" fill="#374151" stroke="#9ca3af" strokeWidth="0.5" />
                          <circle cx="0" cy="-13" r="2.2" fill="#9ca3af" />
                          <line x1="-3.5" y1="-20" x2="-3.5" y2="4" stroke="#d1d5db" strokeWidth="0.6" />
                          <polygon points="-3.5,-20 -5,-17 -2,-17" fill="#d1d5db" />
                          <rect x="1.5" y="-7" width="2.2" height="5" fill="#ef4444" />
                        </g>
                      </g>
                    )}

                    {dest.visualName === "forest" && (
                      <g>
                        <path d="M-40,10 L0,-10 L40,10 L0,30 Z" fill="#101310" stroke="#202620" />
                        <polygon points="-24,2 -15,-22 -6,2" fill="#121a12" stroke="#202820" />
                        <polygon points="-22,-8 -15,-30 -8,-8" fill="#152215" stroke="#202820" />
                        <polygon points="6,12 15,-12 24,12" fill="#121a12" stroke="#202820" />
                        <polygon points="8,2 15,-20 22,2" fill="#152215" stroke="#202820" />
                        <rect x="-10" y="-26" width="5" height="22" fill="#1c1c1c" stroke="#242424" />
                        <circle cx="0" cy="10" r="3.5" fill="#ff6611" className="map-flicker" />
                        <path d="M-2,10 L0,5 L2,10 Z" fill="#ffaa33" className="map-flicker" />

                        {/* Forest Spirit (Deer) */}
                        <g transform="translate(18, 2)">
                          <ellipse cx="0" cy="0" rx="5" ry="3.2" fill="#a7f3d0" />
                          <circle cx="-5" cy="-5" r="2.2" fill="#a7f3d0" />
                          <line x1="-2" y1="2" x2="-2" y2="6" stroke="#6ee7b7" strokeWidth="0.8" />
                          <line x1="2" y1="2" x2="2" y2="6" stroke="#6ee7b7" strokeWidth="0.8" />
                          <line x1="-4" y1="2" x2="-4" y2="6" stroke="#6ee7b7" strokeWidth="0.8" />
                          <path d="M -5.5 -6 Q -8 -9 -7 -12" fill="none" stroke="#34d399" strokeWidth="0.6" />
                          <path d="M -4.5 -6 Q -2 -9 -3 -12" fill="none" stroke="#34d399" strokeWidth="0.6" />
                        </g>
                      </g>
                    )}

                    {dest.visualName === "lab" && (
                      <g>
                        <path d="M-40,10 L0,-10 L40,10 L0,30 Z" fill="#101216" stroke="#20242e" />
                        <path d="M-20,5 A20,20 0 0,1 20,5 Z" fill="#151b24" fillOpacity="0.3" stroke="#2563eb" strokeWidth="1.2" />
                        <ellipse cx="0" cy="0" rx="28" ry="11" stroke="#3b82f6" strokeWidth="0.6" fill="none" className="map-pulse" />
                        <ellipse cx="0" cy="0" rx="18" ry="7" stroke="#60a5fa" strokeWidth="0.4" fill="none" className="map-pulse" />
                        <rect x="-2" y="-20" width="4" height="14" fill="#1e293b" stroke="#2563eb" />
                        <circle cx="0" cy="-20" r="2.5" fill="#60a5fa" className="map-pulse" />

                        {/* Hovering Research Drone */}
                        <g transform="translate(-24, -18)" className="map-float">
                          <circle cx="0" cy="0" r="3.2" fill="#3b82f6" stroke="#60a5fa" strokeWidth="0.5" />
                          <circle cx="-1" cy="0" r="0.6" fill="#60a5fa" />
                          <circle cx="1" cy="0" r="0.6" fill="#60a5fa" />
                          <line x1="-5" y1="-2" x2="5" y2="-2" stroke="#60a5fa" strokeWidth="0.5" />
                          <ellipse cx="0" cy="-2" rx="5" ry="1" fill="none" stroke="#93c5fd" strokeWidth="0.3" />
                        </g>
                      </g>
                    )}

                    {dest.visualName === "trail" && (
                      <g>
                        <path d="M-40,20 L-25,-10 L5,-15 L40,15 L10,35 Z" fill="#141414" stroke="#242424" />
                        <path d="M-25,-10 L-15,-32 L10,-28 L5,-15 Z" fill="#1a1a1a" stroke="#242424" />
                        <line x1="-8" y1="5" x2="8" y2="5" stroke="#2a2a2a" strokeWidth="1.8" />
                        <line x1="-6" y1="-2" x2="6" y2="-2" stroke="#2a2a2a" strokeWidth="1.8" />
                        <line x1="-4" y1="-9" x2="4" y2="-9" stroke="#2a2a2a" strokeWidth="1.8" />
                        <line x1="-18" y1="-12" x2="-18" y2="-4" stroke="#101010" strokeWidth="1.5" />
                        <circle cx="-18" cy="-14" r="2.5" fill="#ff7722" className="map-flicker" />
                        <line x1="18" y1="5" x2="18" y2="13" stroke="#101010" strokeWidth="1.5" />
                        <circle cx="18" cy="3" r="2.5" fill="#ff7722" className="map-flicker" />

                        {/* Campfire */}
                        <line x1="-4" y1="12" x2="4" y2="8" stroke="#78350f" strokeWidth="1.2" />
                        <line x1="-4" y1="8" x2="4" y2="12" stroke="#78350f" strokeWidth="1.2" />
                        <polygon points="-2.5,9 0,2 2.5,9" fill="#ea580c" className="map-flicker" />
                        <polygon points="-1.2,9 0,4 1.2,9" fill="#eab308" className="map-flicker" />
                        <circle cx="-1.5" cy="1" r="0.6" fill="#f97316" className="map-flicker" />
                        <circle cx="2" cy="-1" r="0.5" fill="#facc15" className="map-flicker" />
                      </g>
                    )}

                    {dest.visualName === "legends" && (
                      <g>
                        <path d="M-40,10 L0,-10 L40,10 L0,30 Z" fill="#1b1713" stroke="#28221b" />
                        <rect x="-20" y="-30" width="5" height="32" fill="#141414" stroke="#242424" />
                        <rect x="15" y="-30" width="5" height="32" fill="#141414" stroke="#242424" />
                        <rect x="-7" y="-38" width="14" height="5" fill="#202020" stroke="#2c2c2c" />
                        <path d="M-5,10 L-3,0 L3,0 L5,10 Z" fill="#1a1a1a" stroke="#242424" />
                        <circle cx="0" cy="-6" r="3.5" fill="#ffb700" className="map-pulse" />
                        <polygon points="-3,-5 3,-5 2,-1 -2,-1" fill="#ff9f00" />

                        {/* Left Torch */}
                        <line x1="-24" y1="-2" x2="-24" y2="-8" stroke="#4b5563" strokeWidth="1" />
                        <circle cx="-24" cy="-10" r="1.8" fill="#ff7700" className="map-flicker" />
                        {/* Right Torch */}
                        <line x1="24" y1="-2" x2="24" y2="-8" stroke="#4b5563" strokeWidth="1" />
                        <circle cx="24" cy="-10" r="1.8" fill="#ff7700" className="map-flicker" />
                      </g>
                    )}

                    {dest.visualName === "portal" && (
                      <g>
                        <path d="M-40,10 L0,-10 L40,10 L0,30 Z" fill="#14101d" stroke="#241c30" />
                        <circle cx="0" cy="-10" r="22" stroke="#7c3aed" strokeWidth="1.5" fill="none" strokeDasharray="24 8" className="map-float" />
                        <circle cx="0" cy="-10" r="16" stroke="#a78bfa" strokeWidth="0.8" fill="none" strokeDasharray="12 4" className="map-pulse" />
                        <circle cx="-12" cy="-22" r="1.2" fill="#a78bfa" className="map-flicker" />
                        <circle cx="12" cy="-26" r="0.8" fill="#ddd6fe" className="map-pulse" />
                        <circle cx="-4" cy="-35" r="1" fill="#a78bfa" className="map-float" />

                        {/* Floating Wizard Sprite */}
                        <g transform="translate(24, -6)" className="map-float">
                          <path d="M-4,8 L0,-4 L4,8 Z" fill="#4c1d95" stroke="#7c3aed" strokeWidth="0.5" />
                          <polygon points="-5,-4 0,-12 5,-4" fill="#6d28d9" />
                          <circle cx="0" cy="-4" r="1.8" fill="#ddd6fe" />
                          <line x1="-5" y1="-8" x2="-5" y2="10" stroke="#7c3aed" strokeWidth="0.8" />
                          <circle cx="-5" cy="-9.5" r="1.5" fill="#a78bfa" className="map-pulse" />
                        </g>
                      </g>
                    )}
                  </g>

                  {/* Text Labels under locations */}
                  <g transform="translate(0, 36)">
                    <rect x="-50" y="-10" width="100" height="20" rx="3" fill="#101010" stroke="#242424" strokeWidth="1" />
                    <text 
                      textAnchor="middle" 
                      y="3" 
                      fill={isHovered && !isLegendsLocked ? "#ffffff" : "#a3a3a3"} 
                      fontSize="7" 
                      fontFamily="monospace" 
                      letterSpacing="1"
                      fontWeight="bold"
                      className="transition-colors duration-200"
                    >
                      {dest.name}
                    </text>
                    
                    {/* Lock Indicator icon overlay */}
                    {isLegendsLocked && (
                      <g transform="translate(40, -15)">
                        <circle cx="0" cy="0" r="7" fill="#151515" stroke="#242424" />
                        <foreignObject x="-4" y="-5.5" width="8" height="11">
                          <Lock className="text-[#8a8a9d]" size={8} />
                        </foreignObject>
                      </g>
                    )}
                  </g>
                </g>

                {/* Flat transparent interactive hitbox to prevent nested flickering */}
                <ellipse cx="0" cy="15" rx="55" ry="32" fill="transparent" className="pointer-events-auto cursor-pointer" />
              </g>
            );
          })}
        </svg>
      </div>

      {/* FLOATING HOVER CARD PANEL */}
      {hoveredDest && (
        <div 
          className="absolute z-30 pointer-events-none bg-[#151515] border border-[#242424] p-4 rounded w-[240px] shadow-2xl animate-[fadeIn_0.15s_ease-out] select-none left-1/2 -translate-x-1/2 bottom-[100px]"
        >
          <div className="border-b border-[#242424] pb-2 mb-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono tracking-widest text-[#a3a3a3] uppercase">
                {hoveredDest.purpose}
              </span>
              {hoveredDest.id === "achievements" && isAchievementsLocked && (
                <span className="text-[8px] font-mono bg-red-950/50 text-red-500 border border-red-900 px-1 rounded flex items-center space-x-0.5">
                  <Lock size={6} />
                  <span>LOCKED</span>
                </span>
              )}
            </div>
            <h2 className="text-sm font-mono tracking-wide text-white uppercase mt-0.5">
              {hoveredDest.name}
            </h2>
          </div>
          
          <p className="text-[10px] text-[#a3a3a3] leading-normal uppercase">
            {hoveredDest.id === "achievements" && isAchievementsLocked 
              ? "Walk the Ascent Trail (Journey) first to unlock this location."
              : hoveredDest.description
            }
          </p>

          {hoveredDest.detailLabel && !isAchievementsLocked && (
            <div className="mt-3 pt-2 border-t border-[#242424]/60">
              <span className="text-[8px] font-mono text-text-secondary/60 uppercase tracking-wider block">
                {hoveredDest.detailLabel}
              </span>
              <span className="text-[10px] font-mono text-[#ffffff] uppercase font-bold tracking-wider">
                {hoveredDest.detailValue}
              </span>
            </div>
          )}
        </div>
      )}

      {/* TOP LEFT OVERLAY: LOGO */}
      <div className="absolute top-6 left-6 z-20 flex flex-col pointer-events-none select-none">
        <h1 className="text-xl font-mono tracking-[0.25em] text-white">SHIVAM'S WORLD</h1>
        <p className="text-[9px] font-mono tracking-[0.18em] text-[#a3a3a3] uppercase mt-0.5">Explore. Learn. Build. Grow.</p>
      </div>

      {/* TOP RIGHT OVERLAY: AUDIO CONTROL HUD */}
      <div className="absolute top-6 right-6 z-20 flex items-center space-x-4 bg-[#101010] border border-[#242424] px-4 py-2.5 rounded shadow-lg">
        {/* Mute toggle */}
        <button 
          onClick={toggleMute}
          className="text-[#a3a3a3] hover:text-white transition-colors cursor-pointer"
        >
          {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>

        {/* Volume slider */}
        <div className="flex items-center space-x-2">
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.05"
            value={volume}
            onChange={(e) => changeVolume(parseFloat(e.target.value))}
            className="w-16 h-1 bg-[#242424] rounded-lg appearance-none cursor-pointer accent-white"
          />
        </div>

        {/* Settings Button */}
        <div className="relative">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="text-[#a3a3a3] hover:text-white transition-colors cursor-pointer"
          >
            <Settings size={15} />
          </button>
          
          {showSettings && (
            <div className="absolute right-0 mt-3 w-32 bg-[#151515] border border-[#242424] rounded shadow-xl py-1 z-30 text-right animate-[fadeIn_0.1s_ease-out]">
              <button 
                onClick={() => {
                  resetProgress();
                  setShowSettings(false);
                }}
                className="w-full text-right px-3 py-1.5 text-[9px] font-mono text-[#a3a3a3] hover:bg-[#101010] hover:text-white transition-colors block cursor-pointer uppercase"
              >
                Reset Progress
              </button>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM LEFT OVERLAY: PLAYER CARD */}
      <div className="absolute bottom-6 left-6 z-20 pointer-events-none select-none">
        <div className="bg-[#101010] border border-[#242424] p-4 rounded max-w-[280px] shadow-lg">
          <div className="text-[8px] font-mono text-text-secondary/50 uppercase tracking-widest border-b border-[#242424]/40 pb-1 mb-2">
            PLAYER PROFILE HUD
          </div>
          <div className="space-y-1.5">
            <div>
              <span className="text-[7px] font-mono text-[#a3a3a3] uppercase block">NAME</span>
              <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">Shivam Singh</span>
            </div>
            <div>
              <span className="text-[7px] font-mono text-[#a3a3a3] uppercase block">ROLE</span>
              <span className="text-[9px] text-[#a3a3a3] leading-tight block uppercase">
                Student Founder | Developer | Entrepreneur
              </span>
            </div>
            <div>
              <span className="text-[7px] font-mono text-[#a3a3a3] uppercase block">CURRENT QUEST</span>
              <span className="text-[9px] font-mono text-white font-bold tracking-wider uppercase block">
                Building CollabKaro
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM RIGHT OVERLAY: CONTROLS LEGEND */}
      <div className="absolute bottom-6 right-6 z-20 pointer-events-none select-none text-right">
        <div className="text-[9px] font-mono text-[#a3a3a3] uppercase tracking-widest leading-relaxed">
          Hover to discover.
          <br />
          Click to explore.
        </div>
      </div>

      {/* CINEMATIC TRANSITION BANNER OVERLAY */}
      {transitioningTo && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col justify-center items-center select-none animate-[fadeIn_0.3s_ease-out]">
          <div className="space-y-3 text-center">
            <h2 className="text-[10px] font-mono tracking-[0.3em] uppercase text-text-secondary animate-pulse">
              INITIALIZING TRAVEL PATH
            </h2>
            <h1 className="text-2xl sm:text-3xl font-mono tracking-[0.2em] uppercase text-white font-bold animate-[textScale_1s_ease-out]">
              ENTERING {transitioningTo.name}...
            </h1>
            <div className="flex items-center justify-center space-x-1.5 pt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span className="text-[10px] font-mono text-[#a3a3a3] tracking-widest lowercase">establishing context lines...</span>
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
