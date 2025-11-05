"use client";

// Page transition utilities for smooth navigation
export const pageTransitions = {
  // Page exit animation
  exitPage: (callback: () => void) => {
    const main = document.querySelector('main');
    if (main) {
      main.style.opacity = '0';
      main.style.transform = 'translateY(20px)';
      main.style.transition = 'all 0.3s ease-in-out';
      
      setTimeout(() => {
        callback();
      }, 300);
    } else {
      callback();
    }
  },

  // Page enter animation
  enterPage: () => {
    const main = document.querySelector('main');
    if (main) {
      main.style.opacity = '0';
      main.style.transform = 'translateY(20px)';
      main.style.transition = 'all 0.3s ease-in-out';
      
      // Trigger reflow
      void main.offsetHeight;
      
      setTimeout(() => {
        main.style.opacity = '1';
        main.style.transform = 'translateY(0)';
      }, 50);
    }
  },

  // Slide transition (for horizontal navigation)
  slideTransition: (direction: 'left' | 'right', callback: () => void) => {
    const main = document.querySelector('main');
    if (main) {
      const translateX = direction === 'left' ? '-100%' : '100%';
      main.style.transform = `translateX(${translateX})`;
      main.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      
      setTimeout(() => {
        callback();
        // Reset position for new content
        main.style.transform = `translateX(${direction === 'left' ? '100%' : '-100%'})`;
        main.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
          main.style.transform = 'translateX(0)';
        }, 50);
      }, 400);
    } else {
      callback();
    }
  },

  // Fade transition
  fadeTransition: (callback: () => void) => {
    const main = document.querySelector('main');
    if (main) {
      main.style.opacity = '0';
      main.style.transition = 'opacity 0.3s ease-in-out';
      
      setTimeout(() => {
        callback();
        main.style.opacity = '1';
      }, 300);
    } else {
      callback();
    }
  },

  // Scale transition (for modal-like changes)
  scaleTransition: (callback: () => void) => {
    const main = document.querySelector('main');
    if (main) {
      main.style.transform = 'scale(0.95)';
      main.style.opacity = '0';
      main.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      
      setTimeout(() => {
        callback();
        main.style.transform = 'scale(1)';
        main.style.opacity = '1';
      }, 300);
    } else {
      callback();
    }
  },

  // Button click animation with navigation
  buttonClickWithTransition: (button: HTMLElement, callback: () => void, transitionType: 'fade' | 'scale' | 'slide' = 'fade') => {
    // Button click animation
    button.style.transform = 'scale(0.95)';
    button.style.transition = 'transform 0.15s ease-in-out';
    
    setTimeout(() => {
      button.style.transform = 'scale(1)';
      
      // Execute transition based on type
      setTimeout(() => {
        switch (transitionType) {
          case 'fade':
            pageTransitions.fadeTransition(callback);
            break;
          case 'scale':
            pageTransitions.scaleTransition(callback);
            break;
          case 'slide':
            pageTransitions.slideTransition('left', callback);
            break;
        }
      }, 200);
    }, 150);
  }
};

// Navigation enhancement with transitions
export const enhanceNavigation = () => {
  // Intercept all internal navigation
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a[href^="/"]');
    
    if (link && !link.hasAttribute('data-no-transition')) {
      e.preventDefault();
      const href = link.getAttribute('href');
      
      if (href) {
        pageTransitions.buttonClickWithTransition(
          link as HTMLElement,
          () => {
            window.location.href = href;
          },
          'fade'
        );
      }
    }
  });

  // Handle browser back/forward
  window.addEventListener('popstate', () => {
    pageTransitions.enterPage();
  });
};

// Form submission animations
export const enhanceFormSubmissions = () => {
  document.addEventListener('submit', (e) => {
    const form = e.target as HTMLFormElement;
    const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    
    if (submitButton) {
      // Button loading animation
      const originalText = submitButton.textContent;
      submitButton.textContent = 'Submitting...';
      submitButton.disabled = true;
      submitButton.style.opacity = '0.7';
      submitButton.style.transform = 'scale(0.98)';
      submitButton.style.transition = 'all 0.2s ease-in-out';
      
      // Reset after a delay (in real app, this would be after API response)
      setTimeout(() => {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        submitButton.style.opacity = '1';
        submitButton.style.transform = 'scale(1)';
      }, 2000);
    }
  });
};

// Initialize all navigation enhancements
export const initializePageTransitions = () => {
  // Add initial page enter animation
  pageTransitions.enterPage();
  
  // Enhance navigation
  enhanceNavigation();
  
  // Enhance form submissions
  enhanceFormSubmissions();
  
  // Add CSS for smooth transitions
  const style = document.createElement('style');
  style.textContent = `
    main {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    /* Smooth scrolling for anchor links */
    html {
      scroll-behavior: smooth;
    }
    
    /* Loading spinner animation */
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    
    /* Page transition classes */
    .page-transition-enter {
      opacity: 0;
      transform: translateY(20px);
    }
    
    .page-transition-enter-active {
      opacity: 1;
      transform: translateY(0);
      transition: all 0.3s ease-out;
    }
    
    .page-transition-exit {
      opacity: 1;
      transform: translateY(0);
    }
    
    .page-transition-exit-active {
      opacity: 0;
      transform: translateY(-20px);
      transition: all 0.3s ease-in;
    }
  `;
  document.head.appendChild(style);
};

