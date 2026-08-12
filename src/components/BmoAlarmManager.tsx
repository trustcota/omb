import React, { useState } from 'react';
import {
  AlarmClock,
  Plus,
  Trash2,
  Bell,
  BellOff,
  Check,
  Volume2,
  Clock,
  Sparkles,
  Calendar,
  Music,
  Info,
} from 'lucide-react';
import { BmoAlarm, AlarmSound } from '../types';

interface BmoAlarmManagerProps {
  alarms: BmoAlarm[];
  onAddAlarm: (alarm: Omit<BmoAlarm, 'id'>) => void;
  onToggleAlarm: (id: string) => void;
  onDeleteAlarm: (id: string) => void;
  onTestSound: (sound: AlarmSound) => void;
}

const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const SOUND_OPTIONS: { key: AlarmSound; label: string; icon: string }[] = [
  { key: 'bmo_chime', label: 'BMO Retro Chime', icon: '🎵' },
  { key: 'game_8bit', label: 'Videogame 8-Bit', icon: '👾' },
  { key: 'sing_song', label: 'Música do BMO', icon: '💖' },
  { key: 'digital', label: 'Digital Clássico', icon: '⏰' },
];

export const BmoAlarmManager: React.FC<BmoAlarmManagerProps> = ({
  alarms,
  onAddAlarm,
  onToggleAlarm,
  onDeleteAlarm,
  onTestSound,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [time, setTime] = useState('07:00');
  const [label, setLabel] = useState('');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]); // Mon-Fri default
  const [sound, setSound] = useState<AlarmSound>('bmo_chime');

  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() => {
    return 'Notification' in window ? Notification.permission : 'denied';
  });

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) return;
    try {
      const perm = await Notification.requestPermission();
      setNotificationPermission(perm);
    } catch (e) {}
  };

  const toggleDay = (dayIndex: number) => {
    if (selectedDays.includes(dayIndex)) {
      setSelectedDays(selectedDays.filter((d) => d !== dayIndex));
    } else {
      setSelectedDays([...selectedDays, dayIndex].sort());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAlarm({
      time,
      label: label.trim() || 'Alarme do BMO',
      enabled: true,
      days: selectedDays,
      sound,
    });
    setLabel('');
    setShowAddForm(false);
  };

  // Calculate time remaining until next alarm
  const getNextAlarmText = () => {
    const activeAlarms = alarms.filter((a) => a.enabled);
    if (activeAlarms.length === 0) return null;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    let shortestDiff = Infinity;
    let nextAlarm: BmoAlarm | null = null;

    activeAlarms.forEach((a) => {
      const [h, m] = a.time.split(':').map(Number);
      const alarmMinutes = h * 60 + m;
      let diff = alarmMinutes - currentMinutes;
      if (diff <= 0) {
        diff += 24 * 60; // Next day
      }
      if (diff < shortestDiff) {
        shortestDiff = diff;
        nextAlarm = a;
      }
    });

    if (!nextAlarm) return null;

    const hours = Math.floor(shortestDiff / 60);
    const mins = shortestDiff % 60;
    const timeStr = hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;

    return {
      alarm: nextAlarm as BmoAlarm,
      timeStr,
    };
  };

  const nextAlarmInfo = getNextAlarmText();

  return (
    <div className="space-y-5">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-amber-500/10 via-teal-500/10 to-amber-500/10 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-700 flex items-center justify-center shrink-0">
            <AlarmClock className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Alarme Inteligente do BMO</h4>
            <p className="text-[11px] text-slate-500">
              Desperte com os sons e vibrações do BMO
            </p>
          </div>
        </div>

        {/* NOTIFICATION PERMISSION TOGGLE */}
        {'Notification' in window && (
          <button
            type="button"
            onClick={requestNotificationPermission}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              notificationPermission === 'granted'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-amber-100 border-amber-300 text-amber-900 shadow-sm'
            }`}
          >
            {notificationPermission === 'granted' ? (
              <>
                <Bell className="w-3.5 h-3.5 text-emerald-600" />
                <span>Notificações Ativas</span>
              </>
            ) : (
              <>
                <BellOff className="w-3.5 h-3.5 text-amber-600" />
                <span>Ativar Notificações</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* NEXT UPCOMING ALARM COUNTDOWN BANNER */}
      {nextAlarmInfo && (
        <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Próximo Alarme:</span>
              <span className="text-xs font-bold text-amber-300">
                {nextAlarmInfo.alarm.time} ({nextAlarmInfo.alarm.label})
              </span>
            </div>
          </div>
          <div className="bg-amber-400/10 border border-amber-400/30 text-amber-300 px-3 py-1 rounded-xl text-xs font-mono font-bold">
            em {nextAlarmInfo.timeStr}
          </div>
        </div>
      )}

      {/* ADD ALARM BUTTON / FORM */}
      {!showAddForm ? (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 text-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Novo Alarme</span>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-4 shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Novo Alarme do BMO
            </span>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              Cancelar
            </button>
          </div>

          {/* Time Picker & Label */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Horário</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-lg font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Nome do Alarme</label>
              <input
                type="text"
                placeholder="Ex: Hora do Lanche, Acordar..."
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Days selector */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-teal-600" />
              <span>Dias de Repetição (Vazio = Uma única vez)</span>
            </label>
            <div className="flex gap-1.5">
              {DAY_NAMES.map((name, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleDay(i)}
                  className={`flex-1 py-1.5 text-[11px] font-bold rounded-xl border transition-all cursor-pointer ${
                    selectedDays.includes(i)
                      ? 'bg-teal-600 text-white border-teal-700 shadow-sm'
                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Sound Selector */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1.5 flex items-center gap-1">
              <Music className="w-3.5 h-3.5 text-amber-500" />
              <span>Som do Alarme</span>
            </label>

            <div className="grid grid-cols-2 gap-2">
              {SOUND_OPTIONS.map((opt) => (
                <div
                  key={opt.key}
                  className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    sound === opt.key
                      ? 'bg-amber-50 border-amber-400 text-amber-950 font-bold shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                  onClick={() => setSound(opt.key)}
                >
                  <div className="flex items-center gap-1.5 text-xs">
                    <span>{opt.icon}</span>
                    <span className="text-[11px]">{opt.label}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTestSound(opt.key);
                    }}
                    title="Ouvir som de teste"
                    className="text-amber-600 hover:text-amber-800 p-1 rounded-lg hover:bg-amber-100"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Form Submit Button */}
          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Salvar Alarme</span>
          </button>
        </form>
      )}

      {/* ALARMS LIST */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <AlarmClock className="w-4 h-4 text-amber-500" />
            Alarmes Salvos
          </span>
          <span className="text-[10px] text-slate-400 font-mono font-normal">
            {alarms.length} {alarms.length === 1 ? 'alarme' : 'alarmes'}
          </span>
        </label>

        {alarms.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-1">
            <p className="text-xs font-bold text-slate-600">Nenhum alarme configurado</p>
            <p className="text-[11px] text-slate-400">Clique no botão acima para adicionar um alarme do BMO!</p>
          </div>
        ) : (
          alarms.map((alarm) => {
            const soundOpt = SOUND_OPTIONS.find((s) => s.key === alarm.sound);
            return (
              <div
                key={alarm.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 shadow-sm ${
                  alarm.enabled
                    ? 'bg-white border-slate-200/90'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black font-mono text-slate-900">
                      {alarm.time}
                    </span>
                    <span className="text-xs font-extrabold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-200/60">
                      {alarm.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                    <span>{soundOpt?.icon} {soundOpt?.label}</span>
                    <span>•</span>
                    <span>
                      {alarm.days.length === 0
                        ? 'Uma vez'
                        : alarm.days.length === 7
                        ? 'Todos os dias'
                        : alarm.days.map((d) => DAY_NAMES[d]).join(', ')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* ON/OFF TOGGLE SWITCH */}
                  <button
                    type="button"
                    onClick={() => onToggleAlarm(alarm.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      alarm.enabled
                        ? 'bg-emerald-500 text-slate-950 border-emerald-600 shadow-sm'
                        : 'bg-slate-200 text-slate-500 border-slate-300'
                    }`}
                  >
                    {alarm.enabled ? '🔔 Ativo' : '🔕 Inativo'}
                  </button>

                  {/* DELETE BUTTON */}
                  <button
                    type="button"
                    onClick={() => onDeleteAlarm(alarm.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                    title="Excluir alarme"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
