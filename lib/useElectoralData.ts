"use client";

import { useState, useEffect, useCallback } from "react";
import { ElectoralData } from "@/types/electoral";

interface LiveElectoralData extends ElectoralData {
  nietoLeading: boolean;
  error?: string;
}

const POLL_MS = 30_000;

export function useElectoralData() {
  const [data, setData] = useState<LiveElectoralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch("/api/electoral", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setLastFetch(new Date());
    } catch (e) {
      setData((prev) =>
        prev ? { ...prev, error: String(e) } : null
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch_();
    const id = setInterval(fetch_, POLL_MS);
    return () => clearInterval(id);
  }, [fetch_]);

  return { data, loading, lastFetch };
}
