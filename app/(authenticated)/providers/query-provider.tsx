"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Stale time: data is fresh for 30 seconds
            staleTime: 30 * 1000,
            // Cache time: data stays in cache for 5 minutes
            gcTime: 5 * 60 * 1000,
            // Don't refetch on window focus (better UX)
            refetchOnWindowFocus: false,
            // Retry failed requests once
            retry: 1,
            // Refetch on mount if data is stale
            refetchOnMount: true,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

