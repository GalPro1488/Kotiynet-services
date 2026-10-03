import React, { useState } from 'react';
import { X, ArrowUpRight, ArrowDownLeft, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { KotiynetEmblem } from './FlagsAndEmblems.tsx';

interface BankModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  onUpdateBalance: (newBalance: number) => void;
  mode: 'transfer' | 'details';
}

export function BankModal({
  isOpen,
  onClose,
  balance,
  onUpdateBalance,
  mode: initialMode,
}: BankModalProps) {
  const [tab, setTab] = useState<'details' | 'transfer'>(initialMode);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      setErrorMsg('Пожалуйста, укажите корректную сумму перевода.');
      return;
    }
    if (transferAmount > balance) {
      setErrorMsg('Недостаточно средств на счете гражданина.');
      return;
    }
    if (!recipient.trim()) {
      setErrorMsg('Укажите номер карты или ИИН получателя.');
      return;
    }

    const newBal = balance - transferAmount;
    onUpdateBalance(newBal);
    setSuccessMsg(`Перевод ${transferAmount.toLocaleString('ru-RU')} K$ успешно отправлен получателю «${recipient}». Комиссия: 0 K$ (Госсубсидия).`);
    setAmount('');
    setRecipient('');
  };

  const handleClaimReparationsDividend = () => {
    const dividend = 5000;
    const newBal = balance + dividend;
    onUpdateBalance(newBal);
    setSuccessMsg(`Начислена ежемесячная социальная выплата из Фонда репараций Мопсии: +${dividend.toLocaleString('ru-RU')} K$.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <KotiynetEmblem className="w-6 h-6" />
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Национальный Банк Котинетинской Федерации
              </h3>
              <span className="text-[11px] text-slate-500">
                Лицензия ЦБ КФ № 0001 • Государственный счет
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50/60">
          <button
            onClick={() => { setTab('details'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`py-3 text-xs font-semibold border-b-2 mr-6 transition-colors ${
              tab === 'details'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Счет и выписка
          </button>
          <button
            onClick={() => { setTab('transfer'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors ${
              tab === 'transfer'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Перевод в K$
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          
          {/* Balance card */}
          <div className="bg-slate-900 text-white rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                Текущий баланс счета
              </span>
              <div className="text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
                {balance.toLocaleString('ru-RU')} K$
              </div>
            </div>
            <button
              onClick={handleClaimReparationsDividend}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium rounded-lg transition-colors"
            >
              + Выплата из репараций
            </button>
          </div>

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {tab === 'details' ? (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-900">
                Последние транзакции по карте гражданина:
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200/70">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <ArrowDownLeft className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Репарационный дивиденд Мопсии</div>
                      <div className="text-[10px] text-slate-500">Фонд национального суверенитета</div>
                    </div>
                  </div>
                  <div className="font-mono font-semibold text-emerald-600 tabular-nums">
                    +15 000 K$
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200/70">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Оплата госпошлины КФ</div>
                      <div className="text-[10px] text-slate-500">Паспортный департамент</div>
                    </div>
                  </div>
                  <div className="font-mono font-semibold text-slate-700 tabular-nums">
                    -500 K$
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200/70">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <ArrowDownLeft className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Стимулирующая выплата IT-сектора</div>
                      <div className="text-[10px] text-slate-500">Минцифры Котинета</div>
                    </div>
                  </div>
                  <div className="font-mono font-semibold text-emerald-600 tabular-nums">
                    +25 000 K$
                  </div>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                <span>Все операции защищены квантовым шифрованием Госбезопасности КФ.</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleTransfer} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Номер карты получателя или ИИН
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="4276 •••• •••• •••• или ИИН гражданина"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Сумма перевода (K$)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Например: 5000"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                Подтвердить перевод без комиссии
              </button>
            </form>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>НБКФ: Ставка ЦБ 2.5%</span>
          <button
            onClick={onClose}
            className="text-slate-700 hover:text-slate-900 font-medium"
          >
            Закрыть
          </button>
        </div>

      </div>
    </div>
  );
}
