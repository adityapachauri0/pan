import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LiveChat from './components/LiveChat';
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor';
import analytics from './utils/analytics';
import './App.css';
import './components/ErrorBoundary.css';

// Lazy load pages for better performance
const HomePage = React.lazy(() => import('./pages/HomePage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const ServicesPage = React.lazy(() => import('./pages/ServicesPage'));
const PortfolioPage = React.lazy(() => import('./pages/PortfolioPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));

function App() {
  // Initialize performance monitoring
  usePerformanceMonitor();

  useEffect(() => {
    // Initialize analytics in production
    if (process.env.NODE_ENV === 'production') {
      analytics.init();
    }

    // Set up error tracking
    const handleUnhandledError = (event: ErrorEvent) => {
      analytics.error(event.error?.toString() || 'Unhandled JavaScript error', false);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      analytics.error(`Unhandled promise rejection: ${event.reason}`, false);
    };

    window.addEventListener('error', handleUnhandledError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleUnhandledError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <Router>
          <div className="App" role="main">
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>
            
            <Navbar />
            
            <main id="main-content">
              <Suspense fallback={<LoadingScreen message="Loading page..." />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/portfolio" element={<PortfolioPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                </Routes>
              </Suspense>
            </main>
            
            <Footer />
            
            {process.env.REACT_APP_ENABLE_CHAT === 'true' && <LiveChat />}
            
            <ToastContainer 
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
              toastClassName="custom-toast"
              progressClassName="custom-toast-progress"
              role="alert"
              aria-live="polite"
            />
          </div>
        </Router>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
