"use client";

import { useEffect, useState } from "react";

export function VoiceAlertsToggle() {
  const [enabled, setEnabled] = useState(false);

  // Sync with localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("voice_alerts_enabled") === "true";
    setEnabled(saved);
  }, []);

  const toggle = () => {
    const newVal = !enabled;
    setEnabled(newVal);
    localStorage.setItem("voice_alerts_enabled", String(newVal));
    
    // Give feedback on activation
    if (newVal) {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        const msg = new SpeechSynthesisUtterance("Alertas de voz activadas");
        msg.lang = "es-PE";
        window.speechSynthesis.speak(msg);
      }
    }
  };

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 border ${
        enabled 
          ? "bg-secondary/10 border-secondary/30 text-secondary" 
          : "bg-surface-container border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high"
      }`}
      aria-label="Toggle voice alerts"
    >
      <span className="material-symbols-outlined text-base leading-none">
        {enabled ? "volume_up" : "volume_off"}
      </span>
      <span className="font-label text-[10px] uppercase tracking-widest font-bold">
        {enabled ? "Alertas Voz ON" : "Voz OFF"}
      </span>
    </button>
  );
}
