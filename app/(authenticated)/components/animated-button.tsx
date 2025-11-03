"use client";

import { Button } from "@/app/design-system/components/ui/button";
import { pageTransitions } from "../lib/page-transitions";
import { ReactNode } from "react";

interface AnimatedButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  transitionType?: "fade" | "scale" | "slide";
  loading?: boolean;
  disabled?: boolean;
}

export function AnimatedButton({
  children,
  href,
  onClick,
  variant = "default",
  size = "default",
  className = "",
  transitionType = "fade",
  loading = false,
  disabled = false,
}: AnimatedButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    
    if (href) {
      e.preventDefault();
      pageTransitions.buttonClickWithTransition(
        e.currentTarget as HTMLElement,
        () => {
          window.location.href = href;
        },
        transitionType
      );
    } else if (onClick) {
      // Add button click animation
      const button = e.currentTarget as HTMLElement;
      button.style.transform = 'scale(0.95)';
      button.style.transition = 'transform 0.15s ease-in-out';
      
      setTimeout(() => {
        button.style.transform = 'scale(1)';
        onClick();
      }, 150);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={`button-hover transition-all duration-200 ${className}`}
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </div>
      ) : (
        children
      )}
    </Button>
  );
}

