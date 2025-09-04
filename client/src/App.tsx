import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LiveChat from './components/LiveChat';
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor';
import analytics from './utils/analytics';
import './App.css';
import './styles/design-system.css';
import './styles/modern-components.css';
import './styles/animation-fixes.css';
import './styles/shake-prevention.css';
import './styles/animation-override.css';
import './components/ErrorBoundary.css';
import DarkModeToggle from './components/DarkModeToggle';

// Import pages directly - fixing lazy loading issue
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import PortfolioPage from './pages/PortfolioPage';
import ContactPage from './pages/ContactPage';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ThankYouPage from './pages/ThankYouPage';


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
            
            <Routes>
              {/* Public website routes with layout */}
              <Route path="/" element={
                <>
                  <Navbar />
                  <main id="main-content">
                    <HomePage />
                  </main>
                  <Footer />
                  <DarkModeToggle />
                  {process.env.REACT_APP_ENABLE_CHAT === 'true' && <LiveChat />}
                </>
              } />
              <Route path="/about" element={
                <>
                  <Navbar />
                  <main id="main-content">
                    <AboutPage />
                  </main>
                  <Footer />
                  <DarkModeToggle />
                  {process.env.REACT_APP_ENABLE_CHAT === 'true' && <LiveChat />}
                </>
              } />
              <Route path="/services" element={
                <>
                  <Navbar />
                  <main id="main-content">
                    <ServicesPage />
                  </main>
                  <Footer />
                  <DarkModeToggle />
                  {process.env.REACT_APP_ENABLE_CHAT === 'true' && <LiveChat />}
                </>
              } />
              <Route path="/portfolio" element={
                <>
                  <Navbar />
                  <main id="main-content">
                    <PortfolioPage />
                  </main>
                  <Footer />
                  <DarkModeToggle />
                  {process.env.REACT_APP_ENABLE_CHAT === 'true' && <LiveChat />}
                </>
              } />
              <Route path="/contact" element={
                <>
                  <Navbar />
                  <main id="main-content">
                    <ContactPage />
                  </main>
                  <Footer />
                  <DarkModeToggle />
                  {process.env.REACT_APP_ENABLE_CHAT === 'true' && <LiveChat />}
                </>
              } />
              {/* Login route without layout */}
              <Route path="/login" element={<Login />} />
              {/* Dashboard route without layout */}
              <Route path="/dashboard" element={<Dashboard />} />
              {/* Thank You page without layout */}
              <Route path="/thank-you" element={<ThankYouPage />} />
              {/* 404 Page for all other routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            
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
