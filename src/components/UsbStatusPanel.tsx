import React, { useState } from 'react';
import {
  Usb,
  ExternalLink,
  ShieldAlert,
  Volume2,
  VolumeX,
  Sparkles,
  Activity,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
  Maximize,
  Wifi,
  WifiOff,
  DownloadCloud,
  Palette,
  CheckCircle2,
  SlidersHorizontal,
  Zap,
  Smartphone,
  Sun,
  AlarmClock,
  Moon,
} from 'lucide-react';
import { Expression } from './BmoConsole';
import { BmoCustomizer } from './BmoCustomizer';
import { BmoAlarmManager } from './BmoAlarmManager';
import { BmoCustomization, BmoAlarm, AlarmSound, BmoPowerSettings, ScreenTimeoutOption } from '../types';

interface UsbStatusPanelProps {
  isConnected: boolean;
  isCharging?: boolean;
  deviceName: string | null;
  hasPermissionError: boolean;
  onSelectUsbDevice: () => void;
  activeExpression: Expression;
  onChangeExpression: (exp: Expression) => void;
  batteryLevel: number;
  eventLogs: string[];
  soundEnabled: boolean;
  onToggleSound: () => void;
  isOnline: boolean;
  isUpdating: boolean;
  currentVersion: string;
  hasNewUpdate: boolean;
  onCheckForUpdate: () => void;
  updateCheckResultText?: string | null;
  customization: BmoCustomization;
  onChangeCustomization: (newCustomization: BmoCustomization) => void;
  onOpenOnboarding?: () => void;
  canInstallPwa?: boolean;
  onInstallPwa?: () => void;
  keepScreenOn?: boolean;
  onToggleKeepScreenOn?: () => void;
  isWakeLockActive?: boolean;
  alarms: BmoAlarm[];
  onAddAlarm: (alarm: Omit<BmoAlarm, 'id'>) => void;
  onToggleAlarm: (id: string) => void;
  onDeleteAlarm: (id: string) => void;
  onTestSound: (sound: AlarmSound) => void;
  powerSettings: BmoPowerSettings;
  onChangePowerSettings: (newSettings: BmoPowerSettings) => void;
}

export const UsbStatusPanel: React.FC<UsbStatusPanelProps> = ({
  isConnected,
  isCharging = false,
  deviceName,
  hasPermissionError,
  onSelectUsbDevice,
  activeExpression,
  onChangeExpression,
  batteryLevel,
  eventLogs,
  soundEnabled,
  onToggleSound,
  isOnline,
  isUpdating,
  currentVersion,
  hasNewUpdate,
  onCheckForUpdate,
  updateCheckResultText,
  customization,
  onChangeCustomization,
  onOpenOnboarding,
  canInstallPwa = false,
  onInstallPwa,
  keepScreenOn = true,
  onToggleKeepScreenOn,
  isWakeLockActive = false,
  alarms,
  onAddAlarm,
  onToggleAlarm,
  onDeleteAlarm,
  onTestSound,
  powerSettings,
  onChangePowerSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'customization' | 'alarm' | 'autostart' | 'hardware' | 'system'>('alarm');
  const [isAlreadyInstalled, setIsAlreadyInstalled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true ||
      document.referrer.includes('android-app://')
    );
  });

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsAlreadyInstalled(e.matches);
    };
    mediaQuery.addEventListener?.('change', handleChange);
    return () => mediaQuery.removeEventListener?.('change', handleChange);
  }, []);

  const expressions: { key: Expression; label: string; icon: string }[] = [
    { key: 'happy', label: 'Feliz', icon: '😊' },
    { key: 'excited', label: 'Empolgado', icon: '🤩' },
    { key: 'love', label: 'Amor', icon: '🥰' },
    { key: 'sad', label: 'Triste', icon: '🥺' },
    { key: 'sleepy', label: 'Dormindo', icon: '😴' },
  ];

  const triggerFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const getBatteryIcon = () => {
    if (batteryLevel <= 20) return <BatteryLow className="w-5 h-5 text-red-500" />;
    if (batteryLevel <= 50) return <BatteryMedium className="w-5 h-5 text-amber-500" />;
    return <BatteryFull className="w-5 h-5 text-emerald-500" />;
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xl space-y-6">
      {/* MODERN TAB NAVIGATION BAR */}
      <div className="bg-slate-100/80 p-1.5 rounded-2xl flex gap-1 border border-slate-200/60 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('alarm')}
          className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'alarm'
              ? 'bg-white text-teal-800 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <AlarmClock className="w-4 h-4 text-amber-500" />
          <span>Alarme</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('customization')}
          className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'customization'
              ? 'bg-white text-teal-800 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Palette className="w-4 h-4 text-teal-600" />
          <span>Personalização</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('autostart')}
          className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'autostart'
              ? 'bg-white text-teal-800 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Início Automático</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('hardware')}
          className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'hardware'
              ? 'bg-white text-teal-800 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Usb className="w-4 h-4 text-teal-600" />
          <span>Bateria & USB</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('system')}
          className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'system'
              ? 'bg-white text-teal-800 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 text-teal-600" />
          <span>Logs & Versão</span>
        </button>
      </div>

      {/* TAB 0: ALARM MANAGER */}
      {activeTab === 'alarm' && (
        <BmoAlarmManager
          alarms={alarms}
          onAddAlarm={onAddAlarm}
          onToggleAlarm={onToggleAlarm}
          onDeleteAlarm={onDeleteAlarm}
          onTestSound={onTestSound}
        />
      )}

      {/* TAB 1: PERSONALIZATION */}
      {activeTab === 'customization' && (
        <BmoCustomizer
          customization={customization}
          onChangeCustomization={onChangeCustomization}
          onOpenOnboarding={onOpenOnboarding}
        />
      )}

      {/* TAB 2: AUTOMATIC STARTUP & DOCK CONFIG */}
      {activeTab === 'autostart' && (
        <div className="space-y-5">
          {/* SCREEN WAKE LOCK CONTROL */}
          <div className="bg-gradient-to-br from-amber-500/10 via-teal-500/10 to-emerald-500/10 border border-amber-200 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Manter Tela Acesa no Carregador</h4>
                  <p className="text-[11px] text-slate-500">Impede que a tela do celular apague enquanto estiver no cabo ou indução</p>
                </div>
              </div>

              <button
                type="button"
                onClick={onToggleKeepScreenOn}
                className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 border ${
                  keepScreenOn
                    ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md'
                    : 'bg-slate-100 text-slate-500 border-slate-300'
                }`}
              >
                {keepScreenOn ? '💡 Ativado' : '🌙 Desativado'}
              </button>
            </div>

            {isWakeLockActive && (
              <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl p-2.5 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Wake Lock Ativo: O BMO manterá o display aceso continuamente!</span>
              </div>
            )}
          </div>

          {/* ECONOMIA DE BATERIA & TEMPO DE TELA ACESA */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-indigo-600 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Economia de Bateria & Descanso de Tela</h4>
                <p className="text-[11px] text-slate-500">
                  A tela escurece gradualmente enquanto o BMO boceja e pesca de sono até dormir com o ZZZ.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* NO CARREGADOR */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5">
                <label className="text-[11px] font-extrabold text-teal-800 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  No Carregador (USB / Sem Fio):
                </label>
                <select
                  value={powerSettings.timeoutCharging}
                  onChange={(e) =>
                    onChangePowerSettings({
                      ...powerSettings,
                      timeoutCharging: Number(e.target.value) as ScreenTimeoutOption,
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg p-2 text-xs font-bold focus:ring-2 focus:ring-teal-500 cursor-pointer"
                >
                  <option value={0}>∞ Sempre Acesa (Nunca Dormir)</option>
                  <option value={60}>1 minuto sem uso</option>
                  <option value={180}>3 minutos sem uso</option>
                  <option value={300}>5 minutos sem uso</option>
                  <option value={600}>10 minutos sem uso</option>
                  <option value={900}>15 minutos sem uso</option>
                </select>
              </div>

              {/* NA BATERIA */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5">
                <label className="text-[11px] font-extrabold text-indigo-800 flex items-center gap-1.5">
                  <BatteryLow className="w-3.5 h-3.5 text-indigo-600" />
                  Na Bateria (Desconectado):
                </label>
                <select
                  value={powerSettings.timeoutBattery}
                  onChange={(e) =>
                    onChangePowerSettings({
                      ...powerSettings,
                      timeoutBattery: Number(e.target.value) as ScreenTimeoutOption,
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg p-2 text-xs font-bold focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value={30}>30 segundos sem uso</option>
                  <option value={60}>1 minuto sem uso</option>
                  <option value={120}>2 minutos sem uso</option>
                  <option value={180}>3 minutos sem uso</option>
                  <option value={300}>5 minutos sem uso</option>
                  <option value={0}>∞ Sempre Acesa (Nunca Dormir)</option>
                </select>
              </div>
            </div>
          </div>

          {/* INSTALL PWA BANNER (ONLY SHOW IF NOT INSTALLED ALREADY) */}
          {!isAlreadyInstalled && (
            <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-2xl p-4 border border-teal-700/80 shadow-lg space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-mono font-bold">
                    <Smartphone className="w-3 h-3" />
                    APP INDEPENDENTE
                  </div>
                  <h4 className="text-sm font-bold text-white">Instalar o BMO na Tela Inicial</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Transforma o BMO em um aplicativo de tela cheia sem barras de navegação do Chrome/Safari.
                  </p>
                </div>

                {canInstallPwa ? (
                  <button
                    type="button"
                    onClick={onInstallPwa}
                    className="bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-extrabold py-2.5 px-4 rounded-xl transition-all shadow-md text-xs cursor-pointer shrink-0 flex items-center gap-1.5"
                  >
                    <Smartphone className="w-4 h-4" />
                    Instalar App
                  </button>
                ) : (
                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-bold text-teal-300 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl block">
                      Adicionar à Tela Inicial
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SYSTEM AUTOMATION GUIDE (NATIVE SHORTCUTS ONLY) */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Como fazer o Celular ABRIR o BMO sozinho ao carregar:</span>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Você pode usar o recurso nativo de rotinas do seu próprio sistema operacional:
            </p>

            <div className="space-y-3 pt-1">
              {/* Samsung Galaxy Section */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-1.5">
                <div className="text-xs font-extrabold text-teal-800 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-teal-600" />
                  Se o seu celular for Samsung Galaxy:
                </div>
                <ol className="text-[11px] text-slate-600 space-y-1 list-decimal pl-4">
                  <li>Abra <b>Configurações</b> ➔ <b>Modos e Rotinas</b> ➔ aba <b>Rotinas</b>.</li>
                  <li>Toque no <b>+</b> para criar uma nova rotina.</li>
                  <li><b>Se:</b> Escolha <i>Status do Carregamento</i> ➔ <i>Carregando (USB ou Sem Fio)</i>.</li>
                  <li><b>Então:</b> Escolha <i>Abrir aplicativo ou executar ação do site</i> ➔ Selecione o <b>BMO</b> ou o Chrome na URL.</li>
                </ol>
              </div>

              {/* iPhone Section */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-1.5">
                <div className="text-xs font-extrabold text-indigo-900 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-indigo-600" />
                  Se for iPhone (iOS):
                </div>
                <ol className="text-[11px] text-slate-600 space-y-1 list-decimal pl-4">
                  <li>Abra o app nativo <b>Atalhos (Shortcuts)</b> ➔ aba <b>Automação</b>.</li>
                  <li>Toque no <b>+</b> ➔ Selecione <b>Carregador</b> ➔ <i>Quando estiver conectado</i>.</li>
                  <li>Escolha <b>Executar Imediatamente</b> (Sem perguntar).</li>
                  <li>Ação: <b>Abrir URLs</b> ➔ Cole a URL do BMO.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HARDWARE & BATTERY */}
      {activeTab === 'hardware' && (
        <div className="space-y-5">
          {/* Permission Error Banner */}
          {hasPermissionError && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Aviso de Permissão do Navegador</span>
              </div>
              <p className="leading-relaxed">
                O navegador restringe acesso direto a portas USB dentro da janela preview embutida.
              </p>
              <a
                href={window.location.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-xl transition-all text-[11px] shadow-sm"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Abrir em Nova Aba para Conectar USB Real
              </a>
            </div>
          )}

          {/* Real Hardware USB Device Detector */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Usb className="w-4 h-4 text-teal-600" />
              Conexão Física USB (WebUSB Hardware API)
            </label>

            <button
              type="button"
              onClick={onSelectUsbDevice}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              <Usb className="w-4 h-4" />
              Conectar Dispositivo USB Real
            </button>

            {deviceName && (
              <div className="bg-teal-50 border border-teal-200 text-teal-900 rounded-xl p-3 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Dispositivo Conectado: {deviceName}</span>
              </div>
            )}
          </div>

          {/* Real Battery Status (Read-Only Real Sensor Data) */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-slate-800">
              <span className="flex items-center gap-2">
                {getBatteryIcon()}
                Status Real da Bateria do Dispositivo
              </span>
              <span
                className={`font-mono text-xs font-bold px-3 py-1 rounded-full border ${
                  batteryLevel <= 20
                    ? 'bg-red-100 text-red-700 border-red-200'
                    : batteryLevel <= 50
                    ? 'bg-amber-100 text-amber-700 border-amber-200'
                    : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                }`}
              >
                {batteryLevel}%
              </span>
            </div>

            <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  batteryLevel <= 20
                    ? 'bg-red-500'
                    : batteryLevel <= 50
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${batteryLevel}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium pt-1">
              <span>Fonte de Alimentação:</span>
              <span className="font-bold text-slate-900 flex items-center gap-1">
                {isCharging ? (
                  <span className="text-emerald-600 flex items-center gap-1">
                    ⚡ Carregador Conectado (USB / Indução)
                  </span>
                ) : (
                  <span className="text-slate-600">🔋 Bateria (Desconectado)</span>
                )}
              </span>
            </div>
          </div>

          {/* Expressions Picker */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-600" />
                Expressão do BMO
              </span>
              <button
                type="button"
                onClick={onToggleSound}
                className="text-slate-600 hover:text-teal-700 flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-xl text-[11px] font-semibold cursor-pointer"
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-teal-600" /> Sons Ativos
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-slate-400" /> Mutado
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {expressions.map((exp) => (
                <button
                  key={exp.key}
                  type="button"
                  onClick={() => onChangeExpression(exp.key)}
                  className={`py-2.5 px-1 rounded-2xl text-xs font-bold border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    activeExpression === exp.key
                      ? 'bg-teal-50 border-teal-500 text-teal-950 shadow-sm scale-105 ring-1 ring-teal-400'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span className="text-xl">{exp.icon}</span>
                  <span className="text-[10px]">{exp.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={triggerFullscreen}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-xs cursor-pointer shadow-md"
          >
            <Maximize className="w-4 h-4 text-teal-400" />
            Alternar Modo Tela Cheia Imersiva
          </button>
        </div>
      )}

      {/* TAB 4: SYSTEM UPDATES & LOGS */}
      {activeTab === 'system' && (
        <div className="space-y-5">
          {/* Version Status Box */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 border border-slate-700 text-white space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-[11px] font-mono font-bold text-teal-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  ATUALIZAÇÃO AUTOMÁTICA PRIORITÁRIA ATIVA
                </div>
                <div className="text-base font-bold flex items-center gap-2 mt-0.5">
                  <span>Versão Atual:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono text-xs border border-teal-500/30">
                    v{currentVersion}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
                {isOnline ? (
                  <>
                    <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-amber-400">Offline</span>
                  </>
                )}
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
              ⚡ O BMO verifica o servidor a cada <b>15 segundos</b>. Qualquer modificação ou nova versão lançada é baixada e aplicada automaticamente com prioridade máxima!
            </p>

            {/* Check Result Message */}
            {updateCheckResultText && (
              <div className="p-3 rounded-xl bg-teal-950/80 border border-teal-500/40 text-teal-200 text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{updateCheckResultText}</span>
              </div>
            )}

            {/* Real Update Check Button */}
            <button
              type="button"
              onClick={onCheckForUpdate}
              disabled={isUpdating}
              className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 px-4 rounded-xl transition-all text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <DownloadCloud className={`w-4 h-4 text-teal-100 ${isUpdating ? 'animate-bounce' : ''}`} />
              Verificar Atualizações no Servidor
            </button>
          </div>

          {/* System Terminal Event Logs */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-800 flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-teal-600" />
                Logs de Eventos Reais do Sistema
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{eventLogs.length} eventos</span>
            </div>

            <div className="bg-slate-950 text-emerald-400 font-mono text-xs rounded-2xl p-4 h-44 overflow-y-auto space-y-1.5 shadow-inner border border-slate-800">
              {eventLogs.length === 0 ? (
                <p className="text-slate-600 italic text-[11px]">Nenhum evento registrado ainda.</p>
              ) : (
                eventLogs.map((log, index) => (
                  <div key={index} className="text-[11px] leading-relaxed border-b border-slate-900 pb-1">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
