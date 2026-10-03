import React from 'react';
import { CreditCard, ArrowUpRight, ArrowDownLeft, Shield, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { KotiynetEmblem } from './FlagsAndEmblems.tsx';

interface NationalBankCardProps {
  balance: number;
  onOpenBankDetails: () => void;
  onOpenTransfer: () => void;
}

export function NationalBankCard({
  balance,
  onOpenBankDetails,
  onOpenTransfer,
}: NationalBankCardProps) {
  const [showFullNumber, setShowFullNumber] = React.useState(false);

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
      
      {/* Header Info */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[11px] font-semibold tracking-wider uppercase text-sky-700">
            Государственная платежная система
          </span>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Национальный Банк Котинетинской Федерации
          </h2>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 border border-sky-100 rounded text-sky-800 text-[11px] font-medium">
          <Shield className="w-3.5 h-3.5" />
          <span>Госстрахование вкладов</span>
        </div>
      </div>

      {/* Realistic Digital Bank Card Visual */}
      <div className="relative w-full rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-white shadow-md overflow-hidden">
        {/* Subtle Guilloche / Geometric Watermark */}
        <div className="absolute -right-12 -bottom-12 w-48 h-48 opacity-10 pointer-events-none">
          <KotiynetEmblem className="w-full h-full text-white" />
        </div>

        {/* Card Top Row: Bank Name + Chip */}
        <div className="flex items-start justify-between relative z-10 mb-6">
          <div>
            <span className="text-[10px] tracking-widest text-slate-300 uppercase block font-mono">
              NBKF • NATIONAL BANK OF KOTIYNET
            </span>
            <span className="text-xs sm:text-sm font-semibold tracking-tight text-white">
              Карта Гражданина КФ • Единый расчетный счет
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Contactless waves SVG */}
            <svg className="w-5 h-5 text-sky-300 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8.5 16.5a5 5 0 0 1 0-9" strokeLinecap="round" />
              <path d="M12 19a8.5 8.5 0 0 0 0-14" strokeLinecap="round" />
              <path d="M15.5 21.5a12 12 0 0 0 0-19" strokeLinecap="round" />
            </svg>
            <div className="w-6 h-6 rounded-full bg-sky-500/20 flex items-center justify-center border border-sky-400/40">
              <KotiynetEmblem className="w-4 h-4 text-sky-200" />
            </div>
          </div>
        </div>

        {/* Realistic EMV Chip */}
        <div className="relative z-10 w-11 h-8 rounded-sm bg-gradient-to-tr from-amber-300 via-amber-200 to-yellow-100 border border-amber-400/80 shadow-inner flex items-center justify-center mb-5">
          <div className="w-full h-full grid grid-cols-3 grid-rows-2 gap-[1px] p-[2px] opacity-70">
            <div className="border border-amber-600/50 rounded-[1px]"></div>
            <div className="border border-amber-600/50 rounded-[1px]"></div>
            <div className="border border-amber-600/50 rounded-[1px]"></div>
            <div className="border border-amber-600/50 rounded-[1px]"></div>
            <div className="border border-amber-600/50 rounded-[1px]"></div>
            <div className="border border-amber-600/50 rounded-[1px]"></div>
          </div>
        </div>

        {/* Card Number & Balance */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm sm:text-base tracking-widest text-slate-200">
                {showFullNumber ? '4276 9918 2400 8842' : '•••• •••• •••• 8842'}
              </span>
              <button
                onClick={() => setShowFullNumber(!showFullNumber)}
                className="text-slate-400 hover:text-white transition-colors"
                title={showFullNumber ? 'Скрыть номер' : 'Показать номер'}
              >
                {showFullNumber ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="mt-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">Владелец счета</span>
              <span className="text-xs sm:text-sm font-semibold tracking-wider font-mono text-white">
                CITIZEN OF KOTIYNET
              </span>
            </div>
          </div>

          <div className="sm:text-right">
            <span className="text-[10px] text-sky-300 uppercase tracking-wider block font-mono">Доступный остаток</span>
            <span className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
              {balance.toLocaleString('ru-RU')} K$
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Operations */}
      <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2">
        <button
          onClick={onOpenTransfer}
          className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-slate-50 hover:bg-sky-50 text-slate-800 hover:text-sky-900 border border-slate-200/80 rounded-lg text-xs font-medium transition-colors"
        >
          <ArrowUpRight className="w-3.5 h-3.5 text-sky-600" />
          <span>Перевести</span>
        </button>

        <button
          onClick={onOpenBankDetails}
          className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-slate-50 hover:bg-sky-50 text-slate-800 hover:text-sky-900 border border-slate-200/80 rounded-lg text-xs font-medium transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-sky-600" />
          <span>Выписка</span>
        </button>

        <button
          onClick={onOpenBankDetails}
          className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-slate-50 hover:bg-sky-50 text-slate-800 hover:text-sky-900 border border-slate-200/80 rounded-lg text-xs font-medium transition-colors"
        >
          <CreditCard className="w-3.5 h-3.5 text-sky-600" />
          <span>Реквизиты</span>
        </button>
      </div>
    </div>
  );
}
