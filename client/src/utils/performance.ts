// Performance optimization utilities
import React from 'react';

// Debounce function for performance optimization
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// Throttle function for scroll events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Lazy load modules dynamically
export const lazyLoad = (importFunc: () => Promise<any>) => {
  return React.lazy(importFunc);
};

// Preload critical resources
export const preloadResource = (href: string, as: string, type?: string) => {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    document.head.appendChild(link);
  }
};

// Prefetch resources for faster navigation
export const prefetchResource = (href: string) => {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  }
};

// Optimize images with WebP fallback
export const getOptimizedImageSrc = (src: string, width?: number, height?: number, format = 'webp') => {
  if (!src) return src;
  
  const baseUrl = process.env.REACT_APP_CDN_URL || '';
  const params = new URLSearchParams();
  
  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  if (format) params.set('f', format);
  params.set('q', '80'); // Quality
  
  return `${baseUrl}/optimize${src}?${params.toString()}`;
};

// Check if device has reduced motion preference
export const prefersReducedMotion = () => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return false;
};

// Performance monitoring
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map();
  
  mark(name: string) {
    this.marks.set(name, performance.now());
  }
  
  measure(startMark: string, endMark?: string): number {
    const start = this.marks.get(startMark);
    const end = endMark ? this.marks.get(endMark) : performance.now();
    
    if (start === undefined || end === undefined) {
      console.warn(`Performance mark not found: ${startMark} or ${endMark}`);
      return 0;
    }
    
    const duration = end - start;
    console.log(`Performance: ${startMark} took ${duration.toFixed(2)}ms`);
    
    // Send to analytics in production
    if (process.env.NODE_ENV === 'production' && window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: startMark,
        value: Math.round(duration)
      });
    }
    
    return duration;
  }
  
  clear(name?: string) {
    if (name) {
      this.marks.delete(name);
    } else {
      this.marks.clear();
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Critical CSS inlining
export const inlineCriticalCSS = (css: string) => {
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }
};

// Service Worker registration
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered: ', registration);
      return registration;
    } catch (registrationError) {
      console.log('SW registration failed: ', registrationError);
    }
  }
};

// Memory usage monitoring
export const monitorMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    console.log('Memory Usage:', {
      used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + ' MB',
      total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + ' MB',
      limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + ' MB'
    });
  }
};

// Network information
export const getNetworkInfo = () => {
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    };
  }
  return null;
};

export default {
  debounce,
  throttle,
  lazyLoad,
  preloadResource,
  prefetchResource,
  getOptimizedImageSrc,
  prefersReducedMotion,
  performanceMonitor,
  inlineCriticalCSS,
  registerServiceWorker,
  monitorMemoryUsage,
  getNetworkInfo
};