import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { BellRing, AlarmClock, Volume2, CheckCircle, Clock as SnoozeIcon, PowerOff } from 'lucide-react';
import { BmoAlarm } from '../types';

interface BmoAlarmRingingModalProps {
  alarm: BmoAlarm;
  onDismiss: () => void;
  onSnooze: () => void;
  bmoName?: string;
}

export const BmoAlarmRingingModal: React.FC<BmoAlarmRingingModalProps> = ({
  alarm,
  onDismiss,
  onSnooze,
  bmoName = 'BMO',
}) => {
  // Mobile vibration when modal mounts
  useEffect(() => {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([400, 200, 400, 200, 600, 200, 400]);
      } catch (e) {}
    }
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4 sm:p-6 overflow-hidden animate-fade-in">
      {/* Background Animated Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 2.5, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-96 h-96 rounded-full bg-amber-500/20 border-2 border-amber-400/40"
        />
        <motion.div
          animate={{ scale: [1, 3, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ repeat: Infinity, duration: 2, delay: 0.5, ease: 'easeInOut' }}
          className="w-96 h-96 rounded-full bg-teal-500/20 border-2 border-teal-400/40"
        />
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        className="relative z-10 w-full max-w-md bg-gradient-to-b from-slate-900 via-teal-950 to-slate-900 border-2 border-amber-400/80 rounded-3xl p-6 sm:p-8 text-white shadow-2xl text-center space-y-6"
      >
        {/* Animated Ringing Bell & BMO Badge */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <motion.div
            animate={{ rotate: [-15, 15, -15, 15, 0], scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut' }}
            className="w-20 h-20 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg ring-4 ring-amber-400/30"
          >
            <BellRing className="w-10 h-10 animate-bounce" />
          </motion.div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider">
            <AlarmClock className="w-3.5 h-3.5" />
            <span>{bmoName} Alarme Disparado!</span>
          </div>
        </div>

        {/* Time & Label */}
        <div className="space-y-1">
          <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white drop-shadow-md">
            {alarm.time}
          </div>
          <p className="text-lg font-bold text-amber-200 capitalize">
            {alarm.label || 'Hora do Alarme do BMO!'}
          </p>
        </div>

        {/* Audio Wave Indicator */}
        <div className="flex justify-center items-center gap-1.5 py-1">
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ height: [12, 32, 12] }}
              transition={{ repeat: Infinity, duration: 0.4 + i * 0.1, ease: 'easeInOut' }}
              className="w-2 rounded-full bg-amber-400"
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={onSnooze}
            className="py-4 px-4 bg-slate-800 hover:bg-slate-700 text-amber-300 font-extrabold rounded-2xl border border-amber-400/30 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm shadow-md active:scale-95"
          >
            <SnoozeIcon className="w-5 h-5" />
            <span>Soneca (+5m)</span>
          </button>

          <button
            type="button"
            onClick={onDismiss}
            className="py-4 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm shadow-lg active:scale-95"
          >
            <PowerOff className="w-5 h-5" />
            <span>Desligar</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
