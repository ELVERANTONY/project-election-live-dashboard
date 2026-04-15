"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ElectoralData } from "@/types/electoral";

const POLL_MS = 30_000;

export function useElectoralData() {
  const [data, setData] = useState<ElectoralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch("/api/electoral", { cache: "no-store" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      const json = await res.json();
      setData(json);
      setError(null);
      if (json.actasProcessed >= 100 && intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch_();
    intervalRef.current = setInterval(fetch_, POLL_MS);
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, [fetch_]);

  const isFinal = (data?.actasProcessed ?? 0) >= 100;

  return { data, loading, error, isFinal };
}
