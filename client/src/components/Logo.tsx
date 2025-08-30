import React from 'react';
import { Link } from 'react-router-dom';
import './Logo.css';

const Logo: React.FC = () => {
  return (
    <Link to="/" className="logo-container" style={{ textDecoration: 'none' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <span 
          style={{ 
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#5B4A9F',
            letterSpacing: '-0.02em',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            marginBottom: '0.2rem'
          }}
        >
          panchroma
        </span>
        <div 
          style={{
            width: '100%',
            height: '4px',
            background: 'linear-gradient(90deg, #FF0000 0%, #FF7F00 14%, #FFFF00 28%, #00FF00 42%, #0000FF 56%, #4B0082 70%, #9400D3 84%, #FF1493 100%)',
            borderRadius: '2px'
          }}
        />
      </div>
    </Link>
  );
};

export default Logo;