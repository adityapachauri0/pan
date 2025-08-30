// Google Analytics 4 implementation
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const GA_TRACKING_ID = process.env.REACT_APP_GA_TRACKING_ID || '';

// Initialize Google Analytics
export const initGA = () => {
  if (!GA_TRACKING_ID || typeof window === 'undefined') return;

  // Create gtag function
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };

  // Configure GA
  window.gtag('js', new Date());
  window.gtag('config', GA_TRACKING_ID, {
    page_title: document.title,
    page_location: window.location.href,
  });
};

// Page view tracking
export const trackPageView = (url: string, title?: string) => {
  if (!GA_TRACKING_ID || !window.gtag) return;

  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
    page_title: title || document.title,
  });
};

// Event tracking
export const trackEvent = (
  eventName: string,
  parameters?: {
    event_category?: string;
    event_label?: string;
    value?: number;
    [key: string]: any;
  }
) => {
  if (!GA_TRACKING_ID || !window.gtag) return;

  window.gtag('event', eventName, parameters);
};

// E-commerce tracking
export const trackConversion = (
  value: number,
  currency: string = 'USD',
  transactionId?: string
) => {
  trackEvent('purchase', {
    value,
    currency,
    transaction_id: transactionId,
    event_category: 'ecommerce'
  });
};

// User engagement tracking
export const trackEngagement = (
  action: string,
  category: string = 'engagement',
  label?: string
) => {
  trackEvent(action, {
    event_category: category,
    event_label: label
  });
};

// Form submission tracking
export const trackFormSubmission = (formName: string, success: boolean = true) => {
  trackEvent('form_submit', {
    form_name: formName,
    success: success ? 'true' : 'false',
    event_category: 'forms'
  });
};

// Error tracking
export const trackError = (error: string, fatal: boolean = false) => {
  trackEvent('exception', {
    description: error,
    fatal,
    event_category: 'errors'
  });
};

// Performance tracking
export const trackTiming = (
  name: string,
  value: number,
  category: string = 'performance'
) => {
  trackEvent('timing_complete', {
    name,
    value: Math.round(value),
    event_category: category
  });
};

// Custom event tracking for business metrics
export const trackBusinessEvent = (
  eventName: string,
  properties: Record<string, any> = {}
) => {
  trackEvent(eventName, {
    ...properties,
    event_category: 'business'
  });
};

export default {
  init: initGA,
  pageView: trackPageView,
  event: trackEvent,
  conversion: trackConversion,
  engagement: trackEngagement,
  formSubmission: trackFormSubmission,
  error: trackError,
  timing: trackTiming,
  business: trackBusinessEvent
};