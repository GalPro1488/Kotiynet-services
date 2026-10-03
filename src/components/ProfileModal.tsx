import React, { useState } from 'react';
import {
  X,
  User,
  ShieldCheck,
  Lock,
  Cookie,
  KeyRound,
  LogOut,
  Calendar,
  Phone,
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Loader2,
} from 'lucide-react';
import { CitizenUser } from '../firebase.ts';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: CitizenUser;
  onUpdateUser: (updatedFields: Partial<CitizenUser>) => Promise<void>;
  onLogout: () => void;
}

export function ProfileModal({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onLogout,
}: ProfileModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleClaimSalary = async () => {
    setIsUpdating(true);
    setSuccessMsg('');
    try {
      const newBal = (user.balance || 0) + (user.salary || 450000);
      await onUpdateUser({
        balance: newBal,
        updatedAt: new Date().toISOString(),
      });
      setSuccessMsg(`Государственная заработная плата (+${(user.salary || 450000).toLocaleString('ru-RU')} K$) начислена на ваш счет в Национальном Банке!`);
    } catch {
      // handled
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-sky-600" />
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Личный кабинет гражданина КФ
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Avatar and citizen identity */}
          <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 border border-slate-300">
              <User className="w-6 h-6 text-slate-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 truncate">
                  {user.fullName || 'Гражданин КФ'}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="В сети" />
              </div>
              <span className="text-xs text-slate-500 font-mono block">
                {user.citizenId || 'KF-2026-991824'}
              </span>
              <div className="mt-1 flex items-center gap-1 text-[11px] text-sky-700 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Запись верифицирована в государственном реестре</span>
              </div>
            </div>
          </div>

          {/* Dynamic Financial Overview */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-sky-50/60 border border-sky-100 rounded-xl">
              <span className="text-[10px] text-sky-800 uppercase tracking-wider block font-semibold">
                Баланс кошелька
              </span>
              <span className="text-lg font-bold font-mono text-slate-900 tabular-nums">
                {(user.balance || 0).toLocaleString('ru-RU')} K$
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                Ежемесячный оклад
              </span>
              <span className="text-lg font-bold font-mono text-slate-900 tabular-nums">
                {(user.salary || 450000).toLocaleString('ru-RU')} K$
              </span>
            </div>
          </div>

          {/* Quick Salary Payout Action with Real-time Sync */}
          <button
            onClick={handleClaimSalary}
            disabled={isUpdating}
            className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
                <span>Обработка транзакции...</span>
              </>
            ) : (
              <>
                <DollarSign className="w-3.5 h-3.5 text-sky-300" />
                <span>Получить оклад (+{(user.salary || 450000).toLocaleString('ru-RU')} K$)</span>
              </>
            )}
          </button>

          {successMsg && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Citizen Registry Data */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-2 text-xs">
            <span className="text-[11px] font-semibold text-slate-900 block">
              Анкетные данные ЕСИА:
            </span>
            <div className="flex items-center justify-between text-slate-700">
              <span className="flex items-center gap-1.5 text-slate-500">
                <Phone className="w-3.5 h-3.5" /> Телефон:
              </span>
              <span className="font-mono font-medium">{user.phone}</span>
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span className="flex items-center gap-1.5 text-slate-500">
                <Calendar className="w-3.5 h-3.5" /> Дата рождения:
              </span>
              <span className="font-medium">{user.birthDate}</span>
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span className="flex items-center gap-1.5 text-slate-500">
                <AlertTriangle className="w-3.5 h-3.5" /> Задолженности:
              </span>
              <span className="font-mono font-medium text-emerald-700">
                {user.debt ? `${user.debt.toLocaleString('ru-RU')} K$` : '0 K$ (Задолженностей нет)'}
              </span>
            </div>
          </div>

          {/* Security & Protocol Stack */}
          <div className="space-y-1.5 pt-1 text-xs">
            <div className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
              Безопасность и архитектура
            </div>
            
            <div className="p-2.5 rounded-lg border border-slate-200/70 bg-white flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-700">
                <Lock className="w-4 h-4 text-sky-600" />
                <span>Авторизация и реестр</span>
              </div>
              <span className="font-mono text-[11px] text-slate-600">Государственный реестр ЕСИА</span>
            </div>

            <div className="p-2.5 rounded-lg border border-slate-200/70 bg-white flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-700">
                <Cookie className="w-4 h-4 text-sky-600" />
                <span>Хранение сессии</span>
              </div>
              <span className="font-mono text-[11px] text-slate-600">Cookie (kotiynet_session_uid)</span>
            </div>
          </div>

        </div>

        {/* Footer with Logout & Close */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-800 font-medium transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Выйти из системы</span>
          </button>
          
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-colors"
          >
            Закрыть
          </button>
        </div>

      </div>
    </div>
  );
}
