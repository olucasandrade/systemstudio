"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { pageTransitions } from "../lib/page-transitions";
import { ReactNode, useTransition } from "react";

interface AnimatedLinkProps {
  children: ReactNode;
  href: string;
  className?: string;
  transitionType?: "fade" | "scale" | "slide";
  external?: boolean;
  prefetch?: boolean;
}

export function AnimatedLink({
  children,
  href,
  className = "",
  transitionType = "fade",
  external = false,
  prefetch = true,
}: AnimatedLinkProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = (e: React.MouseEvent) => {
    if (external) return;
    
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
  };

  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={`button-hover transition-all duration-200 ${className} ${isPending ? 'opacity-70' : ''}`}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}

