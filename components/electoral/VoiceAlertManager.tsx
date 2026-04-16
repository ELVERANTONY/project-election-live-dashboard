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
      const gapFormatted = data.gapToRunoff.toLocaleString("es-PE");
      const text = `Actualización ONPE: La brecha es ahora de ${gapFormatted} votos de diferencia entre Sánchez y Rafael López Aliaga.`;
      
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
  utterance.lang = "es-PE"; // Prefer Peruvian Spanish
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  // Find a Spanish voice if available
  const voices = window.speechSynthesis.getVoices();
  const spanishVoice = voices.find(v => v.lang.startsWith("es")) || voices[0];
  if (spanishVoice) utterance.voice = spanishVoice;

  window.speechSynthesis.speak(utterance);
}
