import React from 'react';
import { User, Shirt, Palette, Check, Sparkles } from 'lucide-react';
import { BmoCustomization, BmoGender, BmoAccessory, BmoTheme } from '../types';

interface BmoCustomizerProps {
  customization: BmoCustomization;
  onChangeCustomization: (newCustomization: BmoCustomization) => void;
  onOpenOnboarding?: () => void;
}

export const BmoCustomizer: React.FC<BmoCustomizerProps> = ({
  customization,
  onChangeCustomization,
  onOpenOnboarding,
}) => {
  const handleGenderChange = (gender: BmoGender) => {
    onChangeCustomization({
      ...customization,
      gender,
      accessory: gender === 'girl' ? 'hairbow' : 'bowtie',
    });
  };

  const handleAccessoryChange = (accessory: BmoAccessory) => {
    onChangeCustomization({
      ...customization,
      accessory,
    });
  };

  const handleThemeChange = (theme: BmoTheme) => {
    onChangeCustomization({
      ...customization,
      theme,
    });
  };

  const accessories: { key: BmoAccessory; label: string; icon: string; desc: string }[] = [
    { key: 'none', label: 'Sem Acessório', icon: '🚫', desc: 'Visual Limpo' },
    { key: 'hairbow', label: 'Laço Rosa', icon: '🎀', desc: 'Fofo na Cabeça' },
    { key: 'bowtie', label: 'Gravata Borboleta', icon: '👔', desc: 'Elegante' },
  ];

  const themes: { key: BmoTheme; label: string; gradient: string; previewColor: string }[] = [
    { key: 'classic', label: 'Menta Clássico', gradient: 'from-emerald-400 to-teal-500', previewColor: '#5ed2bd' },
    { key: 'pink', label: 'Rosa Algodão', gradient: 'from-pink-300 to-rose-400', previewColor: '#f78ca0' },
    { key: 'blue', label: 'Azul Celeste', gradient: 'from-sky-300 to-cyan-500', previewColor: '#38bdf8' },
    { key: 'purple', label: 'Roxo Cósmico', gradient: 'from-purple-300 to-indigo-500', previewColor: '#c084fc' },
    { key: 'gold', label: 'Edição Dourada', gradient: 'from-amber-300 to-yellow-500', previewColor: '#eab308' },
  ];

  const activeThemeObj = themes.find((t) => t.key === customization.theme) || themes[0];

  return (
    <div className="space-y-6 text-slate-100">
      {/* 1. VISUAL LIVE PREVIEW MINI CARD */}
      <div className="bg-gradient-to-br from-slate-950 to-slate-900 rounded-2xl p-4 border border-slate-800 shadow-lg flex items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-bold font-mono">
            <Sparkles className="w-3 h-3 text-teal-300" />
            Pré-visualização
          </div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            {customization.gender === 'girl' ? '👧 BMO Menina' : '👦 BMO Menino'}
          </h3>
          <p className="text-xs text-slate-400">
            {customization.gender === 'girl' ? 'Visual fofo com cílios e acessórios' : 'Visual clássico e aventureiro'}
          </p>
        </div>

        {/* Mini Preview Face Avatar */}
        <div
          className="w-20 h-20 rounded-2xl border-2 border-white/20 shadow-inner flex items-center justify-center relative overflow-hidden shrink-0"
          style={{ backgroundColor: activeThemeObj.previewColor }}
        >
          <svg viewBox="0 0 100 80" className="w-16 h-12">
            {/* Eyes */}
            <circle cx="30" cy="35" r="7" fill="#0f172a" />
            <circle cx="70" cy="35" r="7" fill="#0f172a" />
            {customization.gender === 'girl' && (
              <g stroke="#0f172a" strokeWidth="2" strokeLinecap="round">
                <line x1="22" y1="28" x2="17" y2="22" />
                <line x1="30" y1="25" x2="28" y2="18" />
                <line x1="70" y1="25" x2="72" y2="18" />
                <line x1="78" y1="28" x2="83" y2="22" />
              </g>
            )}
            {/* Smile */}
            <path d="M 40 50 Q 50 62 60 50" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Cheeks */}
            <ellipse cx="20" cy="45" rx="6" ry="4" fill="#ff70a6" opacity="0.8" />
            <ellipse cx="80" cy="45" rx="6" ry="4" fill="#ff70a6" opacity="0.8" />
          </svg>
        </div>
      </div>

      {/* 2. GÊNERO / PERSONAGEM */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <User className="w-4 h-4 text-teal-400" />
          Escolha o Personagem
        </label>

        <div className="grid grid-cols-2 gap-3">
          {/* Menino Button */}
          <button
            type="button"
            onClick={() => handleGenderChange('boy')}
            className={`relative p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3 ${
              customization.gender === 'boy'
                ? 'bg-sky-950/70 border-sky-400 text-sky-200 shadow-md ring-1 ring-sky-400'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-sky-900/60 border border-sky-700/60 flex items-center justify-center text-2xl shrink-0 shadow-sm">
              👦
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm flex items-center gap-1 text-white">
                Menino
                {customization.gender === 'boy' && (
                  <Check className="w-4 h-4 text-sky-400 ml-auto shrink-0" />
                )}
              </div>
              <div className="text-[11px] text-slate-400 font-medium">BMO Clássico</div>
            </div>
          </button>

          {/* Menina Button */}
          <button
            type="button"
            onClick={() => handleGenderChange('girl')}
            className={`relative p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3 ${
              customization.gender === 'girl'
                ? 'bg-pink-950/70 border-pink-400 text-pink-200 shadow-md ring-1 ring-pink-400'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-pink-900/60 border border-pink-700/60 flex items-center justify-center text-2xl shrink-0 shadow-sm">
              👧
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm flex items-center gap-1 text-white">
                Menina
                {customization.gender === 'girl' && (
                  <Check className="w-4 h-4 text-pink-400 ml-auto shrink-0" />
                )}
              </div>
              <div className="text-[11px] text-pink-400 font-medium">Cílios & Laço 🎀</div>
            </div>
          </button>
        </div>
      </div>

      {/* 3. ACESSÓRIOS */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Shirt className="w-4 h-4 text-purple-400" />
          Acessórios
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {accessories.map((acc) => {
            const isSelected = customization.accessory === acc.key;
            return (
              <button
                key={acc.key}
                type="button"
                onClick={() => handleAccessoryChange(acc.key)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                  isSelected
                    ? 'bg-teal-950/80 border-teal-400 text-teal-200 font-bold shadow-sm ring-1 ring-teal-400'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-900'
                }`}
              >
                <span className="text-xl shrink-0">{acc.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold truncate text-white">{acc.label}</div>
                  <div className="text-[10px] text-slate-400 font-normal truncate">{acc.desc}</div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-teal-400 shrink-0 ml-auto" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. TEMAS DE COR */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Palette className="w-4 h-4 text-amber-400" />
          Cor do Display do BMO
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {themes.map((thm) => {
            const isSelected = customization.theme === thm.key;
            return (
              <button
                key={thm.key}
                type="button"
                onClick={() => handleThemeChange(thm.key)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  isSelected
                    ? 'bg-teal-500/20 border-teal-400 text-white font-bold shadow-md ring-1 ring-teal-400'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full bg-gradient-to-r ${thm.gradient} shrink-0 border border-white/20 shadow-sm flex items-center justify-center`}
                >
                  {isSelected && <Check className="w-4 h-4 text-slate-950 stroke-[3]" />}
                </div>
                <span className="text-xs font-bold flex-1">{thm.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. RE-RUN ONBOARDING ASSISTANT */}
      {onOpenOnboarding && (
        <div className="pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onOpenOnboarding}
            className="w-full py-3 px-4 bg-slate-950/80 hover:bg-slate-900 text-teal-300 font-bold rounded-2xl transition-all border border-teal-500/30 text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-teal-400" />
            Refazer Assistente de Primeiro Acesso
          </button>
        </div>
      )}
    </div>
  );
};
