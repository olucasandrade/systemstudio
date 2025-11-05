"use client";

import { Button } from "@/app/design-system/components/ui/button";
import { pageTransitions } from "../lib/page-transitions";
import { useRouter } from "next/navigation";
import { ReactNode, useTransition } from "react";
import Link from "next/link";

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
  prefetch?: boolean;
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
  prefetch = true,
}: AnimatedButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    
    if (href) {
      e.preventDefault();
      startTransition(() => {
        pageTransitions.buttonClickWithTransition(
          e.currentTarget as HTMLElement,
          () => {
            router.push(href);
          },
          transitionType
        );
      });
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

  // If href is provided, wrap in Link for prefetching
  if (href) {
    return (
      <Link href={href} prefetch={prefetch} className="inline-block">
        <Button
          variant={variant}
          size={size}
          className={`button-hover transition-all duration-200 ${className} ${isPending || loading ? 'opacity-70' : ''}`}
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
      </Link>
    );
  }

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

