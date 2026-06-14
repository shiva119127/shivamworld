"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  setGlobalVolume, 
  setMutedState, 
  initAudioContext,
  playHoverSound,
  playClickSound,
  playCheckpointSound,
  playAchievementUnlock,
  setHubThemeMuted
} from "@/utils/synth";

export type Scene = 
  | "loading"
  | "profile_unlock"
  | "world_entry"
  | "main_hub"
  | "about"
  | "projects"
  | "skills"
  | "journey"
  | "achievements"
  | "contact";

interface PortfolioContextType {
  currentScene: Scene;
  setScene: (scene: Scene) => void;
  volume: number;
  changeVolume: (v: number) => void;
  muted: boolean;
  toggleMute: () => void;
  visitedScenes: string[];
  markSceneVisited: (scene: Scene) => void;
  unlockedAchievements: string[];
  unlockAchievement: (id: string) => boolean;
  resetProgress: () => void;
  isAudioInitialized: boolean;
  triggerHover: () => void;
  triggerClick: () => void;
  triggerCheckpoint: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScene, setCurrentSceneInternal] = useState<Scene>("loading");
  const [volume, setVolume] = useState<number>(0.5);
  const [muted, setMuted] = useState<boolean>(false);
  const [visitedScenes, setVisitedScenes] = useState<string[]>(["loading"]);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [isAudioInitialized, setIsAudioInitialized] = useState<boolean>(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedVolume = localStorage.getItem("shivams_world_volume");
      const savedMuted = localStorage.getItem("shivams_world_muted");
      const savedVisited = localStorage.getItem("shivams_world_visited");
      const savedAchievements = localStorage.getItem("shivams_world_achievements");

      if (savedVolume !== null) {
        const v = parseFloat(savedVolume);
        setVolume(v);
        setGlobalVolume(v);
      }
      if (savedMuted !== null) {
        const m = savedMuted === "true";
        setMuted(m);
        setMutedState(m);
      }
      if (savedVisited !== null) {
        try {
          setVisitedScenes(JSON.parse(savedVisited));
        } catch (e) {}
      }
      if (savedAchievements !== null) {
        try {
          setUnlockedAchievements(JSON.parse(savedAchievements));
        } catch (e) {}
      }
    }
  }, []);

  // Initialize browser AudioContext on first user interaction (bypasses browser autoplay restrictions)
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!isAudioInitialized) {
        initAudioContext();
        setIsAudioInitialized(true);
      }
    };
    
    if (typeof window !== "undefined") {
      window.addEventListener("click", handleUserInteraction);
      window.addEventListener("keydown", handleUserInteraction);
      window.addEventListener("touchstart", handleUserInteraction);
    }
    
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("click", handleUserInteraction);
        window.removeEventListener("keydown", handleUserInteraction);
        window.removeEventListener("touchstart", handleUserInteraction);
      }
    };
  }, [isAudioInitialized]);

  // Set active scene and handle state side effects (like music dimming)
  const setScene = (scene: Scene) => {
    // Initialize audio context on first user action if not already
    if (!isAudioInitialized && scene !== "loading") {
      initAudioContext();
      setIsAudioInitialized(true);
    }
    
    // Mute/Dim the main hub background track in sub-scenes to highlight active content
    if (scene === "main_hub" || scene === "world_entry") {
      setHubThemeMuted(false);
    } else if (scene !== "loading" && scene !== "profile_unlock") {
      setHubThemeMuted(true);
    }

    setCurrentSceneInternal(scene);
    markSceneVisited(scene);
  };

  const changeVolume = (v: number) => {
    setVolume(v);
    setGlobalVolume(v);
  };

  const toggleMute = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    setMutedState(newMuted);
  };

  const markSceneVisited = (scene: Scene) => {
    setVisitedScenes((prev) => {
      if (prev.includes(scene)) return prev;
      const updated = [...prev, scene];
      localStorage.setItem("shivams_world_visited", JSON.stringify(updated));
      return updated;
    });
  };

  const unlockAchievement = (id: string): boolean => {
    let newlyUnlocked = false;
    setUnlockedAchievements((prev) => {
      if (prev.includes(id)) return prev;
      newlyUnlocked = true;
      const updated = [...prev, id];
      localStorage.setItem("shivams_world_achievements", JSON.stringify(updated));
      
      // Play achievement unlock fanfare
      setTimeout(() => {
        playAchievementUnlock();
      }, 300);
      
      return updated;
    });
    return newlyUnlocked;
  };

  const resetProgress = () => {
    setVisitedScenes(["loading"]);
    setUnlockedAchievements([]);
    localStorage.removeItem("shivams_world_visited");
    localStorage.removeItem("shivams_world_achievements");
    setScene("profile_unlock");
  };

  // Sound trigger helpers to keep components clean
  const triggerHover = () => {
    if (isAudioInitialized && !muted) playHoverSound();
  };

  const triggerClick = () => {
    if (!isAudioInitialized) {
      initAudioContext();
      setIsAudioInitialized(true);
    }
    if (!muted) playClickSound();
  };

  const triggerCheckpoint = () => {
    if (isAudioInitialized && !muted) playCheckpointSound();
  };

  return (
    <PortfolioContext.Provider
      value={{
        currentScene,
        setScene,
        volume,
        changeVolume,
        muted,
        toggleMute,
        visitedScenes,
        markSceneVisited,
        unlockedAchievements,
        unlockAchievement,
        resetProgress,
        isAudioInitialized,
        triggerHover,
        triggerClick,
        triggerCheckpoint
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};
