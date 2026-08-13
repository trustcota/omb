import React from 'react';
import { motion } from 'motion/react';

export const BmoInteriorBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#09111e] flex items-center justify-center">
      {/* Retro Dark Chassis Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0d1c30] via-[#09111e] to-[#040810]" />

      {/* Subtle Circuit Grid */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(56, 189, 248, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(56, 189, 248, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Main Pixel-Art Vector Scene */}
      <div className="relative w-full h-full max-w-4xl max-h-[90vh] flex items-center justify-center p-4">
        <svg
          viewBox="0 0 400 320"
          className="w-full h-full object-contain filter drop-shadow-[0_0_25px_rgba(245,158,11,0.15)]"
          style={{ imageRendering: 'pixelated' }}
        >
          <defs>
            {/* Heart Glow Filter */}
            <filter id="heartGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Battery Glow */}
            <linearGradient id="batteryGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="25%" stopColor="#fbbf24" />
              <stop offset="70%" stopColor="#fef08a" />
              <stop offset="90%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>

            {/* Robot Module Gradient */}
            <linearGradient id="goldRobotGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="40%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>

          {/* 1. TOP HORIZONTAL TEAL CONDUIT / PIPE */}
          <g id="top-conduit">
            <rect x="220" y="24" width="140" height="18" fill="#134e4a" stroke="#042f2e" strokeWidth="2" rx="4" />
            <rect x="220" y="27" width="140" height="4" fill="#2dd4bf" opacity="0.6" />
            {/* Pipe Joints */}
            <rect x="330" y="20" width="10" height="26" fill="#0f766e" stroke="#042f2e" strokeWidth="2" rx="2" />
            <circle cx="355" cy="33" r="8" fill="#0f766e" stroke="#042f2e" strokeWidth="2" />
          </g>

          {/* 2. TOP-LEFT ROBOTIC COMPUTER MODULE */}
          <g id="robot-module">
            {/* Outer Gold Chassis */}
            <rect x="52" y="10" width="136" height="74" fill="url(#goldRobotGrad)" stroke="#1e293b" strokeWidth="3" rx="2" />
            <rect x="46" y="6" width="148" height="12" fill="#eab308" stroke="#1e293b" strokeWidth="3" rx="2" />
            <rect x="70" y="80" width="100" height="14" fill="#ca8a04" stroke="#1e293b" strokeWidth="3" />

            {/* Blue Eye Sensors (Animated looking around) */}
            <g>
              {/* Left Eye */}
              <circle cx="82" cy="42" r="14" fill="#0284c7" stroke="#1e293b" strokeWidth="3" />
              <circle cx="82" cy="42" r="9" fill="#0369a1" />
              <motion.circle
                cx="82"
                cy="42"
                r="4"
                fill="#0f172a"
                animate={{ cx: [82, 84, 80, 82], cy: [42, 42, 43, 42] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              />
              <circle cx="80" cy="39" r="2" fill="#ffffff" />

              {/* Right Eye */}
              <circle cx="158" cy="42" r="14" fill="#0284c7" stroke="#1e293b" strokeWidth="3" />
              <circle cx="158" cy="42" r="9" fill="#0369a1" />
              <motion.circle
                cx="158"
                cy="42"
                r="4"
                fill="#0f172a"
                animate={{ cx: [158, 160, 156, 158], cy: [42, 42, 43, 42] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              />
              <circle cx="156" cy="39" r="2" fill="#ffffff" />
            </g>

            {/* Robot Module Mouth Slot */}
            <rect x="78" y="62" width="84" height="6" fill="#0f172a" rx="1" />
          </g>

          {/* 3. RAINBOW RIBBON CABLES (Yellow, Red, Cyan, Blue) */}
          <g id="ribbon-cables">
            {/* Left Wall Socket Connector */}
            <path d="M 10 160 L 52 145 L 52 205 L 10 190 Z" fill="#0d9488" stroke="#1e293b" strokeWidth="3" />
            <rect x="0" y="158" width="16" height="34" fill="#0f766e" stroke="#1e293b" strokeWidth="2" />

            {/* Blue Cable (Bottom) */}
            <path
              d="M 160 94 C 160 160, 60 188, 52 195"
              fill="none"
              stroke="#1d4ed8"
              strokeWidth="9"
              strokeLinecap="round"
            />
            {/* Cyan Cable */}
            <path
              d="M 148 94 C 148 152, 60 178, 52 184"
              fill="none"
              stroke="#0284c7"
              strokeWidth="9"
              strokeLinecap="round"
            />
            {/* Red / Pink Cable */}
            <path
              d="M 136 94 C 136 144, 60 168, 52 173"
              fill="none"
              stroke="#e11d48"
              strokeWidth="9"
              strokeLinecap="round"
            />
            {/* Yellow Cable (Top) */}
            <path
              d="M 124 94 C 124 136, 60 156, 52 161"
              fill="none"
              stroke="#facc15"
              strokeWidth="9"
              strokeLinecap="round"
            />

            {/* Cable Highlights & Pixel Ridges */}
            <path d="M 124 94 C 124 136, 60 156, 52 161" fill="none" stroke="#fef08a" strokeWidth="2" strokeDasharray="3 3" />
          </g>

          {/* 4. TINY PINK PIKMIN-LIKE CREATURE ON CABLE */}
          <motion.g
            id="tiny-pikmin"
            animate={{
              y: [0, -3, 0],
              rotate: [0, 2, -2, 0],
            }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            {/* Pikmin Body */}
            <rect x="52" y="118" width="8" height="12" fill="#f43f5e" rx="3" stroke="#881337" strokeWidth="1.5" />
            {/* Eye */}
            <circle cx="55" cy="122" r="1.5" fill="#ffffff" />
            <circle cx="55.5" cy="122" r="0.8" fill="#0f172a" />
            {/* Nose/Snout */}
            <rect x="50" y="123" width="2.5" height="2" fill="#f43f5e" />
            {/* Legs */}
            <rect x="53" y="129" width="2" height="3" fill="#e11d48" />
            <rect x="57" y="129" width="2" height="3" fill="#e11d48" />
            {/* Green Leaf Stem */}
            <motion.path
              d="M 56 118 Q 59 110, 62 108"
              fill="none"
              stroke="#15803d"
              strokeWidth="2"
              strokeLinecap="round"
              animate={{ d: ['M 56 118 Q 59 110, 62 108', 'M 56 118 Q 54 110, 52 108', 'M 56 118 Q 59 110, 62 108'] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            />
            {/* Leaf */}
            <circle cx="62" cy="107" r="3" fill="#22c55e" stroke="#15803d" strokeWidth="1" />
          </motion.g>

          {/* 5. LOWER MOTHERBOARD / CARTRIDGE BOX */}
          <g id="cartridge-box">
            <rect x="42" y="180" width="135" height="124" fill="#fef08a" stroke="#1e293b" strokeWidth="3" rx="2" />
            <rect x="70" y="215" width="78" height="42" fill="#fef9c3" stroke="#ca8a04" strokeWidth="2" rx="2" />
            {/* Golden Bowtie / Hourglass emblem */}
            <g transform="translate(109, 236)">
              <polygon points="-16,-8 0,0 -16,8" fill="#d97706" stroke="#92400e" strokeWidth="1.5" />
              <polygon points="16,-8 0,0 16,8" fill="#d97706" stroke="#92400e" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="4.5" fill="#f59e0b" stroke="#92400e" strokeWidth="1.5" />
            </g>
          </g>

          {/* 6. BMO GOLDEN BATTERY */}
          <g id="bmo-battery" transform="translate(190, 185)">
            {/* Battery Top Terminal */}
            <rect x="22" y="-12" width="18" height="14" fill="#d97706" stroke="#1e293b" strokeWidth="2.5" rx="2" />
            <rect x="25" y="-15" width="12" height="4" fill="#fbbf24" />

            {/* Battery Cylinder Body */}
            <rect x="0" y="0" width="62" height="120" fill="url(#batteryGrad)" stroke="#1e293b" strokeWidth="3" rx="6" />

            {/* Battery Highlights */}
            <rect x="4" y="4" width="6" height="112" fill="#fef08a" opacity="0.6" rx="2" />
            <rect x="14" y="4" width="4" height="112" fill="#ffffff" opacity="0.5" rx="1" />

            {/* Battery Center Anchor / Emblem */}
            <circle cx="31" cy="46" r="10" fill="none" stroke="#1e293b" strokeWidth="3" />
            <circle cx="31" cy="46" r="4" fill="#ca8a04" />
            <line x1="31" y1="56" x2="31" y2="88" stroke="#1e293b" strokeWidth="3" />
            <path d="M 21 78 L 41 78" stroke="#1e293b" strokeWidth="3" />

            {/* Lower Battery Ring */}
            <line x1="0" y1="92" x2="62" y2="92" stroke="#1e293b" strokeWidth="2.5" />
          </g>

          {/* 7. GREEN CAPACITORS BESIDE BATTERY */}
          <g id="capacitors" transform="translate(266, 260)">
            <rect x="0" y="0" width="12" height="45" fill="#047857" stroke="#1e293b" strokeWidth="2" rx="3" />
            <rect x="2" y="3" width="3" height="38" fill="#34d399" opacity="0.7" rx="1" />

            <rect x="18" y="4" width="12" height="41" fill="#065f46" stroke="#1e293b" strokeWidth="2" rx="3" />
            <rect x="20" y="7" width="3" height="34" fill="#34d399" opacity="0.7" rx="1" />
          </g>

          {/* 8. PIPES & VALVE UNDER HEART */}
          <g id="heart-pipes" transform="translate(295, 160)">
            {/* Funnel Receptor under Heart */}
            <polygon points="12,0 48,0 42,20 18,20" fill="#78350f" stroke="#1e293b" strokeWidth="2.5" />
            <rect x="16" y="20" width="28" height="8" fill="#b45309" stroke="#1e293b" strokeWidth="2" />

            {/* Horizontal T-Valve Bar */}
            <rect x="3" y="46" width="54" height="14" fill="#eab308" stroke="#1e293b" strokeWidth="2.5" rx="2" />
            <circle cx="30" cy="53" r="6" fill="#facc15" stroke="#1e293b" strokeWidth="2" />

            {/* Vertical Golden Pipe */}
            <rect x="46" y="60" width="20" height="85" fill="#facc15" stroke="#1e293b" strokeWidth="2.5" rx="3" />
            <rect x="49" y="60" width="4" height="85" fill="#fef08a" />

            {/* Cute Pink Ribbon Bow on Vertical Pipe */}
            <g transform="translate(56, 105)">
              {/* Left Bow Loop */}
              <path d="M 0 0 C -12 -10, -14 10, 0 0" fill="#f43f5e" stroke="#881337" strokeWidth="2" />
              {/* Right Bow Loop */}
              <path d="M 0 0 C 12 -10, 14 10, 0 0" fill="#f43f5e" stroke="#881337" strokeWidth="2" />
              {/* Center Knot */}
              <circle cx="0" cy="0" r="3.5" fill="#e11d48" stroke="#881337" strokeWidth="1.5" />
              {/* Ribbon Tails */}
              <path d="M -2 2 L -8 12" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 2 2 L 8 12" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          </g>

          {/* 9. THE BIG GOLDEN GLOWING SMILING HEART */}
          <motion.g
            id="golden-heart"
            transform="translate(290, 115)"
            animate={{
              scale: [1, 1.07, 1, 1.05, 1],
              filter: [
                'drop-shadow(0 0 12px rgba(251,191,36,0.6))',
                'drop-shadow(0 0 24px rgba(251,191,36,0.9))',
                'drop-shadow(0 0 12px rgba(251,191,36,0.6))',
                'drop-shadow(0 0 20px rgba(251,191,36,0.8))',
                'drop-shadow(0 0 12px rgba(251,191,36,0.6))',
              ],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.6,
              ease: 'easeInOut',
            }}
          >
            {/* Heart Path */}
            <path
              d="M 0 -20 
                 C -35 -65, -85 -30, -75 20 
                 C -65 65, 0 100, 0 100 
                 C 0 100, 65 65, 75 20 
                 C 85 -30, 35 -65, 0 -20 Z"
              fill="#fbbf24"
              stroke="#1e293b"
              strokeWidth="4"
              strokeLinejoin="round"
            />

            {/* Heart Internal Color Gradient/Shading */}
            <path
              d="M 0 -16 
                 C -30 -58, -75 -25, -67 18 
                 C -58 58, 0 90, 0 90 
                 C 0 90, 58 58, 67 18 
                 C 75 -25, 30 -58, 0 -16 Z"
              fill="#f59e0b"
              opacity="0.3"
            />

            {/* Shiny Gloss Highlights (Top-Left & Right) */}
            <path
              d="M -45 -35 C -30 -48, -15 -42, -18 -30 C -22 -18, -48 -20, -45 -35 Z"
              fill="#ffffff"
              opacity="0.9"
            />
            <circle cx="-52" cy="-18" r="4" fill="#ffffff" opacity="0.9" />
            <path
              d="M 38 -36 C 48 -28, 56 -10, 54 8"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              opacity="0.8"
            />

            {/* Sleeping / Happy Eyes (~ ~) */}
            {/* Left Eye */}
            <path
              d="M -38 6 Q -28 16, -18 6"
              fill="none"
              stroke="#581c87"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Right Eye */}
            <path
              d="M 18 6 Q 28 16, 38 6"
              fill="none"
              stroke="#581c87"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Cute Kissy / Smiling Mouth (3 / w) */}
            <path
              d="M -12 30 Q -6 38, 0 32 Q 6 38, 12 30"
              fill="none"
              stroke="#581c87"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </motion.g>

          {/* 10. MULTICOLOR TWINKLING 4-POINT SPARKLE STARS */}
          {/* Bottom Star near Bow */}
          <motion.g
            transform="translate(345, 290)"
            animate={{
              scale: [0.6, 1.3, 0.6],
              rotate: [0, 90, 180],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            {/* 4-point Diamond Star */}
            <polygon points="0,-7 2,-2 7,0 2,2 0,7 -2,2 -7,0 -2,-2" fill="#ffffff" />
            {/* Rainbow Sparkle Points */}
            <circle cx="0" cy="-6" r="1.5" fill="#f43f5e" />
            <circle cx="6" cy="0" r="1.5" fill="#38bdf8" />
            <circle cx="0" cy="6" r="1.5" fill="#facc15" />
            <circle cx="-6" cy="0" r="1.5" fill="#a855f7" />
          </motion.g>

          {/* Top Star near Heart */}
          <motion.g
            transform="translate(235, 100)"
            animate={{
              scale: [1.2, 0.5, 1.2],
              rotate: [0, 45, 90],
              opacity: [0.9, 0.3, 0.9],
            }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          >
            <polygon points="0,-6 2,-2 6,0 2,2 0,6 -2,2 -6,0 -2,-2" fill="#fef08a" />
          </motion.g>

          {/* Left Star near Cable */}
          <motion.g
            transform="translate(40, 90)"
            animate={{
              scale: [0.7, 1.2, 0.7],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          >
            <polygon points="0,-5 1.5,-1.5 5,0 1.5,1.5 0,5 -1.5,1.5 -5,0 -1.5,-1.5" fill="#38bdf8" />
          </motion.g>
        </svg>
      </div>

      {/* Ambient Vignette Overlay */}
      <div className="absolute inset-0 bg-radial from-transparent via-slate-950/40 to-slate-950/80 pointer-events-none" />
    </div>
  );
};
