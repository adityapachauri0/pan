import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import './DarkModeToggle.css';

const DarkModeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Add smooth transition
    document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
  }, [isDark]);

  const toggle = () => {
    setIsDark(!isDark);
    
    // Add animation effect
    const toggleBtn = document.querySelector('.dark-mode-toggle');
    if (toggleBtn) {
      toggleBtn.classList.add('rotating');
      setTimeout(() => toggleBtn.classList.remove('rotating'), 500);
    }
  };

  return (
    <button
      className="dark-mode-toggle"
      onClick={toggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="toggle-inner">
        {isDark ? (
          <FaSun className="toggle-icon sun" />
        ) : (
          <FaMoon className="toggle-icon moon" />
        )}
      </div>
    </button>
  );
};

export default DarkModeToggle;