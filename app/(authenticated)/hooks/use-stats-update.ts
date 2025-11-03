"use client";

import { useCallback } from "react";

export function useStatsUpdate() {
  const updateStats = useCallback(async () => {
    try {
      await fetch("/api/stats/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Failed to update stats:", error);
    }
  }, []);

  return { updateStats };
}

