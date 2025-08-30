import { useEffect } from 'react';

interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

export const usePerformanceMonitor = () => {
  useEffect(() => {
    // Only monitor in production
    if (process.env.NODE_ENV !== 'production') return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Log performance metrics
        console.log(`Performance: ${entry.name} - ${entry.duration}ms`);
        
        // Send to analytics service
        if (window.gtag) {
          window.gtag('event', 'timing_complete', {
            name: entry.name,
            value: Math.round(entry.duration)
          });
        }
      }
    });

    observer.observe({ entryTypes: ['measure', 'navigation', 'paint'] });

    // Web Vitals monitoring
    const trackWebVitals = () => {
      // FCP - First Contentful Paint
      const paintEntries = performance.getEntriesByType('paint');
      const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      
      if (fcp) {
        trackMetric('FCP', fcp.startTime);
      }

      // Navigation timing
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
        trackMetric('TTFB', ttfb);
      }
    };

    const trackMetric = (name: string, value: number) => {
      if (window.gtag) {
        window.gtag('event', 'web_vital', {
          name,
          value: Math.round(value),
          event_category: 'performance'
        });
      }
    };

    // Track on load
    if (document.readyState === 'complete') {
      trackWebVitals();
    } else {
      window.addEventListener('load', trackWebVitals);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('load', trackWebVitals);
    };
  }, []);
};

export default usePerformanceMonitor;