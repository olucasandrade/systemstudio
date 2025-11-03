"use client";

import { useEffect } from "react";
import { animations, addScrollAnimation, addHoverAnimation } from "../lib/animations";
import { initializePageTransitions } from "../lib/page-transitions";

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize all animations on page load
    const initAnimations = () => {
      // Page load animations
      animations.fadeInUp('[data-animate="fadeInUp"]', 0);
      animations.fadeInLeft('[data-animate="fadeInLeft"]', 0);
      animations.fadeInRight('[data-animate="fadeInRight"]', 0);

      // Stagger animations for lists
      animations.staggerFadeIn('[data-animate="stagger"]', 100);

      // Scroll-triggered animations
      addScrollAnimation('[data-scroll-animate="fadeInUp"]', (target) => 
        animations.fadeInUp(target)
      );
      addScrollAnimation('[data-scroll-animate="fadeInLeft"]', (target) => 
        animations.fadeInLeft(target)
      );
      addScrollAnimation('[data-scroll-animate="fadeInRight"]', (target) => 
        animations.fadeInRight(target)
      );

      // Card hover animations
      addHoverAnimation(
        '.card-hover',
        (el) => animations.cardHover(el),
        (el) => animations.cardLeave(el)
      );

      // Button animations
      addHoverAnimation(
        '.button-hover',
        (el) => animations.buttonHover(el),
        (el) => animations.buttonLeave(el)
      );

      // Add click animations to all buttons
      document.querySelectorAll('button').forEach((button) => {
        button.addEventListener('click', (e) => {
          animations.buttonClick(e.target as HTMLElement);
        });
      });

      // Badge animations
      addHoverAnimation(
        '.badge-hover',
        (el) => animations.badgeBounce(el),
        () => {} // No leave animation for badges
      );

      // Search input animations
      const searchInputs = document.querySelectorAll('input[type="text"], input[type="search"]');
      searchInputs.forEach((input) => {
        input.addEventListener('focus', () => animations.searchFocus(input as HTMLElement));
        input.addEventListener('blur', () => animations.searchBlur(input as HTMLElement));
      });

      // Loading animations for skeleton elements
      document.querySelectorAll('.loading-skeleton').forEach((el) => {
        animations.pulse(el as HTMLElement);
      });

      // Shimmer effect for loading states
      document.querySelectorAll('.shimmer').forEach((el) => {
        animations.shimmer(el as HTMLElement);
      });
    };

    // Initialize animations after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initAnimations();
      // Initialize page transitions
      initializePageTransitions();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return <>{children}</>;
}
