"use client";

import React from "react";
import { usePortfolio } from "@/context/PortfolioState";
import { AnimatePresence, motion } from "framer-motion";

// Import all scene views
import { LoadingScene } from "@/components/scenes/LoadingScene";
import { ProfileUnlockScene } from "@/components/scenes/ProfileUnlockScene";
import { WorldEntryScene } from "@/components/scenes/WorldEntryScene";
import { MainHubScene } from "@/components/scenes/MainHubScene";
import { AboutScene } from "@/components/scenes/AboutScene";
import { ProjectsScene } from "@/components/scenes/ProjectsScene";
import { SkillsScene } from "@/components/scenes/SkillsScene";
import { JourneyScene } from "@/components/scenes/JourneyScene";
import { AchievementsScene } from "@/components/scenes/AchievementsScene";
import { ContactScene } from "@/components/scenes/ContactScene";

export default function Home() {
  const { currentScene } = usePortfolio();

  // Scene component dictionary
  const renderScene = () => {
    switch (currentScene) {
      case "loading":
        return <LoadingScene key="loading" />;
      case "profile_unlock":
        return <ProfileUnlockScene key="profile_unlock" />;
      case "world_entry":
        return <WorldEntryScene key="world_entry" />;
      case "main_hub":
        return <MainHubScene key="main_hub" />;
      case "about":
        return <AboutScene key="about" />;
      case "projects":
        return <ProjectsScene key="projects" />;
      case "skills":
        return <SkillsScene key="skills" />;
      case "journey":
        return <JourneyScene key="journey" />;
      case "achievements":
        return <AchievementsScene key="achievements" />;
      case "contact":
        return <ContactScene key="contact" />;
      default:
        return <LoadingScene key="loading" />;
    }
  };

  // Cinematic page transition styles matching TRD specifications (600ms duration)
  const pageVariants = {
    initial: {
      opacity: 0,
      scale: 0.97,
      filter: "blur(4px)"
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.6,
        ease: [0.25, 1, 0.5, 1] as any // Out Quart easing curve
      }
    },
    exit: {
      opacity: 0,
      scale: 1.03,
      filter: "blur(4px)",
      transition: {
        duration: 0.6,
        ease: [0.25, 1, 0.5, 1] as any
      }
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-background relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full h-full"
        >
          {renderScene()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
