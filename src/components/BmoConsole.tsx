import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw } from 'lucide-react';
import { BmoCustomization } from '../types';

export type Expression = 'happy' | 'excited' | 'sad' | 'sleepy' | 'surprised' | 'love' | 'updating';

interface BmoConsoleProps {
  isConnected: boolean;
  isCharging?: boolean;
  batteryLevel?: number; // 0 to 100
  deviceName?: string | null;
  manualExpression?: Expression;
  onFaceTap?: () => void;
  tapCountFeedback?: number;
  isUpdating?: boolean;
  updateProgress?: number;
  updateMessage?: string;
  customization?: BmoCustomization;
  isSleeping?: boolean;
  isYawning?: boolean;
  isNoddingOff?: boolean;
  dimOpacity?: number;
}

export const BmoConsole: React.FC<BmoConsoleProps> = ({
  isConnected,
  isCharging = false,
  batteryLevel = 100,
  manualExpression,
  onFaceTap,
  tapCountFeedback = 0,
  isUpdating = false,
  updateProgress = 0,
  updateMessage = '',
  customization = {
    gender: 'boy',
    accessory: 'none',
    theme: 'classic',
    name: 'BMO',
  },
  isSleeping = false,
  isYawning = false,
  isNoddingOff = false,
  dimOpacity = 0,
}) => {
  const [blinking, setBlinking] = useState(false);
  const [startled, setStartled] = useState(false);

  // Blink effect periodically when awake
  useEffect(() => {
    if (isSleeping) return;
    const interval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 220);
    }, 3200);

    return () => clearInterval(interval);
  }, [isSleeping]);

  // Nodding off "Pescada de sono / Acordar no susto" loop
  useEffect(() => {
    if (!isNoddingOff || isSleeping) {
      setStartled(false);
      return;
    }

    const interval = setInterval(() => {
      // Startle awake after drooping!
      setStartled(true);
      setTimeout(() => {
        setStartled(false);
      }, 900);
    }, 4500);

    return () => clearInterval(interval);
  }, [isNoddingOff, isSleeping]);

  const handleTapWithFullscreen = () => {
    if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
    if (onFaceTap) {
      onFaceTap();
    }
  };

  // Determine default expression based on battery level & connection
  const getDefaultExpression = (): Expression => {
    if (isUpdating) return 'updating';
    if (isSleeping) return 'sleepy';
    if (batteryLevel <= 10) return 'sleepy';
    if (batteryLevel <= 30) return 'happy';
    if (isConnected || isCharging) return 'excited';
    return 'happy';
  };

  const currentExpression: Expression = isUpdating ? 'updating' : (manualExpression || getDefaultExpression());

  // Screen background color based on status and chosen theme
  const getScreenColor = () => {
    if (isSleeping) {
      return {
        bg: 'from-[#071312] via-[#0d221e] to-[#050e0d]',
        faceColor: '#689d91',
        cheekColor: '#1a4038',
      };
    }

    if (isUpdating) {
      return {
        bg: 'from-[#1b4332] via-[#2d6a4f] to-[#40916c]',
        faceColor: '#d8f3dc',
        cheekColor: '#ff9ebb',
      };
    }

    if (currentExpression === 'sad') {
      return {
        bg: 'from-[#142828] via-[#1a3636] to-[#254646]',
        faceColor: '#5c8c8c',
        cheekColor: '#284646',
      };
    }

    if (batteryLevel <= 15 && !isConnected && !isCharging) {
      return {
        bg: 'from-[#4a1c1d] via-[#6e2226] to-[#8d2a2e]',
        faceColor: '#ff9999',
        cheekColor: '#cc3333',
      };
    }

    // Theme variations for healthy BMO state
    switch (customization.theme) {
      case 'pink':
        return {
          bg: 'from-[#ffb2c9] via-[#f78ca0] to-[#f472b6]',
          faceColor: '#4a0e2e',
          cheekColor: '#ff4d8d',
        };
      case 'blue':
        return {
          bg: 'from-[#7dd3fc] via-[#38bdf8] to-[#0284c7]',
          faceColor: '#032b45',
          cheekColor: '#ff7fa8',
        };
      case 'purple':
        return {
          bg: 'from-[#d8b4fe] via-[#c084fc] to-[#9333ea]',
          faceColor: '#2e1065',
          cheekColor: '#ff70a6',
        };
      case 'gold':
        return {
          bg: 'from-[#fde047] via-[#eab308] to-[#ca8a04]',
          faceColor: '#422006',
          cheekColor: '#ff6b6b',
        };
      case 'classic':
      default:
        switch (currentExpression) {
          case 'excited':
            return {
              bg: 'from-[#8ff5da] via-[#5ee6c4] to-[#3bd4ad]',
              faceColor: '#093d33',
              cheekColor: '#ff7fa8',
            };
          case 'love':
            return {
              bg: 'from-[#ffcdd2] via-[#f8bbd0] to-[#f48fb1]',
              faceColor: '#6a1b9a',
              cheekColor: '#ff80ab',
            };
          case 'happy':
          default:
            return {
              bg: 'from-[#8eeada] via-[#5ed2bd] to-[#3bbba5]',
              faceColor: '#0a4237',
              cheekColor: '#ff85a2',
            };
        }
    }
  };

  const style = getScreenColor();

  // Determine active accessory (explicit accessory or default by gender)
  const effectiveAccessory =
    customization.accessory !== 'none'
      ? customization.accessory
      : customization.gender === 'girl'
      ? 'hairbow'
      : 'bowtie';

  return (
    <div
      onClick={handleTapWithFullscreen}
      className={`fixed inset-0 w-screen h-screen h-[100dvh] w-[100dvw] bg-gradient-to-b ${style.bg} transition-all duration-700 overflow-hidden flex flex-col items-center justify-center cursor-pointer select-none z-50 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]`}
    >
      {/* CRT Scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.04)_50%)] bg-[length:100%_4px] pointer-events-none z-10" />

      {/* GRADUAL SCREEN DIMMING OVERLAY */}
      {dimOpacity > 0 && (
        <div
          className="fixed inset-0 bg-black pointer-events-none z-40 transition-opacity duration-700"
          style={{ opacity: Math.min(0.92, dimOpacity) }}
        />
      )}

      {/* Floating Magic Cute Sparkles when Updating */}
      {isUpdating && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: 200, x: (i % 4) * 100 - 150, opacity: 0, scale: 0.5 }}
              animate={{
                y: -300,
                x: (i % 4) * 120 - 180 + Math.sin(i) * 30,
                opacity: [0, 1, 0],
                scale: [0.5, 1.2, 0.8],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.5 + (i % 3) * 0.5,
                delay: i * 0.3,
                ease: 'easeInOut',
              }}
              className="absolute left-1/2 bottom-10 text-teal-200 text-2xl"
            >
              {i % 2 === 0 ? '✨' : '💖'}
            </motion.div>
          ))}
        </div>
      )}

      {/* Low Battery Pulsing Red Glow */}
      {isConnected && batteryLevel <= 20 && !isUpdating && !isSleeping && (
        <div className="absolute inset-0 bg-red-600/10 animate-pulse pointer-events-none z-10" />
      )}

      {/* BMO Face Centered */}
      <motion.div
        animate={{
          y: isSleeping
            ? [0, 4, 0]
            : isNoddingOff
            ? startled
              ? -10
              : [0, 12, 0]
            : isYawning
            ? [0, -6, 0]
            : isUpdating
            ? [0, -8, 0]
            : isConnected
            ? batteryLevel <= 20
              ? [0, -3, 0]
              : [0, -10, 0]
            : 0,
          rotate: isNoddingOff
            ? startled
              ? [0, -5, 5, 0]
              : [0, 5, 0]
            : 0,
        }}
        transition={{
          repeat: isSleeping || isNoddingOff || isYawning ? Infinity : Infinity,
          duration: isSleeping ? 3.2 : isNoddingOff ? 4 : isYawning ? 2.5 : isUpdating ? 1.8 : 3.5,
          ease: 'easeInOut',
        }}
        className="relative z-20 w-full max-w-2xl px-6 flex flex-col items-center justify-center"
      >
        <svg
          viewBox="0 0 200 130"
          className="w-full max-h-[72vh] transition-transform duration-300 overflow-visible"
        >
          {/* FLOATING ZZZ OVER BMO'S RIGHT EYE (WHEN SLEEPING) */}
          {isSleeping && (
            <g transform="translate(155, 22)" className="pointer-events-none">
              <motion.text
                x="0"
                y="0"
                fill="#d8f3dc"
                fontSize="15"
                fontWeight="900"
                fontFamily="monospace"
                animate={{ y: [0, -22, -34], x: [0, 8, 14], opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut', delay: 0 }}
              >
                Z
              </motion.text>
              <motion.text
                x="6"
                y="-4"
                fill="#8ff5da"
                fontSize="12"
                fontWeight="900"
                fontFamily="monospace"
                animate={{ y: [-4, -26, -40], x: [6, 14, 22], opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut', delay: 0.9 }}
              >
                z
              </motion.text>
              <motion.text
                x="12"
                y="-8"
                fill="#5ee6c4"
                fontSize="9"
                fontWeight="900"
                fontFamily="monospace"
                animate={{ y: [-8, -30, -46], x: [12, 20, 28], opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut', delay: 1.8 }}
              >
                z
              </motion.text>
            </g>
          )}

          {/* ACCESSORY: HAIR BOW ON HEAD (Girl style) */}
          {effectiveAccessory === 'hairbow' && (
            <g transform="translate(18, 10) rotate(-20)">
              <path d="M 0 0 L -14 -10 C -18 -2, -18 10, -14 10 Z" fill="#ff4081" />
              <path d="M 0 0 L 14 -10 C 18 -2, 18 10, 14 10 Z" fill="#ff4081" />
              <circle cx="0" cy="0" r="4.5" fill="#ff80ab" />
            </g>
          )}

          {/* EYES & EYELASHES */}
          {isSleeping ? (
            /* SLEEPING EYES ARCS */
            <g stroke={style.faceColor} strokeWidth="6.5" strokeLinecap="round" fill="none">
              <path d="M 30 50 Q 45 60 60 50" />
              <path d="M 140 50 Q 155 60 170 50" />
            </g>
          ) : isYawning ? (
            /* YAWNING DROWSY EYES */
            <g stroke={style.faceColor} strokeWidth="6" strokeLinecap="round" fill="none">
              <path d="M 30 46 Q 45 38 60 46" />
              <path d="M 140 46 Q 155 38 170 46" />
            </g>
          ) : isNoddingOff ? (
            startled ? (
              /* STARTLED WIDE EYES ("ACORDANDO NO SUSTO!") */
              <g fill={style.faceColor}>
                <circle cx="45" cy="40" r="16" />
                <circle cx="155" cy="40" r="16" />
                <circle cx="48" cy="38" r="5" fill="#ffffff" />
                <circle cx="158" cy="38" r="5" fill="#ffffff" />
              </g>
            ) : (
              /* DROOPING HEAVY EYES */
              <g stroke={style.faceColor} strokeWidth="6" strokeLinecap="round" fill="none">
                <path d="M 30 48 Q 45 42 60 48" />
                <path d="M 140 48 Q 155 42 170 48" />
              </g>
            )
          ) : isUpdating ? (
            /* CUTE UPDATING STARBURST EYES */
            <g fill="#d8f3dc">
              {/* Left Eye: Rotating Star */}
              <g transform="translate(45, 42)">
                <motion.g
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                >
                  <path
                    d="M 0 -12 L 3 -3 L 12 0 L 3 3 L 0 12 L -3 3 L -12 0 L -3 -3 Z"
                    fill="#ffffff"
                  />
                </motion.g>
              </g>

              {/* Right Eye: Rotating Star */}
              <g transform="translate(155, 42)">
                <motion.g
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                >
                  <path
                    d="M 0 -12 L 3 -3 L 12 0 L 3 3 L 0 12 L -3 3 L -12 0 L -3 -3 Z"
                    fill="#ffffff"
                  />
                </motion.g>
              </g>
            </g>
          ) : currentExpression === 'love' ? (
            <g fill={customization.gender === 'girl' ? '#ad1457' : '#880e4f'}>
              <path d="M 45 40 C 45 30, 65 30, 65 45 C 65 55, 45 65, 45 65 C 45 65, 25 55, 25 45 C 25 30, 45 30, 45 40 Z" />
              <path d="M 155 40 C 155 30, 175 30, 175 45 C 175 55, 155 65, 155 65 C 155 65, 135 55, 135 45 C 135 30, 155 30, 155 40 Z" />
            </g>
          ) : currentExpression === 'sleepy' ? (
            <g stroke={style.faceColor} strokeWidth="7" strokeLinecap="round" fill="none">
              <path d="M 30 50 Q 45 38 60 50" />
              <path d="M 140 50 Q 155 38 170 50" />
            </g>
          ) : currentExpression === 'sad' ? (
            <g fill={style.faceColor}>
              {/* Sad drooping eyes with blue tear */}
              <circle cx="45" cy="45" r="10" />
              <ellipse cx="37" cy="59" rx="2.5" ry="5" fill="#60a5fa" />
              <circle cx="155" cy="45" r="10" />
            </g>
          ) : currentExpression === 'surprised' ? (
            <g fill={style.faceColor}>
              <circle cx="45" cy="42" r="14" />
              <circle cx="155" cy="42" r="14" />
              <circle cx="48" cy="39" r="4" fill="#ffffff" />
              <circle cx="158" cy="39" r="4" fill="#ffffff" />
            </g>
          ) : (
            <g fill={style.faceColor}>
              {/* Cute Girl Eyelashes */}
              {customization.gender === 'girl' && !blinking && (
                <g stroke={style.faceColor} strokeWidth="3" strokeLinecap="round">
                  {/* Left Eye Eyelashes */}
                  <line x1="33" y1="32" x2="26" y2="24" />
                  <line x1="42" y1="28" x2="39" y2="19" />
                  <line x1="52" y1="29" x2="54" y2="20" />

                  {/* Right Eye Eyelashes */}
                  <line x1="148" y1="29" x2="146" y2="20" />
                  <line x1="158" y1="28" x2="161" y2="19" />
                  <line x1="167" y1="32" x2="174" y2="24" />
                </g>
              )}

              {/* Left Eye */}
              {blinking ? (
                <line
                  x1="30"
                  y1="45"
                  x2="60"
                  y2="45"
                  stroke={style.faceColor}
                  strokeWidth="7"
                  strokeLinecap="round"
                />
              ) : currentExpression === 'excited' ? (
                <g>
                  <circle cx="45" cy="42" r="15" />
                  <circle cx="49" cy="38" r="4.5" fill="#ffffff" />
                </g>
              ) : (
                <g>
                  <circle cx="45" cy="42" r="12" />
                  <circle cx="48" cy="39" r="3.5" fill="#ffffff" opacity="0.9" />
                </g>
              )}

              {/* Right Eye */}
              {blinking ? (
                <line
                  x1="140"
                  y1="45"
                  x2="170"
                  y2="45"
                  stroke={style.faceColor}
                  strokeWidth="7"
                  strokeLinecap="round"
                />
              ) : currentExpression === 'excited' ? (
                <g>
                  <circle cx="155" cy="42" r="15" />
                  <circle cx="159" cy="38" r="4.5" fill="#ffffff" />
                </g>
              ) : (
                <g>
                  <circle cx="155" cy="42" r="12" />
                  <circle cx="158" cy="39" r="3.5" fill="#ffffff" opacity="0.9" />
                </g>
              )}
            </g>
          )}

          {/* CHEEKS */}
          <ellipse
            cx="28"
            cy="58"
            rx={customization.gender === 'girl' ? '13' : '11'}
            ry={customization.gender === 'girl' ? '8' : '7'}
            fill={style.cheekColor}
            opacity={customization.gender === 'girl' ? '0.85' : '0.75'}
          />
          <ellipse
            cx="172"
            cy="58"
            rx={customization.gender === 'girl' ? '13' : '11'}
            ry={customization.gender === 'girl' ? '8' : '7'}
            fill={style.cheekColor}
            opacity={customization.gender === 'girl' ? '0.85' : '0.75'}
          />

          {/* MOUTH */}
          {isSleeping ? (
            /* SIMULATED SNORING MOUTH ANIMATION (BREATHING LOOP, NO SOUND) */
            <motion.ellipse
              cx="100"
              cy="72"
              fill="none"
              stroke={style.faceColor}
              strokeWidth="5"
              animate={{ rx: [3, 10, 3], ry: [4, 13, 4], opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
            />
          ) : isYawning ? (
            /* YAWNING OPEN OVAL MOUTH */
            <motion.ellipse
              cx="100"
              cy="74"
              fill={style.faceColor}
              animate={{ rx: [4, 14, 4], ry: [5, 20, 5] }}
              transition={{ duration: 2.5, ease: 'easeInOut' }}
            />
          ) : isNoddingOff ? (
            startled ? (
              /* STARTLED 'O' MOUTH */
              <circle cx="100" cy="72" r="10" fill="none" stroke={style.faceColor} strokeWidth="5" />
            ) : (
              /* DROOPY 'o' MOUTH */
              <circle cx="100" cy="72" r="5" fill="none" stroke={style.faceColor} strokeWidth="4" />
            )
          ) : isUpdating ? (
            /* Happy Cute 'w' Smile for Updating */
            <path
              d="M 80 68 Q 90 78 100 68 Q 110 78 120 68"
              fill="none"
              stroke="#ffffff"
              strokeWidth="6"
              strokeLinecap="round"
            />
          ) : currentExpression === 'excited' ? (
            <g>
              <path d="M 65 65 Q 100 105 135 65 Z" fill={style.faceColor} />
              <path d="M 80 82 Q 100 98 120 82 Q 100 72 80 82 Z" fill="#ff80ab" />
            </g>
          ) : currentExpression === 'sleepy' ? (
            <circle cx="100" cy="72" r="7" fill="none" stroke={style.faceColor} strokeWidth="5" />
          ) : currentExpression === 'surprised' ? (
            <circle cx="100" cy="72" r="9" fill="none" stroke={style.faceColor} strokeWidth="6" />
          ) : currentExpression === 'sad' ? (
            <path
              d="M 78 78 Q 100 62 122 78"
              fill="none"
              stroke={style.faceColor}
              strokeWidth="6"
              strokeLinecap="round"
            />
          ) : (
            /* HAPPY SMILING MOUTH */
            <path
              d="M 72 68 Q 100 92 128 68"
              fill="none"
              stroke={style.faceColor}
              strokeWidth="7"
              strokeLinecap="round"
            />
          )}

          {/* ACCESSORY: BOW TIE BELOW MOUTH */}
          {effectiveAccessory === 'bowtie' && (
            <g transform="translate(100, 118)">
              <path d="M 0 0 L -12 -8 L -12 8 Z" fill="#3b82f6" />
              <path d="M 0 0 L 12 -8 L 12 8 Z" fill="#3b82f6" />
              <circle cx="0" cy="0" r="3.5" fill="#1d4ed8" />
            </g>
          )}
        </svg>
      </motion.div>

      {/* CUTE UPDATING PROGRESS BANNER */}
      <AnimatePresence>
        {isUpdating && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="z-30 mt-4 px-6 py-3.5 bg-black/40 backdrop-blur-lg rounded-2xl border border-teal-300/30 text-white max-w-sm w-[90%] text-center shadow-2xl space-y-2.5"
          >
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-teal-200">
              <RefreshCw className="w-4 h-4 animate-spin text-teal-300 shrink-0" />
              <span>{updateMessage || 'Atualizando o BMO...'}</span>
            </div>

            {/* Cute Pixel Progress Bar */}
            <div className="w-full bg-slate-900/80 rounded-full h-3.5 p-0.5 border border-teal-500/30 overflow-hidden relative shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-teal-400 via-pink-400 to-emerald-300 rounded-full transition-all duration-300"
                style={{ width: `${updateProgress}%` }}
              />
            </div>

            <div className="flex justify-between text-[11px] font-mono text-teal-300/80">
              <span className="flex items-center gap-1">✨ Atualização Automática</span>
              <span className="font-bold text-white">{updateProgress}%</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimal Tap Feedback Badge */}
      {tapCountFeedback > 0 && !isUpdating && (
        <div className="absolute bottom-6 z-30 bg-black/40 backdrop-blur-md text-white/80 font-mono text-xs px-3 py-1 rounded-full animate-bounce pointer-events-none">
          {tapCountFeedback}/3
        </div>
      )}
    </div>
  );
};
