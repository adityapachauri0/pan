import { useEffect, useRef, useState } from 'react';

interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  animationClass?: string;
  once?: boolean;
}

export const useScrollAnimation = (
  options: ScrollAnimationOptions = {}
) => {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    animationClass = 'revealed',
    once = true
  } = options;

  const elementRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          element.classList.add(animationClass);
          
          // Add staggered animation for children
          const children = element.querySelectorAll('[data-animate]');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add(animationClass);
            }, index * 100);
          });

          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsVisible(false);
          element.classList.remove(animationClass);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, animationClass, once]);

  return { ref: elementRef, isVisible };
};

// Parallax scroll hook
export const useParallax = (speed: number = 0.5) => {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const rect = element.getBoundingClientRect();
      const yPos = -(scrolled - rect.top) * speed;
      
      element.style.transform = `translateY(${yPos}px)`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return elementRef;
};

// Smooth scroll to section
export const useSmoothScroll = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Navbar height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return { scrollToSection };
};