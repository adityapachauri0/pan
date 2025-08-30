export const theme = {
  colors: {
    primary: '#10B981', // Emerald green
    secondary: '#F59E0B', // Amber/Gold
    accent: '#EC4899', // Warm coral (not pink)
    dark: '#1F2937', // Charcoal
    darker: '#111827', // Deep charcoal
    light: '#F9FAFB', // Off-white
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
    gradient: {
      primary: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      secondary: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      dark: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
      hero: 'linear-gradient(135deg, #10B981 0%, #047857 50%, #065F46 100%)',
    },
    shadow: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      glow: '0 0 30px rgba(16, 185, 129, 0.3)',
    }
  },
  fonts: {
    heading: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"JetBrains Mono", "Fira Code", monospace',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  animation: {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'bounce 1s infinite',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  }
};