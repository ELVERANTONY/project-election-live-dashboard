"use client";

import { useEffect, useRef } from "react";
import { ElectoralData } from "@/types/electoral";

interface VoiceAlertManagerProps {
  data: ElectoralData | null;
}

export function VoiceAlertManager({ data }: VoiceAlertManagerProps) {
  const prevGapRef = useRef<number | null>(null);
  const prevActasRef = useRef<number | null>(null);

  useEffect(() => {
    // We only trigger alerts if sound is enabled in localStorage
    const soundEnabled = localStorage.getItem("voice_alerts_enabled") === "true";
    
    if (!data || !soundEnabled) {
      if (data) {
        prevGapRef.current = data.gapToRunoff;
        prevActasRef.current = data.actasProcessed;
      }
      return;
    }

    // Detection logic: speak if gap or actas processed changes
    const hasGapChanged = prevGapRef.current !== null && prevGapRef.current !== data.gapToRunoff;
    const hasActasChanged = prevActasRef.current !== null && prevActasRef.current !== data.actasProcessed;

    if (hasGapChanged || hasActasChanged) {
      const gap = data.gapToRunoff.toLocaleString("es-PE");
      const time = data.lastSync.replace(" PET", ""); // Clean time for speech
      const pct = data.actasProcessed.toFixed(2);
      
      const templates = [
        `Actualización ONPE: La brecha es ahora de ${gap} votos de diferencia entre Sánchez y Rafael López Aliaga.`,
        `A las ${time}, la ONPE reporta una distancia de ${gap} votos entre los candidatos Sánchez y Aliaga.`,
        `Con el ${pct} por ciento de actas procesadas, Aliaga se encuentra a ${gap} votos de alcanzar a Sánchez.`,
        `Atención: Reporte de último minuto. La diferencia entre Sánchez y Aliaga es ahora de ${gap} votos.`
      ];

      const randomIndex = Math.floor(Math.random() * templates.length);
      const text = templates[randomIndex];
      
      speak(text);
    }

    // Update refs for next poll
    prevGapRef.current = data.gapToRunoff;
    prevActasRef.current = data.actasProcessed;
  }, [data]);

  return null; // Invisible component
}

function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  // Cancel any ongoing speech to avoid backlog
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-PE"; 
  utterance.rate = 1.15; // Increased speed for more agility (broadcast style)
  utterance.pitch = 1.0;

  // Find a high-quality Spanish voice
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => 
    v.lang.startsWith("es") && (v.name.includes("Google") || v.name.includes("Natural"))
  ) || voices.find(v => v.lang.startsWith("es")) || voices[0];
  
  if (preferredVoice) utterance.voice = preferredVoice;

  window.speechSynthesis.speak(utterance);
}
