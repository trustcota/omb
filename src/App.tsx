import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BmoConsole, Expression } from './components/BmoConsole';
import { UsbStatusPanel } from './components/UsbStatusPanel';
import { BmoAlarmRingingModal } from './components/BmoAlarmRingingModal';
import { BmoInteriorBackground } from './components/BmoInteriorBackground';
import { BmoOnboardingModal } from './components/BmoOnboardingModal';
import { BmoCustomization, BmoAlarm, AlarmSound, BmoPowerSettings, ScreenTimeoutOption } from './types';

export default function App() {
  const [isSupported, setIsSupported] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isCharging, setIsCharging] = useState(false);
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [hasPermissionError, setHasPermissionError] = useState(false);
  const [activeExpression, setActiveExpression] = useState<Expression>('happy');
  const [batteryLevel, setBatteryLevel] = useState<number>(100);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [eventLogs, setEventLogs] = useState<string[]>([]);

  // BMO Power & Screen Timeout Settings
  const [powerSettings, setPowerSettings] = useState<BmoPowerSettings>(() => {
    try {
      const saved = localStorage.getItem('bmo_power_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      timeoutCharging: 600, // 10 min default when charging
      timeoutBattery: 120,  // 2 min default on battery
    };
  });

  const [lastActivityTime, setLastActivityTime] = useState<number>(Date.now());
  const [isSleeping, setIsSleeping] = useState<boolean>(false);
  const [isYawning, setIsYawning] = useState<boolean>(false);
  const [isNoddingOff, setIsNoddingOff] = useState<boolean>(false);
  const [dimOpacity, setDimOpacity] = useState<number>(0);

  const handlePowerSettingsChange = (newSettings: BmoPowerSettings) => {
    setPowerSettings(newSettings);
    try {
      localStorage.setItem('bmo_power_settings', JSON.stringify(newSettings));
    } catch (e) {}
    addLog(`🌙 Configuração de Economia: Carregador (${newSettings.timeoutCharging}s), Bateria (${newSettings.timeoutBattery}s)`);
  };

  // User activity tracker
  const resetActivity = useCallback(() => {
    setLastActivityTime(Date.now());
    if (isSleeping) {
      setIsSleeping(false);
      setIsYawning(false);
      setIsNoddingOff(false);
      setDimOpacity(0);
      setActiveExpression('surprised');
      setTimeout(() => {
        setActiveExpression('happy');
      }, 1200);
      addLog('✨ BMO acordou!');
    }
  }, [isSleeping]);

  useEffect(() => {
    const handleUserActivity = () => {
      resetActivity();
    };

    window.addEventListener('pointerdown', handleUserActivity);
    window.addEventListener('touchstart', handleUserActivity);
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);

    return () => {
      window.removeEventListener('pointerdown', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
    };
  }, [resetActivity]);

  // Screen timeout & Sleep cycle logic
  useEffect(() => {
    const interval = setInterval(() => {
      const activeTimeout = (isConnected || isCharging)
        ? powerSettings.timeoutCharging
        : powerSettings.timeoutBattery;

      if (activeTimeout === 0) {
        // Always awake setting
        if (isSleeping) setIsSleeping(false);
        if (isYawning) setIsYawning(false);
        if (isNoddingOff) setIsNoddingOff(false);
        setDimOpacity(0);
        return;
      }

      const elapsedSeconds = (Date.now() - lastActivityTime) / 1000;
      const progress = Math.min(1, elapsedSeconds / activeTimeout);

      if (progress >= 1.0) {
        if (!isSleeping) {
          setIsSleeping(true);
          setIsYawning(false);
          setIsNoddingOff(false);
          addLog('💤 BMO adormeceu para economizar bateria...');
        }
        setDimOpacity(0.88);
        return;
      }

      if (isSleeping) {
        setIsSleeping(false);
      }

      if (progress < 0.4) {
        setDimOpacity(0);
        setIsYawning(false);
        setIsNoddingOff(false);
      } else if (progress >= 0.4 && progress < 0.7) {
        // Stage 1: Yawning
        const dim = ((progress - 0.4) / 0.3) * 0.35;
        setDimOpacity(dim);
        setIsNoddingOff(false);

        // Periodic yawning cycle
        const cycle = Math.floor(elapsedSeconds) % 8;
        setIsYawning(cycle >= 0 && cycle < 3);
      } else if (progress >= 0.7) {
        // Stage 2: Nodding off ("pescando de sono e acordando no susto")
        const dim = 0.35 + ((progress - 0.7) / 0.3) * 0.43;
        setDimOpacity(dim);
        setIsYawning(false);
        setIsNoddingOff(true);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isConnected, isCharging, powerSettings, lastActivityTime, isSleeping]);

  // BMO Personalization State with LocalStorage persistence
  const [customization, setCustomization] = useState<BmoCustomization>(() => {
    try {
      const saved = localStorage.getItem('bmo_customization');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      gender: 'boy',
      accessory: 'none',
      theme: 'classic',
      name: 'BMO',
    };
  });

  // Onboarding Modal State for First Access
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(() => {
    try {
      return localStorage.getItem('bmo_onboarding_completed') !== 'true';
    } catch (e) {
      return true;
    }
  });

  const handleCompleteOnboarding = (newCustomization: BmoCustomization) => {
    setCustomization(newCustomization);
    try {
      localStorage.setItem('bmo_onboarding_completed', 'true');
    } catch (e) {}
    setShowOnboardingModal(false);
    setActiveExpression('excited');
    playSound('click');
    addLog(`✨ Primeiro Acesso: BMO personalizado como ${newCustomization.gender === 'girl' ? 'Menina' : 'Menino'} (${newCustomization.theme})`);
  };

  useEffect(() => {
    try {
      localStorage.setItem('bmo_customization', JSON.stringify(customization));
    } catch (e) {}
  }, [customization]);

  // Alarms State with LocalStorage persistence
  const [alarms, setAlarms] = useState<BmoAlarm[]>(() => {
    try {
      const saved = localStorage.getItem('bmo_alarms');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'default-1',
        time: '07:30',
        label: 'Acordar com o BMO',
        enabled: true,
        days: [1, 2, 3, 4, 5],
        sound: 'bmo_chime',
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('bmo_alarms', JSON.stringify(alarms));
    } catch (e) {}
  }, [alarms]);

  const [activeRingingAlarm, setActiveRingingAlarm] = useState<BmoAlarm | null>(null);
  const alarmAudioIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastAlarmTriggerKeyRef = useRef<string>('');

  // Internet & Priority Update States
  const LATEST_SERVER_VERSION = '1.5.2';

  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updateProgress, setUpdateProgress] = useState<number>(0);
  const [updateMessage, setUpdateMessage] = useState<string>('');
  const [currentVersion, setCurrentVersion] = useState<string>(() => {
    return localStorage.getItem('bmo_app_version') || '1.3.0';
  });
  const [hasNewUpdate, setHasNewUpdate] = useState<boolean>(false);
  const [updateCheckResultText, setUpdateCheckResultText] = useState<string | null>(null);

  // Screen Wake Lock & PWA Install States
  const [keepScreenOn, setKeepScreenOn] = useState<boolean>(true);
  const [isWakeLockActive, setIsWakeLockActive] = useState<boolean>(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const wakeLockSentinelRef = useRef<any>(null);

  // Listen for PWA installation prompt
  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
      addLog('📱 BMO pronto para ser instalado como App de Tela Cheia!');
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallPwa = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        addLog('🎉 App do BMO instalado com sucesso na tela inicial!');
        setInstallPrompt(null);
      }
    } else {
      addLog('💡 Dica: Toque no menu do seu navegador e escolha "Adicionar à Tela Inicial"');
    }
  };

  // Screen Wake Lock API (keeps screen turned ON while charging)
  const requestWakeLock = async () => {
    if (!keepScreenOn) return;
    if ('wakeLock' in navigator) {
      try {
        if (!wakeLockSentinelRef.current) {
          wakeLockSentinelRef.current = await (navigator as any).wakeLock.request('screen');
          setIsWakeLockActive(true);
          addLog('💡 Tela mantida acesa continuamente (Wake Lock Ativado)');
        }
      } catch (err) {
        console.warn('Wake Lock request failed:', err);
      }
    }
  };

  const releaseWakeLock = () => {
    if (wakeLockSentinelRef.current) {
      wakeLockSentinelRef.current.release().then(() => {
        wakeLockSentinelRef.current = null;
        setIsWakeLockActive(false);
        addLog('🌙 Wake Lock Liberado: Tela do celular pode desligar normalmente');
      }).catch(() => {});
    }
  };

  // Automatically activate Screen Wake Lock when charging or USB is connected
  useEffect(() => {
    if ((isConnected || isCharging) && keepScreenOn) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }
  }, [isConnected, isCharging, keepScreenOn]);

  // Handle visibility change to re-request Wake Lock if user switches back to app
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && (isConnected || isCharging) && keepScreenOn) {
        requestWakeLock();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isConnected, isCharging, keepScreenOn]);

  // State for triple-tap unlockable options view
  const [showDetails, setShowDetails] = useState(false);
  const [tapCountFeedback, setTapCountFeedback] = useState(0);

  const tapCountRef = useRef(0);
  const lastTapTimeRef = useRef(0);
  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Web Audio Synth for retro BMO chime sounds
  const playSound = (type: 'connect' | 'disconnect' | 'click' | 'update') => {
    if (!soundEnabled) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'connect') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'disconnect') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.setValueAtTime(250, now + 0.15);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'update') {
        // Magical cute chime sound for updates
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now); // A4
        osc.frequency.setValueAtTime(554.37, now + 0.1); // C#5
        osc.frequency.setValueAtTime(659.25, now + 0.2); // E5
        osc.frequency.setValueAtTime(880, now + 0.3); // A5
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      }
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setEventLogs((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 20)]);
  };

  // Alarm Web Audio Synthesizer
  const playAlarmSound = (sound: AlarmSound) => {
    if (!soundEnabled) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      if (sound === 'bmo_chime') {
        const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C5, E5, G5, C6, E6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.12);
          gain.gain.setValueAtTime(0.2, now + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.12);
          osc.stop(now + idx * 0.12 + 0.3);
        });
      } else if (sound === 'game_8bit') {
        const freqs = [880, 1174.66, 1396.91, 1760];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.12, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.15);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.15);
        });
      } else if (sound === 'sing_song') {
        const freqs = [659.25, 880, 783.99, 1046.5];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.15);
          gain.gain.setValueAtTime(0.2, now + idx * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.15);
          osc.stop(now + idx * 0.15 + 0.35);
        });
      } else {
        // digital
        [0, 0.2].forEach((delay) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(1000, now + delay);
          gain.gain.setValueAtTime(0.15, now + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.1);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + delay);
          osc.stop(now + delay + 0.1);
        });
      }
    } catch (e) {
      console.warn('Alarm sound play error:', e);
    }
  };

  const startRingingSoundLoop = (sound: AlarmSound) => {
    stopRingingSoundLoop();
    playAlarmSound(sound);
    alarmAudioIntervalRef.current = setInterval(() => {
      playAlarmSound(sound);
    }, 1200);
  };

  const stopRingingSoundLoop = () => {
    if (alarmAudioIntervalRef.current) {
      clearInterval(alarmAudioIntervalRef.current);
      alarmAudioIntervalRef.current = null;
    }
  };

  const handleAddAlarm = (alarmData: Omit<BmoAlarm, 'id'>) => {
    playSound('click');
    const newAlarm: BmoAlarm = {
      ...alarmData,
      id: 'alarm-' + Date.now(),
    };
    setAlarms((prev) => [...prev, newAlarm]);
    addLog(`⏰ Alarme das ${newAlarm.time} ("${newAlarm.label}") adicionado!`);
  };

  const handleToggleAlarm = (id: string) => {
    playSound('click');
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const handleDeleteAlarm = (id: string) => {
    playSound('click');
    setAlarms((prev) => prev.filter((a) => a.id !== id));
  };

  const handleDismissAlarm = () => {
    stopRingingSoundLoop();
    if (activeRingingAlarm) {
      addLog(`⏰ Alarme das ${activeRingingAlarm.time} desligado.`);
      if (activeRingingAlarm.days.length === 0) {
        setAlarms((prev) =>
          prev.map((a) => (a.id === activeRingingAlarm.id ? { ...a, enabled: false } : a))
        );
      }
    }
    setActiveRingingAlarm(null);
    playSound('click');
  };

  const handleSnoozeAlarm = () => {
    stopRingingSoundLoop();
    if (activeRingingAlarm) {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 5);
      const hStr = String(now.getHours()).padStart(2, '0');
      const mStr = String(now.getMinutes()).padStart(2, '0');
      const snoozeTime = `${hStr}:${mStr}`;

      const snoozeAlarm: BmoAlarm = {
        id: 'snooze-' + Date.now(),
        time: snoozeTime,
        label: `Soneca (${activeRingingAlarm.label})`,
        enabled: true,
        days: [],
        sound: activeRingingAlarm.sound,
      };

      setAlarms((prev) => [...prev, snoozeAlarm]);
      addLog(`💤 Soneca ativada para as ${snoozeTime} (+5 min)`);
    }
    setActiveRingingAlarm(null);
    playSound('click');
  };

  // 1-second Interval checking for Alarms
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hStr = String(now.getHours()).padStart(2, '0');
      const mStr = String(now.getMinutes()).padStart(2, '0');
      const timeNow = `${hStr}:${mStr}`;
      const dayOfWeek = now.getDay();
      const triggerKey = `${timeNow}-${now.getDate()}`;

      if (lastAlarmTriggerKeyRef.current === triggerKey) {
        return;
      }

      const matchingAlarm = alarms.find((a) => {
        if (!a.enabled) return false;
        if (a.time !== timeNow) return false;
        if (a.days.length > 0 && !a.days.includes(dayOfWeek)) return false;
        return true;
      });

      if (matchingAlarm) {
        lastAlarmTriggerKeyRef.current = triggerKey;
        setActiveRingingAlarm(matchingAlarm);
        setActiveExpression('excited');
        addLog(`⏰ ALARME DISPARADO! (${matchingAlarm.time} - ${matchingAlarm.label})`);

        startRingingSoundLoop(matchingAlarm.sound);

        if ('vibrate' in navigator) {
          try {
            navigator.vibrate([400, 200, 400, 200, 600]);
          } catch (e) {}
        }

        if ('Notification' in window && Notification.permission === 'granted') {
          try {
            new Notification(`⏰ Alarme do ${customization.name || 'BMO'}!`, {
              body: matchingAlarm.label,
              icon: '/bmo-icon.svg',
            });
          } catch (e) {}
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [alarms, customization.name]);

  // Cute Update Routine - executed when a new version is detected or forced
  const runCuteUpdateCheck = (newVer: string = LATEST_SERVER_VERSION, forceReload: boolean = false) => {
    if (isUpdating) return;
    setIsUpdating(true);
    setUpdateProgress(10);
    setUpdateMessage(`🌐 Nova versão v${newVer} detectada! Aplicando atualização com prioridade...`);
    playSound('update');
    addLog(`⚡ PRIORIDADE MÁXIMA: Atualizando BMO para v${newVer}...`);

    // Notify ServiceWorker to skip waiting if applicable
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg) {
          if (reg.waiting) {
            reg.waiting.postMessage({ type: 'SKIP_WAITING' });
          }
          reg.update().catch((e) => console.warn('SW update check error:', e));
        }
      });
    }

    // Sequence of cute animated steps
    setTimeout(() => {
      setUpdateProgress(40);
      setUpdateMessage('Baixando atualizações mais recentes do servidor... 💖');
    }, 1000);

    setTimeout(() => {
      setUpdateProgress(75);
      setUpdateMessage('Sincronizando novas funções e expressões... ⚡');
    }, 2000);

    setTimeout(() => {
      setUpdateProgress(100);
      setUpdateMessage(`Sistemas do BMO atualizados com sucesso! ✨ (v${newVer})`);
      setCurrentVersion(newVer);
      try {
        localStorage.setItem('bmo_app_version', newVer);
        localStorage.setItem('bmo_last_update_check', String(Date.now()));
      } catch (e) {}
      setHasNewUpdate(false);
      setUpdateCheckResultText(`🎉 BMO atualizado com sucesso para a versão v${newVer}!`);
      playSound('update');
      addLog(`🎉 BMO ATUALIZADO COM SUCESSO! Versão atual v${newVer}`);
    }, 3000);

    setTimeout(() => {
      setIsUpdating(false);
      setUpdateProgress(0);
      setUpdateMessage('');
      if (forceReload) {
        window.location.reload();
      }
    }, 4200);
  };

  // High Priority Server Check Function
  const fetchServerVersionCheck = useCallback(async (isUserAction: boolean = false) => {
    if (isUpdating) return;

    try {
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg) {
          reg.update().catch(() => {});
          if (reg.waiting) {
            setHasNewUpdate(true);
            runCuteUpdateCheck(LATEST_SERVER_VERSION, true);
            return;
          }
        }
      }

      // Check server version JSON file with cache-busting timestamp query
      const response = await fetch(`${import.meta.env.BASE_URL}version.json?t=${Date.now()}`, { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        const serverVer = data.version || LATEST_SERVER_VERSION;
        const savedVer = localStorage.getItem('bmo_app_version') || '1.0.0';

        if (serverVer !== currentVersion || serverVer !== savedVer || hasNewUpdate) {
          setUpdateCheckResultText(`⚡ Nova versão v${serverVer} encontrada no servidor! Atualizando...`);
          addLog(`🌐 Nova versão v${serverVer} encontrada no servidor! Instalando...`);
          runCuteUpdateCheck(serverVer, false);
          return;
        } else if (isUserAction) {
          playSound('click');
          setUpdateCheckResultText(`Você já possui a versão mais recente (v${currentVersion}) ✨`);
          addLog(`[Sistema] BMO v${currentVersion} verificado. Sistema totalmente atualizado.`);
        }
      } else if (isUserAction) {
        playSound('click');
        setUpdateCheckResultText(`BMO v${currentVersion} verificado (Sem atualizações pendentes no servidor).`);
      }
    } catch (e) {
      if (isUserAction) {
        setUpdateCheckResultText(`BMO v${currentVersion} operando normalmente.`);
      }
    }
  }, [currentVersion, isUpdating, hasNewUpdate]);

  const handleCheckForUpdate = () => {
    fetchServerVersionCheck(true);
  };

  // Priority Automatic Update Loop: Checks on mount, on focus, on network reconnect & every 15 seconds
  useEffect(() => {
    // 1. Service Worker setup
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).then((reg) => {
        reg.addEventListener('updatefound', () => {
          addLog('⚡ Nova atualização do BMO baixada em segundo plano!');
          setHasNewUpdate(true);
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                runCuteUpdateCheck(LATEST_SERVER_VERSION, true);
              }
            });
          }
        });
      }).catch((e) => console.warn('SW registration failed:', e));
    }

    // 2. Immediate check on startup
    fetchServerVersionCheck(false);

    // 3. Periodic High-Priority polling every 15 seconds
    const pollInterval = setInterval(() => {
      if (navigator.onLine) {
        fetchServerVersionCheck(false);
      }
    }, 15000);

    // 4. Check whenever tab regains visibility / user returns to app
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && navigator.onLine) {
        fetchServerVersionCheck(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(pollInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchServerVersionCheck]);

  // Monitor Network Online/Offline Status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      addLog('🌐 Dispositivo CONECTADO à Internet. Verificando atualizações prioritárias...');
      fetchServerVersionCheck(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      addLog('📡 Dispositivo DESCONECTADO da Internet. Modo Offline Ativado.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [fetchServerVersionCheck]);

  // Automatic Battery Status & USB Power Cable Detector
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBatteryStatus = () => {
          const levelPercent = Math.round(battery.level * 100);
          const chargingState = battery.charging;

          setBatteryLevel(levelPercent);
          setIsCharging(chargingState);

          if (chargingState) {
            setIsConnected(true);
            setDeviceName((prev) => prev || 'Cabo de Carregamento USB Conectado');
            addLog(`⚡ Cabo USB Detectado: Carregando Bateria (${levelPercent}%)`);
          } else {
            addLog(`🔋 Bateria Detectada: ${levelPercent}% (${chargingState ? 'Carregando' : 'Descarregando'})`);
          }
        };

        updateBatteryStatus();

        battery.addEventListener('levelchange', updateBatteryStatus);
        battery.addEventListener('chargingchange', () => {
          updateBatteryStatus();
          if (battery.charging) {
            playSound('connect');
          } else {
            playSound('disconnect');
          }
        });
      }).catch((e: any) => {
        console.warn('Battery API error:', e);
        addLog('Sensor de bateria não suportado neste navegador/sistema.');
      });
    } else {
      addLog('API da bateria indisponível no navegador atual.');
    }
  }, []);

  // Automatic WebUSB Hardware Device Detector
  useEffect(() => {
    addLog('Aguardando detecção automática de USB e Bateria...');

    if (!('usb' in navigator)) {
      setIsSupported(false);
      addLog('Aviso: Navegador sem suporte nativo a WebUSB');
      return;
    }

    const navUsb = (navigator as any).usb;

    const autoCheckUsbDevices = async () => {
      try {
        const devices = await navUsb.getDevices();
        if (devices.length > 0) {
          setIsConnected(true);
          const name = devices[0].productName || 'Dispositivo USB Detectado';
          setDeviceName(name);
          addLog(`⚡ USB Automático Encontrado: ${name}`);
        }
      } catch (err: any) {
        console.warn('WebUSB getDevices error:', err);
        if (err.name === 'SecurityError' || err.message?.includes('permissions policy')) {
          setHasPermissionError(true);
          addLog('Aviso de Iframe: Clique em "Detectar Dispositivo USB" ou abra em nova aba');
        }
      }
    };

    autoCheckUsbDevices();

    const handleConnect = (event: any) => {
      setIsConnected(true);
      const name = event.device?.productName || 'Dispositivo USB Detectado';
      setDeviceName(name);
      playSound('connect');
      addLog(`⚡ USB CONECTADO AUTOMATICAMENTE: ${name}`);
    };

    const handleDisconnect = (event: any) => {
      setIsConnected(false);
      setDeviceName(null);
      playSound('disconnect');
      addLog('🔌 USB DESCONECTADO');
    };

    try {
      navUsb.addEventListener('connect', handleConnect);
      navUsb.addEventListener('disconnect', handleDisconnect);
    } catch (e) {
      console.warn('Error attaching USB listeners:', e);
    }

    return () => {
      try {
        navUsb.removeEventListener('connect', handleConnect);
        navUsb.removeEventListener('disconnect', handleDisconnect);
      } catch (e) {}
    };
  }, []);

  const requestDevice = async () => {
    playSound('click');
    if (!('usb' in navigator)) return;

    try {
      setHasPermissionError(false);
      const device = await (navigator as any).usb.requestDevice({
        filters: [],
      });
      setIsConnected(true);
      setDeviceName(device.productName || 'Dispositivo USB');
      playSound('connect');
      addLog(`USB Selecionado: ${device.productName || 'Dispositivo USB'}`);
    } catch (error: any) {
      console.error(error);
      if (error.name === 'SecurityError' || error.message?.includes('permissions policy')) {
        setHasPermissionError(true);
        addLog('Erro de Permissão ao selecionar dispositivo');
      } else if (error.name !== 'NotFoundError') {
        addLog(`Erro ao selecionar USB: ${error.message || 'Cancelado'}`);
      }
    }
  };

  // Triple tap on BMO Face logic
  const handleFaceTap = () => {
    playSound('click');
    const now = Date.now();
    if (now - lastTapTimeRef.current < 800) {
      tapCountRef.current += 1;
    } else {
      tapCountRef.current = 1;
    }
    lastTapTimeRef.current = now;

    const currentTaps = tapCountRef.current;
    setTapCountFeedback(currentTaps);

    if (currentTaps >= 3) {
      setShowDetails(true);
      playSound('connect');
      tapCountRef.current = 0;
      setTapCountFeedback(0);
    }

    if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
    tapTimeoutRef.current = setTimeout(() => {
      tapCountRef.current = 0;
      setTapCountFeedback(0);
    }, 1500);
  };

  return (
    <div className={`fixed inset-0 w-full h-full bg-slate-950 text-slate-100 font-sans selection:bg-teal-500 selection:text-white ${
      !showDetails ? 'flex flex-col items-center justify-center overflow-hidden select-none' : 'overflow-y-auto overscroll-contain py-6 px-4 sm:px-6 flex flex-col items-center justify-start z-50'
    }`}>
      {/* BMO Internal Machinery Background */}
      <BmoInteriorBackground />

      {!showDetails ? (
        /* FULLSCREEN BMO FACE ONLY */
        <BmoConsole
          isConnected={isConnected || isCharging}
          batteryLevel={batteryLevel}
          deviceName={deviceName}
          manualExpression={activeExpression}
          onFaceTap={handleFaceTap}
          tapCountFeedback={tapCountFeedback}
          isUpdating={isUpdating}
          updateProgress={updateProgress}
          updateMessage={updateMessage}
          customization={customization}
          isSleeping={isSleeping}
          isYawning={isYawning}
          isNoddingOff={isNoddingOff}
          dimOpacity={dimOpacity}
        />
      ) : (
        /* UNLOCKED DETAILS & CONTROLS VIEW */
        <main className="w-full max-w-2xl space-y-6 my-auto pb-12 relative z-10">
          {/* Topbar with BMO Face-Only Button & Sistema Title */}
          <div className="flex justify-between items-center bg-slate-900/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-800 shadow-xl">
            <button
              onClick={() => {
                playSound('click');
                setShowDetails(false);
              }}
              title="Voltar para a tela do BMO"
              className="group relative bg-gradient-to-b from-teal-400 to-teal-600 hover:from-teal-300 hover:to-teal-500 text-slate-950 p-2 rounded-xl transition-all transform hover:scale-110 active:scale-95 shadow-md border-2 border-teal-300/80 cursor-pointer flex items-center justify-center shrink-0"
            >
              {/* Cute BMO Face Icon */}
              <div className="w-9 h-7 bg-teal-200 rounded-md border border-teal-800 flex items-center justify-center gap-1 shadow-inner relative overflow-hidden group-hover:bg-teal-100 transition-colors">
                {/* Blushing cheeks */}
                <div className="absolute bottom-1 left-1 w-1.5 h-1 rounded-full bg-pink-400/60" />
                <div className="absolute bottom-1 right-1 w-1.5 h-1 rounded-full bg-pink-400/60" />

                {/* Left Eye */}
                <div className="w-1.5 h-2.5 bg-slate-900 rounded-full transition-all group-hover:scale-y-125" />
                {/* Mouth */}
                <div className="w-2 h-1 border-b-2 border-slate-900 rounded-full -mb-0.5" />
                {/* Right Eye */}
                <div className="w-1.5 h-2.5 bg-slate-900 rounded-full transition-all group-hover:scale-y-125" />
              </div>
            </button>

            <span className="text-sm font-mono font-bold tracking-wider text-teal-300 uppercase">
              Sistema
            </span>
          </div>

          {/* USB Controls & Personalization Panel */}
          <UsbStatusPanel
            isConnected={isConnected || isCharging}
            isCharging={isCharging}
            deviceName={deviceName}
            hasPermissionError={hasPermissionError}
            onSelectUsbDevice={requestDevice}
            activeExpression={activeExpression}
            onChangeExpression={(exp) => {
              playSound('click');
              setActiveExpression(exp);
            }}
            batteryLevel={batteryLevel}
            eventLogs={eventLogs}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled(!soundEnabled)}
            isOnline={isOnline}
            isUpdating={isUpdating}
            currentVersion={currentVersion}
            hasNewUpdate={hasNewUpdate}
            onCheckForUpdate={() => {
              handleCheckForUpdate();
            }}
            updateCheckResultText={updateCheckResultText}
            customization={customization}
            onChangeCustomization={(newCust) => {
              playSound('click');
              setCustomization(newCust);
            }}
            onOpenOnboarding={() => setShowOnboardingModal(true)}
            canInstallPwa={Boolean(installPrompt)}
            onInstallPwa={handleInstallPwa}
            keepScreenOn={keepScreenOn}
            onToggleKeepScreenOn={() => {
              playSound('click');
              setKeepScreenOn(!keepScreenOn);
            }}
            isWakeLockActive={isWakeLockActive}
            alarms={alarms}
            onAddAlarm={handleAddAlarm}
            onToggleAlarm={handleToggleAlarm}
            onDeleteAlarm={handleDeleteAlarm}
            onTestSound={(sound) => playAlarmSound(sound)}
            powerSettings={powerSettings}
            onChangePowerSettings={handlePowerSettingsChange}
          />
        </main>
      )}

      {/* ALARM RINGING MODAL */}
      {activeRingingAlarm && (
        <BmoAlarmRingingModal
          alarm={activeRingingAlarm}
          onDismiss={handleDismissAlarm}
          onSnooze={handleSnoozeAlarm}
          bmoName={customization.name}
        />
      )}

      {/* ONBOARDING MODAL FOR FIRST ACCESS */}
      <BmoOnboardingModal
        isOpen={showOnboardingModal}
        onComplete={handleCompleteOnboarding}
        initialCustomization={customization}
      />
    </div>
  );
}
