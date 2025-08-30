import React from 'react';

// Complete Platform Logo Component with all 20+ platforms
export const PlatformLogo: React.FC<{ 
  name: string,
  className?: string 
}> = ({ name, className = "w-12 h-12" }) => {
  const platforms: { [key: string]: React.ReactElement } = {
    'Google Ads': (
      <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* White background */}
        <rect width="48" height="48" rx="12" fill="white"/>
        
        {/* Modern Google Ads logo - Two overlapping triangular shapes */}
        {/* Blue triangle - pointing right */}
        <path 
          d="M9.5 30.5L23.5 8.5L30.5 30.5H9.5Z" 
          fill="#4285F4"
        />
        
        {/* Green triangle - overlapping, pointing left */}
        <path 
          d="M24.5 17.5L38.5 39.5H17.5L24.5 17.5Z" 
          fill="#34A853"
        />
        
        {/* Yellow overlap area where triangles meet */}
        <path 
          d="M24.5 17.5L30.5 30.5H17.5L24.5 17.5Z" 
          fill="#FBBC04"
          opacity="0.9"
        />
      </svg>
    ),
    'Facebook': (
      <svg className={className} viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="#1877F2"/>
        <path d="M33 25h-6v18h-8V25h-4v-6h4v-4c0-5 3-8 8-8h6v6h-4c-1 0-2 1-2 2v4h6l-1 6z" fill="white"/>
      </svg>
    ),
    'Instagram': (
      <svg className={className} viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="url(#igGrad)"/>
        <defs>
          <linearGradient id="igGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FED576"/>
            <stop offset="26%" stopColor="#F47133"/>
            <stop offset="61%" stopColor="#BC3081"/>
            <stop offset="100%" stopColor="#4F5BD5"/>
          </linearGradient>
        </defs>
        <rect x="12" y="12" width="24" height="24" rx="8" stroke="white" strokeWidth="2" fill="none"/>
        <circle cx="24" cy="24" r="6" stroke="white" strokeWidth="2" fill="none"/>
        <circle cx="32" cy="16" r="2" fill="white"/>
      </svg>
    ),
    'TikTok': (
      <svg className={className} viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="#000"/>
        <path d="M38 15a9 9 0 01-9-9h-6v27a6 6 0 11-6-6v-6a12 12 0 1012 12V20a15 15 0 009 3v-8z" fill="#FF0050"/>
        <path d="M36 13a9 9 0 01-9-9h-4v27a6 6 0 11-6-6v-4" stroke="white" strokeWidth="1"/>
      </svg>
    ),
    'LinkedIn': (
      <svg className={className} viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="#0A66C2"/>
        <path d="M16 20h5v16h-5V20zm2.5-7.5a3 3 0 110 6 3 3 0 010-6zM24 20h5v2h.1c.7-1.3 2.4-2.6 4.9-2.6 5.3 0 6.3 3.5 6.3 8v8.6h-5.2v-7.6c0-2 0-4.5-2.7-4.5s-3.2 2.1-3.2 4.3v7.8H24V20z" fill="white"/>
      </svg>
    ),
    'Twitter/X': (
      <svg className={className} viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="#000"/>
        <path d="M10 10l11 14-11 14h4l9-11.5L30 38h8L26 23l11-13h-4l-8 10L19 10h-9zm6 3h3l14 20h-3L16 13z" fill="white"/>
      </svg>
    ),
    'Snapchat': (
      <svg className={className} viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="#FFFC00"/>
        <path d="M24 8c-5 0-9 3-9 8v6c0 1-2 1-2 2s2 2 3 2c0 2-3 3-3 4s2 1 4 1c1 3 4 5 8 5s7-2 8-5c2 0 4 0 4-1s-3-2-3-4c1 0 3-1 3-2s-2-1-2-2v-6c0-5-4-8-9-8h-2z" fill="#000"/>
      </svg>
    ),
    'Pinterest': (
      <svg className={className} viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="#E60023"/>
        <path d="M24 8C15.2 8 8 15.2 8 24c0 6.8 4.2 12.6 10.2 14.9-.1-1.3-.2-3.2 0-4.6l2.2-9.3s-.6-1.1-.6-2.8c0-2.6 1.5-4.6 3.4-4.6 1.6 0 2.4 1.2 2.4 2.6 0 1.6-1 4-1.5 6.2-.4 1.9.9 3.4 2.8 3.4 3.4 0 6-3.6 6-8.7 0-4.6-3.3-7.8-8-7.8-5.4 0-8.6 4.1-8.6 8.3 0 1.6.6 3.4 1.4 4.3.2.2.2.3.1.6l-.5 2.1c-.1.3-.3.4-.6.3-2.4-1.1-3.9-4.6-3.9-7.4 0-6 4.4-11.6 12.6-11.6 6.6 0 11.8 4.7 11.8 11 0 6.6-4.1 11.9-9.9 11.9-1.9 0-3.7-1-4.3-2.2l-1.2 4.5c-.4 1.6-1.5 3.6-2.3 4.8 1.7.5 3.5.8 5.4.8 8.8 0 16-7.2 16-16s-7.2-16-16-16z" fill="white"/>
      </svg>
    ),
    'YouTube': (
      <svg className={className} viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="#FF0000"/>
        <path d="M38.5 16.5s-.3-2.1-1.2-3c-1.1-1.2-2.4-1.2-3-1.3C30.1 12 24 12 24 12s-6.1 0-10.3.2c-.6.1-1.9.1-3 1.3-.9.9-1.2 3-1.2 3S9.2 19 9.2 21.5v2.3c0 2.5.3 5 .3 5s.3 2.1 1.2 3c1.1 1.2 2.6 1.1 3.3 1.3 2.4.2 10 .3 10 .3s6.1 0 10.3-.2c.6-.1 1.9-.1 3-1.3.9-.9 1.2-3 1.2-3s.3-2.5.3-5v-2.3c0-2.5-.3-5-.3-5zM20.5 28.5v-9l8 4.5-8 4.5z" fill="white"/>
      </svg>
    ),
    'Taboola': (
      <svg className={className} viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="#007CFF"/>
        <circle cx="24" cy="24" r="12" fill="white"/>
        <circle cx="24" cy="24" r="6" fill="#007CFF"/>
      </svg>
    ),
    'Outbrain': (
      <svg className={className} viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="#F46E3E"/>
        <path d="M24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12 12 5.4 12 12-5.4 12-12 12zm0-20c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z" fill="white"/>
      </svg>
    ),
    'Reddit': (
      <svg className={className} viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="#FF4500"/>
        <circle cx="36" cy="18" r="3" fill="white"/>
        <ellipse cx="24" cy="28" rx="14" ry="10" fill="white"/>
        <circle cx="19" cy="26" r="2" fill="#FF4500"/>
        <circle cx="29" cy="26" r="2" fill="#FF4500"/>
        <path d="M19 32c0 2.8 2.2 5 5 5s5-2.2 5-5" stroke="#FF4500" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <circle cx="10" cy="26" r="3" fill="white"/>
        <circle cx="38" cy="26" r="3" fill="white"/>
        <path d="M24 13v5" stroke="white" strokeWidth="2"/>
      </svg>
    ),
    'Quora': (
      <svg className={className} viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="#B92B27"/>
        <path d="M31.5 34c.5 1.5 1.5 2 3 2 1 0 2-.5 2.5-1v3c-1 .5-2 1-3.5 1-3 0-5-1.5-6-4-1.5 2.5-4 4-7.5 4-6 0-10-4.5-10-12s4-12 10-12 10 4.5 10 12c0 2-.5 4-1.5 5.5.5.5 1 1 1.5 1.5h1.5zm-11.5-1c3 0 5-2 5-6s-2-6-5-6-5 2-5 6 2 6 5 6z" fill="white"/>
      </svg>
    ),
    'Amazon DSP': (
      <svg className={className} viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="#232F3E"/>
        <path d="M29 26c0 4-3 7-7 7s-7-3-7-7c0-5 3-10 7-10s7 5 7 10z" fill="#FF9900"/>
        <path d="M33 27c0 6-5 9-11 9s-11-3-11-9" stroke="#FF9900" strokeWidth="2" fill="none"/>
        <path d="M32 30l3 4" stroke="#FF9900" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    'Microsoft Ads': (
      <svg className={className} viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="white"/>
        <rect x="10" y="10" width="13" height="13" fill="#F25022"/>
        <rect x="25" y="10" width="13" height="13" fill="#7FBA00"/>
        <rect x="10" y="25" width="13" height="13" fill="#00A4EF"/>
        <rect x="25" y="25" width="13" height="13" fill="#FFB900"/>
      </svg>
    ),
    'Apple Search': (
      <svg className={className} viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="#000"/>
        <path d="M31 35.5c-1.1 1.6-2.3 2.5-3.5 2.5s-2-.5-3.5-.5-2.3.5-3.5.5-2.4-.9-3.5-2.5c-2.2-3.2-3-7.5-3-10.5 0-5 3-8 6-8 1.5 0 2.5.5 3.5.5s2-.5 3.5-.5c1.5 0 3 .5 4.5 2-2 1-3.5 3-3.5 5.5 0 2.5 1.5 4.5 3.5 5.5-.5 1.5-1 2.5-1.5 3.5zM27 10c0 1.5-.5 3-1.5 4s-2 1.5-3.5 1.5c0-1.5.5-3 1.5-4s2.5-1.5 3.5-1.5z" fill="white"/>
      </svg>
    ),
    'Spotify': (
      <svg className={className} viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="#1DB954"/>
        <path d="M24 10C16.3 10 10 16.3 10 24s6.3 14 14 14 14-6.3 14-14-6.3-14-14-14zm6.4 20.2c-.2.4-.7.5-1.1.2-3-1.8-6.8-2.2-11.3-1.2-.4.1-.9-.2-1-.6-.1-.4.2-.9.6-1 4.9-1.1 9.1-.6 12.5 1.4.5.2.5.8.3 1.2zm1.5-3.4c-.3.5-.9.6-1.4.3-3.4-2.1-8.7-2.7-12.7-1.5-.5.2-1.1-.1-1.3-.6-.2-.5.1-1.1.6-1.3 4.7-1.4 10.5-.7 14.5 1.7.5.3.6.9.3 1.4zm.1-3.5c-4.1-2.4-10.9-2.7-14.8-1.5-.6.2-1.3-.1-1.5-.7-.2-.6.1-1.3.7-1.5 4.5-1.4 12-1.1 16.7 1.7.6.3.8 1.1.4 1.6-.3.6-1 .7-1.5.4z" fill="white"/>
      </svg>
    ),
    'Podcast Ads': (
      <svg className={className} viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="#8E44AD"/>
        <path d="M24 12c-5 0-9 4-9 9 0 3.5 2 6.5 5 8v7l4 2 4-2v-7c3-1.5 5-4.5 5-8 0-5-4-9-9-9zm0 6c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z" fill="white"/>
        <path d="M18 21c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="white" strokeWidth="2" fill="none"/>
      </svg>
    ),
    'Display Networks': (
      <svg className={className} viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="url(#displayGrad)"/>
        <defs>
          <linearGradient id="displayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667EEA"/>
            <stop offset="100%" stopColor="#764BA2"/>
          </linearGradient>
        </defs>
        <rect x="10" y="14" width="28" height="20" rx="2" stroke="white" strokeWidth="2" fill="none"/>
        <rect x="14" y="18" width="8" height="6" fill="white"/>
        <rect x="26" y="18" width="8" height="6" fill="white"/>
        <rect x="14" y="26" width="20" height="2" fill="white"/>
      </svg>
    ),
    'Email': (
      <svg className={className} viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="#EA4335"/>
        <path d="M12 16h24v16c0 1.1-.9 2-2 2H14c-1.1 0-2-.9-2-2V16z" stroke="white" strokeWidth="2" fill="none"/>
        <path d="M12 16l12 8 12-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
    'SMS': (
      <svg className={className} viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="#25D366"/>
        <path d="M34 14c0-1.1-.9-2-2-2H16c-1.1 0-2 .9-2 2v20c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V14z" stroke="white" strokeWidth="2" fill="none"/>
        <circle cx="24" cy="32" r="2" fill="white"/>
        <rect x="18" y="16" width="12" height="12" rx="1" fill="white"/>
      </svg>
    )
  };

  return platforms[name] || (
    <div className={`${className} rounded-lg bg-gradient-to-br from-purple-500/50 to-blue-500/50 flex items-center justify-center`}>
      <span className="text-white text-xs font-bold">{name.substring(0, 2).toUpperCase()}</span>
    </div>
  );
};

export default PlatformLogo;