import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Check, Heart, User, Palette, CheckCircle2 } from 'lucide-react';
import { BmoCustomization, BmoGender, BmoTheme } from '../types';

interface BmoOnboardingModalProps {
  isOpen: boolean;
  onComplete: (newCustomization: BmoCustomization) => void;
  initialCustomization?: BmoCustomization;
}

export const BmoOnboardingModal: React.FC<BmoOnboardingModalProps> = ({
  isOpen,
  onComplete,
  initialCustomization = {
    gender: 'boy',
    accessory: 'none',
    theme: 'classic',
    name: 'BMO',
  },
}) => {
  const [gender, setGender] = useState<BmoGender>(initialCustomization.gender || 'boy');
  const [theme, setTheme] = useState<BmoTheme>(initialCustomization.theme || 'classic');
  const [name, setName] = useState<string>(initialCustomization.name || 'BMO');

  const themesList: { id: BmoTheme; name: string; bgClass: string; borderClass: string; textClass: string }[] = [
    {
      id: 'classic',
      name: 'Verde Clássico',
      bgClass: 'bg-gradient-to-br from-[#8eeada] via-[#5ed2bd] to-[#3bbba5]',
      borderClass: 'border-teal-400',
      textClass: 'text-teal-900',
    },
    {
      id: 'pink',
      name: 'Rosa Chiclete',
      bgClass: 'bg-gradient-to-br from-[#ffb2c9] via-[#f78ca0] to-[#f472b6]',
      borderClass: 'border-pink-400',
      textClass: 'text-pink-950',
    },
    {
      id: 'blue',
      name: 'Azul Celeste',
      bgClass: 'bg-gradient-to-br from-[#7dd3fc] via-[#38bdf8] to-[#0284c7]',
      borderClass: 'border-sky-400',
      textClass: 'text-sky-950',
    },
    {
      id: 'purple',
      name: 'Roxo Galáxia',
      bgClass: 'bg-gradient-to-br from-[#d8b4fe] via-[#c084fc] to-[#9333ea]',
      borderClass: 'border-purple-400',
      textClass: 'text-purple-950',
    },
    {
      id: 'gold',
      name: 'Dourado Especial',
      bgClass: 'bg-gradient-to-br from-[#fde047] via-[#eab308] to-[#ca8a04]',
      borderClass: 'border-amber-400',
      textClass: 'text-amber-950',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      gender,
      accessory: 'none',
      theme,
      name: name.trim() || 'BMO',
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-slate-900 border-2 border-teal-500/50 rounded-3xl shadow-2xl p-6 sm:p-8 text-white space-y-6 overflow-hidden"
        >
          {/* Top Decorative Lights */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-400 via-pink-400 to-amber-400" />

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-mono font-bold border border-teal-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              PRIMEIRO ACESSO AO BMO
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Configure o seu BMO! 🤖
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Escolha as preferências do seu robozinho para personalizar a experiência.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* STEP 1: GENDER SELECTION */}
            <div className="space-y-3">
              <label className="text-xs font-mono font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-teal-400" />
                1. O seu BMO é Menino ou Menina?
              </label>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {/* BOY OPTION */}
                <button
                  type="button"
                  onClick={() => setGender('boy')}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2.5 cursor-pointer relative overflow-hidden ${
                    gender === 'boy'
                      ? 'bg-teal-950/80 border-teal-400 text-white shadow-lg shadow-teal-500/20 scale-[1.02]'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <div className="w-12 h-10 bg-teal-200 rounded-lg border border-teal-800 flex items-center justify-center gap-1 relative">
                    <div className="w-1.5 h-2 bg-slate-900 rounded-full" />
                    <div className="w-1.5 h-0.5 bg-slate-900 rounded-full mt-1" />
                    <div className="w-1.5 h-2 bg-slate-900 rounded-full" />
                    {/* Bowtie icon */}
                    <div className="absolute -bottom-1 w-3 h-1.5 bg-blue-600 rounded-sm" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold">Menino 👦</div>
                    <div className="text-[10px] text-slate-400">Gravatinha Azul</div>
                  </div>
                  {gender === 'boy' && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-teal-400 rounded-full flex items-center justify-center text-slate-950">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>

                {/* GIRL OPTION */}
                <button
                  type="button"
                  onClick={() => setGender('girl')}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2.5 cursor-pointer relative overflow-hidden ${
                    gender === 'girl'
                      ? 'bg-pink-950/80 border-pink-400 text-white shadow-lg shadow-pink-500/20 scale-[1.02]'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <div className="w-12 h-10 bg-pink-200 rounded-lg border border-pink-800 flex items-center justify-center gap-1 relative">
                    <div className="w-1.5 h-2 bg-slate-900 rounded-full" />
                    <div className="w-1.5 h-0.5 bg-slate-900 rounded-full mt-1" />
                    <div className="w-1.5 h-2 bg-slate-900 rounded-full" />
                    {/* Hairbow icon */}
                    <div className="absolute -top-1.5 right-1 w-3.5 h-2 bg-pink-500 rounded-full" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold">Menina 👧</div>
                    <div className="text-[10px] text-slate-400">Laço Rosa</div>
                  </div>
                  {gender === 'girl' && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-pink-400 rounded-full flex items-center justify-center text-slate-950">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* STEP 2: COLOR / THEME SELECTION */}
            <div className="space-y-3">
              <label className="text-xs font-mono font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-teal-400" />
                2. Escolha a Cor do seu BMO:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {themesList.map((t) => {
                  const isSelected = theme === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTheme(t.id)}
                      className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 cursor-pointer text-left relative overflow-hidden ${
                        isSelected
                          ? 'border-white ring-2 ring-teal-400/80 scale-[1.03] shadow-md'
                          : 'border-slate-700 hover:border-slate-500 opacity-80 hover:opacity-100'
                      }`}
                    >
                      {/* Color Preview Block */}
                      <div className={`w-full h-10 rounded-xl ${t.bgClass} flex items-center justify-center border border-white/20 shadow-inner relative`}>
                        <div className="w-6 h-4 bg-slate-950/20 rounded-md border border-slate-950/30 flex items-center justify-center gap-0.5">
                          <div className="w-0.5 h-1 bg-slate-900 rounded-full" />
                          <div className="w-0.5 h-1 bg-slate-900 rounded-full" />
                        </div>
                      </div>
                      <span className="text-xs font-bold text-white text-center">
                        {t.name}
                      </span>
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-white rounded-full flex items-center justify-center text-slate-950 shadow">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 3: NAME */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-teal-400" />
                3. Nome do seu BMO:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: BMO, Beemo, BMO Fofo"
                maxLength={20}
                className="w-full bg-slate-800 border-2 border-slate-700 focus:border-teal-400 rounded-xl px-4 py-2.5 text-sm font-semibold text-white placeholder-slate-500 outline-none transition-colors"
              />
            </div>

            {/* CONFIRM BUTTON */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-500 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-extrabold py-3.5 px-6 rounded-2xl transition-all shadow-xl hover:shadow-teal-500/20 text-sm cursor-pointer flex items-center justify-center gap-2 transform active:scale-98 mt-4"
            >
              <CheckCircle2 className="w-5 h-5" />
              Concluir & Iniciar BMO!
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
