import React from 'react';
import bmoBgImage from '../assets/images/bmo_interior_bg_1786576363102.jpg';

export const BmoInteriorBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Background Image of BMO Internal Circuitry */}
      <img
        src={bmoBgImage}
        alt="BMO Internal Machinery Background"
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover opacity-25 scale-105 filter contrast-125 saturate-110 brightness-90 transition-all duration-1000"
      />

      {/* Dark Vignette Overlay for Contrast */}
      <div className="absolute inset-0 bg-radial from-transparent via-slate-950/60 to-slate-950/95" />

      {/* Animated Glowing Heart Effect Overlay */}
      <div className="absolute top-1/2 right-1/4 w-48 h-48 -translate-y-1/2 rounded-full bg-amber-500/15 blur-3xl animate-pulse pointer-events-none" />

      {/* Blinking Circuit LEDs */}
      <div className="absolute top-12 left-12 w-2 h-2 rounded-full bg-emerald-400/80 animate-ping" />
      <div className="absolute top-24 right-16 w-1.5 h-1.5 rounded-full bg-amber-400/80 animate-pulse" />
      <div className="absolute bottom-20 left-1/3 w-2 h-2 rounded-full bg-teal-400/70 animate-bounce" />
    </div>
  );
};
