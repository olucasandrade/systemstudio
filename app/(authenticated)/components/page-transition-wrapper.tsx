"use client";

import { useEffect, useState } from "react";

interface PageTransitionWrapperProps {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingMessage?: string;
}

export function PageTransitionWrapper({ 
  children, 
  isLoading = false, 
  loadingMessage = "Loading page..." 
}: PageTransitionWrapperProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Add page enter animation
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`transition-all duration-300 ease-in-out ${
      isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
    }`}>
      {children}
    </div>
  );
}

