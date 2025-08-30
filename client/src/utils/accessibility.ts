// Accessibility utilities and helpers

// Focus management
export const trapFocus = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  };

  element.addEventListener('keydown', handleTabKey);
  return () => element.removeEventListener('keydown', handleTabKey);
};

// Announce to screen readers
export const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('class', 'sr-only');
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Keyboard navigation helpers
export const handleKeyboardNavigation = (
  e: KeyboardEvent,
  items: HTMLElement[],
  currentIndex: number,
  onSelect?: (index: number) => void
) => {
  let newIndex = currentIndex;

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      break;
    case 'ArrowUp':
      e.preventDefault();
      newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      break;
    case 'Home':
      e.preventDefault();
      newIndex = 0;
      break;
    case 'End':
      e.preventDefault();
      newIndex = items.length - 1;
      break;
    case 'Enter':
    case ' ':
      e.preventDefault();
      onSelect?.(currentIndex);
      return currentIndex;
    case 'Escape':
      e.preventDefault();
      (e.target as HTMLElement).blur();
      return currentIndex;
  }

  if (newIndex !== currentIndex) {
    items[newIndex]?.focus();
    return newIndex;
  }

  return currentIndex;
};

// Color contrast checker
export const checkContrast = (foreground: string, background: string): number => {
  const getRGB = (color: string) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return [r, g, b];
  };

  const getLuminance = (rgb: number[]) => {
    const [r, g, b] = rgb.map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const fgLum = getLuminance(getRGB(foreground));
  const bgLum = getLuminance(getRGB(background));
  const brightest = Math.max(fgLum, bgLum);
  const darkest = Math.min(fgLum, bgLum);

  return (brightest + 0.05) / (darkest + 0.05);
};

// Check if user prefers reduced motion
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// ARIA attributes helpers
export const setAriaExpanded = (element: HTMLElement, expanded: boolean) => {
  element.setAttribute('aria-expanded', expanded.toString());
};

export const setAriaSelected = (element: HTMLElement, selected: boolean) => {
  element.setAttribute('aria-selected', selected.toString());
};

export const setAriaHidden = (element: HTMLElement, hidden: boolean) => {
  element.setAttribute('aria-hidden', hidden.toString());
};

// Generate unique IDs for ARIA relationships
let idCounter = 0;
export const generateId = (prefix = 'aria-id'): string => {
  return `${prefix}-${++idCounter}`;
};

// Form validation and error announcement
export const announceFormError = (fieldName: string, errorMessage: string) => {
  announce(`${fieldName}: ${errorMessage}`, 'assertive');
};

// Loading state announcement
export const announceLoadingState = (isLoading: boolean, context: string) => {
  if (isLoading) {
    announce(`Loading ${context}...`, 'polite');
  } else {
    announce(`${context} loaded`, 'polite');
  }
};

// Navigation announcement
export const announceNavigation = (pageName: string) => {
  announce(`Navigated to ${pageName}`, 'polite');
};

export default {
  trapFocus,
  announce,
  handleKeyboardNavigation,
  checkContrast,
  prefersReducedMotion,
  setAriaExpanded,
  setAriaSelected,
  setAriaHidden,
  generateId,
  announceFormError,
  announceLoadingState,
  announceNavigation
};