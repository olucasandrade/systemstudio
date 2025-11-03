"use client";

// Helper function to normalize elements
const normalizeElements = (targets: string | HTMLElement | NodeList): HTMLElement[] => {
  if (typeof targets === 'string') {
    return Array.from(document.querySelectorAll(targets)) as HTMLElement[];
  }
  if (targets instanceof NodeList) {
    return Array.from(targets) as HTMLElement[];
  }
  return [targets];
};

// Animation utilities using CSS classes and Tailwind
export const animations = {
  // Page load animations - using CSS classes
  fadeInUp: (targets: string | HTMLElement | NodeList, delay = 0) => {
    const elements = normalizeElements(targets);
    if (!elements.length) return;
    
    elements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'all 0.6s ease-out';
      
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, delay + (index * 100));
    });
  },

  fadeInLeft: (targets: string | HTMLElement | NodeList, delay = 0) => {
    const elements = normalizeElements(targets);
    if (!elements.length) return;
    
    elements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateX(-30px)';
      el.style.transition = 'all 0.5s ease-out';
      
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateX(0)';
      }, delay + (index * 100));
    });
  },

  fadeInRight: (targets: string | HTMLElement | NodeList, delay = 0) => {
    const elements = normalizeElements(targets);
    if (!elements.length) return;
    
    elements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateX(30px)';
      el.style.transition = 'all 0.5s ease-out';
      
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateX(0)';
      }, delay + (index * 100));
    });
  },

  // Card animations
  cardHover: (targets: string | HTMLElement | NodeList) => {
    const elements = normalizeElements(targets);
    if (!elements.length) return;
    
    elements.forEach((el) => {
      el.style.transform = 'scale(1.02)';
      el.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
      el.style.transition = 'all 0.2s ease-out';
    });
  },

  cardLeave: (targets: string | HTMLElement | NodeList) => {
    const elements = normalizeElements(targets);
    if (!elements.length) return;
    
    elements.forEach((el) => {
      el.style.transform = 'scale(1)';
      el.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
      el.style.transition = 'all 0.2s ease-out';
    });
  },

  // Button animations
  buttonClick: (targets: string | HTMLElement | NodeList) => {
    const elements = normalizeElements(targets);
    if (!elements.length) return;
    
    elements.forEach((el) => {
      el.style.transform = 'scale(0.95)';
      el.style.transition = 'transform 0.15s ease-in-out';
      
      setTimeout(() => {
        el.style.transform = 'scale(1)';
      }, 150);
    });
  },

  buttonHover: (targets: string | HTMLElement | NodeList) => {
    const elements = normalizeElements(targets);
    if (!elements.length) return;
    
    elements.forEach((el) => {
      el.style.transform = 'scale(1.05)';
      el.style.transition = 'all 0.2s ease-out';
    });
  },

  buttonLeave: (targets: string | HTMLElement | NodeList) => {
    const elements = normalizeElements(targets);
    if (!elements.length) return;
    
    elements.forEach((el) => {
      el.style.transform = 'scale(1)';
      el.style.transition = 'all 0.2s ease-out';
    });
  },

  // Loading animations
  pulse: (targets: string | HTMLElement | NodeList) => {
    const elements = normalizeElements(targets);
    if (!elements.length) return;
    
    elements.forEach((el) => {
      el.style.animation = 'pulse 1s ease-in-out infinite';
    });
  },

  shimmer: (targets: string | HTMLElement | NodeList) => {
    const elements = normalizeElements(targets);
    if (!elements.length) return;
    
    elements.forEach((el) => {
      el.style.background = 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)';
      el.style.backgroundSize = '200% 100%';
      el.style.animation = 'shimmer 1.5s linear infinite';
    });
  },

  // Stagger animations for lists
  staggerFadeIn: (targets: string | HTMLElement | NodeList, stagger = 100) => {
    const elements = normalizeElements(targets);
    if (!elements.length) return;
    
    elements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'all 0.4s ease-out';
      
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, index * stagger);
    });
  },

  // Modal animations
  modalIn: (targets: string | HTMLElement | NodeList) => {
    const elements = normalizeElements(targets);
    if (!elements.length) return;
    
    elements.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'scale(0.9)';
      el.style.transition = 'all 0.3s ease-out';
      
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'scale(1)';
      }, 10);
    });
  },

  modalOut: (targets: string | HTMLElement | NodeList) => {
    const elements = normalizeElements(targets);
    if (!elements.length) return;
    
    elements.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'scale(0.9)';
      el.style.transition = 'all 0.2s ease-in';
    });
  },

  // Search animations
  searchFocus: (targets: string | HTMLElement | NodeList) => {
    const elements = normalizeElements(targets);
    if (!elements.length) return;
    
    elements.forEach((el) => {
      el.style.transform = 'scale(1.02)';
      el.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
      el.style.transition = 'all 0.2s ease-out';
    });
  },

  searchBlur: (targets: string | HTMLElement | NodeList) => {
    const elements = normalizeElements(targets);
    if (!elements.length) return;
    
    elements.forEach((el) => {
      el.style.transform = 'scale(1)';
      el.style.boxShadow = '0 0 0 0 rgba(59, 130, 246, 0)';
      el.style.transition = 'all 0.2s ease-out';
    });
  },

  // Badge animations
  badgeBounce: (targets: string | HTMLElement | NodeList) => {
    const elements = normalizeElements(targets);
    if (!elements.length) return;
    
    elements.forEach((el) => {
      el.style.transform = 'scale(1.2)';
      el.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      
      setTimeout(() => {
        el.style.transform = 'scale(1)';
      }, 300);
    });
  },

  // Progress animations
  progressFill: (targets: string | HTMLElement | NodeList, value: number) => {
    const elements = normalizeElements(targets);
    if (!elements.length) return;
    
    elements.forEach((el) => {
      el.style.width = '0%';
      el.style.transition = 'width 1s ease-out';
      
      setTimeout(() => {
        el.style.width = `${value}%`;
      }, 10);
    });
  },

  // Notification animations
  notificationSlideIn: (targets: string | HTMLElement | NodeList) => {
    const elements = normalizeElements(targets);
    if (!elements.length) return;
    
    elements.forEach((el) => {
      el.style.transform = 'translateX(300px)';
      el.style.opacity = '0';
      el.style.transition = 'all 0.4s ease-out';
      
      setTimeout(() => {
        el.style.transform = 'translateX(0)';
        el.style.opacity = '1';
      }, 10);
    });
  },

  notificationSlideOut: (targets: string | HTMLElement | NodeList) => {
    const elements = normalizeElements(targets);
    if (!elements.length) return;
    
    elements.forEach((el) => {
      el.style.transform = 'translateX(300px)';
      el.style.opacity = '0';
      el.style.transition = 'all 0.3s ease-in';
    });
  },
};

// Utility function to add intersection observer for scroll animations
export const addScrollAnimation = (
  selector: string,
  animation: (targets: string | HTMLElement | NodeList) => void,
  threshold = 0.1
) => {
  if (typeof window === 'undefined') return;
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animation(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold }
  );

  document.querySelectorAll(selector).forEach((el) => {
    observer.observe(el);
  });
};

// Utility function to add hover animations
export const addHoverAnimation = (
  selector: string,
  hoverIn: (targets: string | HTMLElement | NodeList) => void,
  hoverOut: (targets: string | HTMLElement | NodeList) => void
) => {
  if (typeof window === 'undefined') return;
  
  document.querySelectorAll(selector).forEach((el) => {
    el.addEventListener('mouseenter', () => hoverIn(el as HTMLElement));
    el.addEventListener('mouseleave', () => hoverOut(el as HTMLElement));
  });
};