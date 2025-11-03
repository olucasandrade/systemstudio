"use client";

import Link from "next/link";
import { pageTransitions } from "../lib/page-transitions";
import { ReactNode } from "react";

interface AnimatedLinkProps {
  children: ReactNode;
  href: string;
  className?: string;
  transitionType?: "fade" | "scale" | "slide";
  external?: boolean;
}

export function AnimatedLink({
  children,
  href,
  className = "",
  transitionType = "fade",
  external = false,
}: AnimatedLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (external) return;
    
    e.preventDefault();
    pageTransitions.buttonClickWithTransition(
      e.currentTarget as HTMLElement,
      () => {
        window.location.href = href;
      },
      transitionType
    );
  };

  return (
    <Link
      href={href}
      className={`button-hover transition-all duration-200 ${className}`}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}

