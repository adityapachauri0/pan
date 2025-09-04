// Accessibility utilities
export const a11y = {
  // Announce to screen readers
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  },

  // Skip link management
  skipLinks: {
    create: () => {
      const skipNav = document.createElement('a');
      skipNav.href = '#main-content';
      skipNav.className = 'skip-link';
      skipNav.textContent = 'Skip to main content';
      return skipNav;
    }
  },

  // Focus management
  focus: {
    trap: (element: HTMLElement) => {
      const focusableElements = element.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
      );
      const firstFocusable = focusableElements[0] as HTMLElement;
      const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

      element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
              lastFocusable.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastFocusable) {
              firstFocusable.focus();
              e.preventDefault();
            }
          }
        }
      });
    },

    restore: (previousFocus: HTMLElement | null) => {
      if (previousFocus && previousFocus.focus) {
        previousFocus.focus();
      }
    }
  },

  // Keyboard navigation
  keyboard: {
    isNavigationKey: (key: string) => {
      return ['Enter', ' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(key);
    },

    handleListNavigation: (e: KeyboardEvent, items: NodeListOf<HTMLElement> | HTMLElement[]) => {
      const currentIndex = Array.from(items).findIndex(item => item === document.activeElement);
      let nextIndex = currentIndex;

      switch (e.key) {
        case 'ArrowDown':
          nextIndex = (currentIndex + 1) % items.length;
          break;
        case 'ArrowUp':
          nextIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
          break;
        case 'Home':
          nextIndex = 0;
          break;
        case 'End':
          nextIndex = items.length - 1;
          break;
        default:
          return;
      }

      if (nextIndex !== currentIndex) {
        (items[nextIndex] as HTMLElement).focus();
        e.preventDefault();
      }
    }
  },

  // ARIA helpers
  aria: {
    setExpanded: (element: HTMLElement, expanded: boolean) => {
      element.setAttribute('aria-expanded', String(expanded));
    },

    setSelected: (element: HTMLElement, selected: boolean) => {
      element.setAttribute('aria-selected', String(selected));
    },

    setPressed: (element: HTMLElement, pressed: boolean) => {
      element.setAttribute('aria-pressed', String(pressed));
    },

    describedBy: (element: HTMLElement, descriptionId: string) => {
      element.setAttribute('aria-describedby', descriptionId);
    },

    labelledBy: (element: HTMLElement, labelId: string) => {
      element.setAttribute('aria-labelledby', labelId);
    }
  },

  // Color contrast checker
  contrast: {
    ratio: (color1: string, color2: string): number => {
      const getLuminance = (color: string) => {
        const rgb = color.match(/\d+/g);
        if (!rgb) return 0;
        
        const [r, g, b] = rgb.map(val => {
          const sRGB = parseInt(val) / 255;
          return sRGB <= 0.03928
            ? sRGB / 12.92
            : Math.pow((sRGB + 0.055) / 1.055, 2.4);
        });
        
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };

      const l1 = getLuminance(color1);
      const l2 = getLuminance(color2);
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      
      return (lighter + 0.05) / (darker + 0.05);
    },

    meetsWCAG: (ratio: number, level: 'AA' | 'AAA' = 'AA'): boolean => {
      return level === 'AA' ? ratio >= 4.5 : ratio >= 7;
    }
  }
};

export default a11y;