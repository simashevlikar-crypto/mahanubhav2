import React from 'react';

interface AppLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showStatus?: boolean;
  variant?: 'icon' | 'full';
}

export default function AppLogo({ 
  className = '', 
  size = 'md', 
  showStatus = true,
  variant = 'full'
}: AppLogoProps) {
  
  if (variant === 'icon') {
    const iconSizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10 md:w-12 md:h-12',
      lg: 'w-16 h-16',
      xl: 'w-24 h-24',
      full: 'w-32 h-32'
    }[size];

    return (
      <div className={`relative shrink-0 ${className}`}>
        <div className={`${iconSizeClasses} rounded-full bg-slate-950 p-0.5 border-2 border-[#FFD54F] shadow-lg shadow-amber-500/30 flex items-center justify-center overflow-hidden transition-transform hover:scale-105`}>
          <svg viewBox="0 0 500 500" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="iconGlobeGrad" cx="50%" cy="45%" r="55%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="60%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#020617" />
              </radialGradient>
              <radialGradient id="iconSunGlow" cx="80%" cy="20%" r="40%">
                <stop offset="0%" stopColor="#FFE066" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="iconGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF2A3" />
                <stop offset="30%" stopColor="#F59E0B" />
                <stop offset="70%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#78350F" />
              </linearGradient>
            </defs>

            {/* Globe Circle */}
            <circle cx="250" cy="250" r="235" fill="url(#iconGlobeGrad)" stroke="#F59E0B" strokeWidth="6" />
            <circle cx="250" cy="250" r="235" fill="url(#iconSunGlow)" />

            {/* India Map Graphic Shape */}
            <path
              d="M 230 180 Q 250 170 270 185 T 290 220 Q 270 250 250 280 Q 235 250 220 220 Z"
              fill="#F59E0B"
              opacity="0.85"
            />

            {/* Flagpole and White Flag with Blue Chakra */}
            <line x1="160" y1="110" x2="160" y2="260" stroke="#FFD54F" strokeWidth="6" strokeLinecap="round" />
            <path d="M 160 110 L 160 100 L 163 95 L 166 100 L 166 110 Z" fill="#FFD54F" />
            <path
              d="M 163 115 C 195 105, 215 125, 255 115 C 245 155, 205 140, 163 165 Z"
              fill="#FFFFFF"
              stroke="#CBD5E1"
              strokeWidth="2"
            />
            {/* Chakra on Flag */}
            <g transform="translate(202, 133) scale(0.65)">
              <circle cx="0" cy="0" r="22" stroke="#0284c7" strokeWidth="3" fill="none" />
              <circle cx="0" cy="0" r="16" stroke="#0284c7" strokeWidth="1.5" fill="none" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <line
                  key={angle}
                  x1="0"
                  y1="0"
                  x2={16 * Math.cos((angle * Math.PI) / 180)}
                  y2={16 * Math.sin((angle * Math.PI) / 180)}
                  stroke="#0284c7"
                  strokeWidth="2"
                />
              ))}
              <circle cx="0" cy="0" r="4" fill="#0284c7" />
            </g>

            {/* Main Text Mahanubhav */}
            <text
              x="250"
              y="320"
              textAnchor="middle"
              className="font-black"
              style={{
                fontFamily: "'Anek Devanagari', 'Noto Sans Devanagari', sans-serif",
                fontSize: '82px',
                fontWeight: 900,
                fill: 'url(#iconGoldGrad)',
                stroke: '#3a1502',
                strokeWidth: '4px',
                paintOrder: 'stroke fill',
                filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.9))'
              }}
            >
              महानुभाव
            </text>

            {/* Sub Text Vishwa */}
            <text
              x="250"
              y="405"
              textAnchor="middle"
              style={{
                fontFamily: "'Anek Devanagari', 'Noto Sans Devanagari', sans-serif",
                fontSize: '70px',
                fontWeight: 800,
                fill: '#FFFFFF',
                stroke: '#0f172a',
                strokeWidth: '3px',
                paintOrder: 'stroke fill',
                filter: 'drop-shadow(0px 3px 6px rgba(0,0,0,0.8))'
              }}
            >
              विश्व
            </text>
          </svg>
        </div>

        {showStatus && (
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-xs animate-pulse"></span>
        )}
      </div>
    );
  }

  // Full Brand Logo Display
  const fullSizeClasses = {
    sm: 'h-10',
    md: 'h-12 md:h-16',
    lg: 'h-20 md:h-24',
    xl: 'h-28 md:h-36',
    full: 'w-full h-auto'
  }[size];

  return (
    <div className={`relative inline-flex items-center shrink-0 ${className}`}>
      <svg
        viewBox="0 0 540 500"
        className={`${fullSizeClasses} w-auto filter drop-shadow-md hover:drop-shadow-xl transition-all`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Globe Gradient */}
          <radialGradient id="globeGrad" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="55%" stopColor="#0f172a" />
            <stop offset="90%" stopColor="#020617" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>

          {/* Top Right Sunburst Flare */}
          <radialGradient id="sunFlare" cx="72%" cy="22%" r="45%">
            <stop offset="0%" stopColor="#FFF59D" stopOpacity="1" />
            <stop offset="30%" stopColor="#F59E0B" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#D97706" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
          </radialGradient>

          {/* Gold Metallic Text Gradient */}
          <linearGradient id="goldTextGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF9C4" />
            <stop offset="20%" stopColor="#FFE082" />
            <stop offset="50%" stopColor="#FFB300" />
            <stop offset="80%" stopColor="#FF8F00" />
            <stop offset="100%" stopColor="#B75100" />
          </linearGradient>

          {/* Gold Bar Gradient */}
          <linearGradient id="goldBarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#78350F" />
            <stop offset="25%" stopColor="#FFD54F" />
            <stop offset="50%" stopColor="#FFF9C4" />
            <stop offset="75%" stopColor="#FFD54F" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          {/* Silver Metallic Text Gradient */}
          <linearGradient id="silverTextGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#F1F5F9" />
            <stop offset="75%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>

          {/* Flag Shadow Filter */}
          <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* 1. GLOBE BACKGROUND SPHERE */}
        <circle cx="270" cy="220" r="195" fill="url(#globeGrad)" stroke="#B45309" strokeWidth="3" />
        <circle cx="270" cy="220" r="195" fill="url(#sunFlare)" />

        {/* Grid latitude lines */}
        <ellipse cx="270" cy="160" rx="180" ry="40" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 4" opacity="0.25" fill="none" />
        <ellipse cx="270" cy="220" rx="195" ry="50" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.3" fill="none" />
        <ellipse cx="270" cy="280" rx="170" ry="40" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 4" opacity="0.25" fill="none" />
        
        {/* Grid longitude curves */}
        <ellipse cx="270" cy="220" rx="70" ry="195" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" opacity="0.25" fill="none" />
        <ellipse cx="270" cy="220" rx="140" ry="195" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" fill="none" />

        {/* Golden India Map Silhouette */}
        <g transform="translate(230, 150)" opacity="0.95" filter="url(#shadow)">
          {/* Stylized India Geography */}
          <path
            d="M 40 -10 Q 55 -20 70 -5 Q 85 15 75 35 Q 60 60 45 95 Q 30 60 20 40 Q 5 20 20 0 Z"
            fill="#F59E0B"
            stroke="#FEF3C7"
            strokeWidth="1.5"
          />
          {/* Subtle Golden Glow Map Texture */}
          <circle cx="45" cy="40" r="30" fill="#FBBF24" opacity="0.4" />
        </g>

        {/* 2. FLAGPOLE AND WHITE FLAG WITH MAHANUBHAV CHAKRA */}
        <g filter="url(#shadow)">
          {/* Gold Spearhead Tip */}
          <path d="M 125 102 L 120 115 L 130 115 Z" fill="#FFD54F" stroke="#B45309" strokeWidth="1" />
          {/* Flagpole */}
          <line x1="125" y1="115" x2="125" y2="260" stroke="#FFD54F" strokeWidth="5" strokeLinecap="round" />

          {/* White Fluttering Flag */}
          <path
            d="M 127 118 C 165 105, 190 130, 235 118 C 225 165, 180 148, 127 178 Z"
            fill="#FFFFFF"
            stroke="#CBD5E1"
            strokeWidth="2"
          />

          {/* Mahanubhav Chakra Symbol on Flag */}
          <g transform="translate(175, 138) scale(0.75)">
            <circle cx="0" cy="0" r="22" stroke="#0284c7" strokeWidth="3" fill="none" />
            <circle cx="0" cy="0" r="17" stroke="#0284c7" strokeWidth="1.5" fill="none" />
            <circle cx="0" cy="0" r="6" stroke="#0284c7" strokeWidth="1.5" fill="#f0f9ff" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <line
                key={angle}
                x1="0"
                y1="0"
                x2={17 * Math.cos((angle * Math.PI) / 180)}
                y2={17 * Math.sin((angle * Math.PI) / 180)}
                stroke="#0284c7"
                strokeWidth="2"
              />
            ))}
            <circle cx="0" cy="0" r="3" fill="#0284c7" />
          </g>
        </g>

        {/* 3. GOLDEN BANNER FRAME & "महानुभाव" TEXT */}
        <g>
          {/* Dark Backing Plate */}
          <path
            d="M 25 240 L 515 240 L 490 325 L 50 325 Z"
            fill="#050a14"
            opacity="0.9"
          />

          {/* Top Gold Border Bar */}
          <path d="M 15 238 L 525 238 L 518 246 L 22 246 Z" fill="url(#goldBarGrad)" />
          
          {/* Bottom Gold Border Bar */}
          <path d="M 45 323 L 495 323 L 488 329 L 52 329 Z" fill="url(#goldBarGrad)" />

          {/* 3D Golden Text "महानुभाव" */}
          {/* Shadow Pass */}
          <text
            x="270"
            y="312"
            textAnchor="middle"
            style={{
              fontFamily: "'Anek Devanagari', 'Rozha One', 'Noto Sans Devanagari', sans-serif",
              fontSize: '86px',
              fontWeight: 900,
              fill: '#1a0500',
              letterSpacing: '1px'
            }}
          >
            महानुभाव
          </text>

          {/* Stroke Outer Pass */}
          <text
            x="270"
            y="310"
            textAnchor="middle"
            style={{
              fontFamily: "'Anek Devanagari', 'Rozha One', 'Noto Sans Devanagari', sans-serif",
              fontSize: '86px',
              fontWeight: 900,
              fill: 'url(#goldTextGrad)',
              stroke: '#2e0a00',
              strokeWidth: '6px',
              paintOrder: 'stroke fill',
              letterSpacing: '1px'
            }}
          >
            महानुभाव
          </text>
        </g>

        {/* 4. SILVER TEXT "विश्व" & FLORAL ORNAMENT */}
        <g transform="translate(0, 10)">
          {/* Subtext "विश्व" */}
          <text
            x="270"
            y="395"
            textAnchor="middle"
            style={{
              fontFamily: "'Anek Devanagari', 'Rozha One', 'Noto Sans Devanagari', sans-serif",
              fontSize: '76px',
              fontWeight: 900,
              fill: 'url(#silverTextGrad)',
              stroke: '#0f172a',
              strokeWidth: '4px',
              paintOrder: 'stroke fill',
              letterSpacing: '2px',
              filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.8))'
            }}
          >
            विश्व
          </text>

          {/* Bottom Gold Underline Bar */}
          <line x1="170" y1="412" x2="370" y2="412" stroke="url(#goldBarGrad)" strokeWidth="3" strokeLinecap="round" />

          {/* Golden Flower / Lotus Motif at Bottom Center */}
          <g transform="translate(270, 420)">
            <path
              d="M 0 -12 C 6 -6, 12 -2, 16 0 C 10 4, 4 8, 0 14 C -4 8, -10 4, -16 0 C -12 -2, -6 -6, 0 -12 Z"
              fill="#FFD54F"
              stroke="#B45309"
              strokeWidth="1"
            />
            <circle cx="0" cy="0" r="3" fill="#78350F" />
            <circle cx="-22" cy="0" r="2.5" fill="#FFD54F" />
            <circle cx="22" cy="0" r="2.5" fill="#FFD54F" />
          </g>
        </g>
      </svg>

      {showStatus && (
        <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-xs animate-pulse"></span>
      )}
    </div>
  );
}
