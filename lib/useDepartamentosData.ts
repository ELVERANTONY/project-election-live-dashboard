"use client";

import { useState, useEffect } from "react";
import { DepartamentosData } from "@/types/electoral";

const POLL_MS = 60_000; // 60s — 25 parallel fetches, be kind to ONPE

export function useDepartamentosData() {
  const [data, setData] = useState<DepartamentosData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetch_() {
      try {
        const res = await fetch("/api/electoral/departamentos");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: DepartamentosData = await res.json();
        if (!cancelled) {
          setData(json);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError(String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetch_();
    const id = setInterval(fetch_, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return { data, loading, error };
}
