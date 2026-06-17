"use client";

import React, { useEffect, useState } from "react";
import { usePortfolio } from "@/context/PortfolioState";
import { playPortalAmbience, stopPortalAmbience } from "@/utils/synth";
import { ArrowLeft, Send, ArrowRight, X, Mail, CheckCircle2 } from "lucide-react";

export const ContactScene: React.FC = () => {
  const { setScene, triggerHover, triggerClick, unlockAchievement } = usePortfolio();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    playPortalAmbience();
    return () => {
      stopPortalAmbience();
    };
  }, []);

  const handleBack = () => {
    triggerClick();
    setScene("main_hub");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    triggerClick();
    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      setIsSubmitted(true);
      setIsFormOpen(false);
      unlockAchievement("startup_builder");
    }, 1200);
  };

  const communicationLinks = [
    { name: "Send Message", action: () => setIsFormOpen(true), external: false },
    { name: "Connect on LinkedIn", url: "https://www.linkedin.com/in/shivam-singh-b78a74379/", external: true },
    { name: "View GitHub", url: "https://github.com/shiva119127", external: true },
    { name: "Email Me", url: "mailto:shiva.119127@gmail.com", external: true }
  ];

  const handleLinkClick = (link: typeof communicationLinks[0]) => {
    triggerClick();
    if (link.external && link.url) {
      window.open(link.url, "_blank");
    } else {
      link.action();
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
            <span>BACK TO HUB</span>
          </button>
          <span>FINAL QUEST</span>
        </div>

        {/* Title Block */}
        <div className="space-y-1">
          <h1 className="text-2xl font-mono tracking-wider text-white uppercase">FINAL QUEST</h1>
          <p className="text-xs text-[#a3a3c2]">
            Let's build something amazing together.
          </p>
        </div>

        {/* Contact Layout Grid (Left: Portal Links, Right: Mountain Peak) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-2">
          
          {/* Left Column: Communication Links */}
          <div className="flex flex-col space-y-3">
            {communicationLinks.map((link, idx) => (
              <div
                key={idx}
                onClick={() => handleLinkClick(link)}
                onMouseEnter={triggerHover}
                className="p-4 bg-[#0c0c12] border border-[#20202e] rounded flex items-center justify-between cursor-pointer hover:border-[#7a55ff] hover:bg-[#11111d] transition-all duration-150 group"
              >
                <span className="font-mono text-xs text-[#a3a3c2] uppercase font-bold group-hover:text-white transition-colors">
                  ✉️ {link.name}
                </span>
                <ArrowRight size={14} className="text-[#8a8a9d] group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>

          {/* Right Column: Mountain Peak Image */}
          <div className="flex justify-center items-center border border-[#20202e] bg-[#0c0c12]/40 rounded-md overflow-hidden p-2">
            <img 
              src="/mountain.png" 
              alt="Starry Mountain Peak" 
              className="max-h-56 w-full object-contain rounded"
              style={{ imageRendering: "pixelated" }}
            />
          </div>

        </div>

        {/* Success submission toast */}
        {isSubmitted && (
          <div className="p-4 bg-[#11111d] border-2 border-green-500 rounded text-center space-y-1 max-w-md mx-auto w-full animate-bounce">
            <h4 className="text-xs font-mono font-bold text-white uppercase">QUEST SECURED</h4>
            <p className="text-[10px] text-[#a3a3c2] uppercase font-sans">
              Your message was sent successfully. Shivam will contact you shortly.
            </p>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="text-[9px] font-mono text-[#7a55ff] hover:text-white uppercase tracking-widest pt-2 underline block mx-auto cursor-pointer"
            >
              Send Another
            </button>
          </div>
        )}

        {/* Bottom Banner */}
        <div className="text-center space-y-1 border-t border-[#20202e]/60 pt-4 max-w-lg mx-auto w-full">
          <p className="text-xs text-[#a3a3c2] font-medium leading-relaxed">
            Great things are built by great people.
          </p>
          <p className="text-[10px] font-mono text-[#7a55ff] uppercase tracking-wider">
            Let's build the future together.
          </p>
        </div>

      </div>

      {/* Form Dialog Modal Overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-6 select-none animate-[fadeIn_0.2s_ease-out]">
          <div className="max-w-md w-full bg-[#0c0c12] border-2 border-[#7a55ff] rounded p-6 space-y-6 relative shadow-[0_0_30px_rgba(122,85,255,0.2)]">
            
            <button 
              onClick={() => setIsFormOpen(false)}
              onMouseEnter={triggerHover}
              className="absolute top-4 right-4 p-1 bg-[#111116] border border-[#20202e] rounded text-[#8a8a9d] hover:text-white cursor-pointer"
            >
              <X size={12} />
            </button>

            <div className="space-y-1 border-b border-[#20202e] pb-4">
              <span className="text-[9px] font-mono text-[#7a55ff] tracking-widest uppercase block">
                TRANSMISSION FEED
              </span>
              <h2 className="text-lg font-mono font-bold text-white uppercase">SEND MESSAGE</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[#8a8a9d] uppercase block">NAME</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter name"
                  className="w-full bg-[#050508] border border-[#20202e] rounded px-3 py-2 text-white placeholder:text-[#8a8a9d]/30 focus:outline-none focus:border-[#7a55ff] font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[#8a8a9d] uppercase block">EMAIL</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email"
                  className="w-full bg-[#050508] border border-[#20202e] rounded px-3 py-2 text-white placeholder:text-[#8a8a9d]/30 focus:outline-none focus:border-[#7a55ff] font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[#8a8a9d] uppercase block">MESSAGE</label>
                <textarea 
                  name="message"
                  required
                  rows={3}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Write details..."
                  className="w-full bg-[#050508] border border-[#20202e] rounded px-3 py-2 text-white placeholder:text-[#8a8a9d]/30 focus:outline-none focus:border-[#7a55ff] font-mono resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                onMouseEnter={triggerHover}
                className="glow-btn w-full py-2 bg-[#111116] flex items-center justify-center space-x-2 text-white text-center cursor-pointer"
              >
                <Send size={10} />
                <span>{isSending ? "TRANSMITTING..." : "TRANSMIT MESSAGE"}</span>
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default ContactScene;
