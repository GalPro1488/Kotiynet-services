import React from 'react';
import { User, Wallet, ShieldCheck, LogOut } from 'lucide-react';
import { KotiynetEmblem, KotiynetFlag } from './FlagsAndEmblems.tsx';

interface HeaderProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  balance: number;
  onOpenWallet: () => void;
  onOpenProfile: () => void;
  onLogout?: () => void;
}

export function Header({
  activeTab,
  onSelectTab,
  balance,
  onOpenWallet,
  onOpenProfile,
  onLogout,
}: HeaderProps) {
  const navItems = [
    { id: 'home', label: 'Главная' },
    { id: 'services', label: 'Услуги' },
    { id: 'bank', label: 'Банк' },
    { id: 'career', label: 'Карьера' },
    { id: 'messenger', label: 'Мессенджер' },
    { id: 'government', label: 'Правительство' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      {/* Top Authority & User Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Left: Shield Emblem + Flag + State Brand Title */}
          <div className="flex items-center gap-3.5 min-w-0">
            <button
              onClick={() => onSelectTab('home')}
              className="flex items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-sm"
              title="На главную страницу портала"
            >
              <div className="flex items-center gap-2 shrink-0">
                <KotiynetEmblem className="w-9 h-9 shrink-0 drop-shadow-xs" />
                <KotiynetFlag className="w-6.5 h-4.5 shrink-0" />
              </div>

              <div className="flex flex-col">
                <span className="text-sm sm:text-base font-bold tracking-tight text-slate-900 leading-none">
                  КОТИНЕТИНСКАЯ ФЕДЕРАЦИЯ
                </span>
                <span className="text-[11px] sm:text-xs font-normal text-slate-500 tracking-normal mt-0.5">
                  Официальный государственный портал • Kotiynet Services
                </span>
              </div>
            </button>
          </div>

          {/* Right: Balance Indicator + Generic User Avatar + Logout */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Digital Wallet Balance Indicator */}
            <button
              onClick={onOpenWallet}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-sky-50/70 border border-slate-200/80 rounded-md transition-colors text-left group"
              title="Управление счетом гражданина"
            >
              <Wallet className="w-4 h-4 text-sky-600 group-hover:scale-105 transition-transform" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase font-medium leading-none">Единый кошелек</span>
                <span className="text-xs sm:text-sm font-semibold text-slate-900 tracking-tight tabular-nums">
                  Счет: {balance.toLocaleString('ru-RU')} K$
                </span>
              </div>
            </button>

            {/* Quick Citizen Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-600 bg-slate-50 border border-slate-200/60 rounded-md">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              <span className="text-[11px] font-medium">Верифицирован</span>
            </div>

            {/* Generic User Avatar */}
            <button
              onClick={onOpenProfile}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              aria-label="Профиль пользователя"
              title="Личный кабинет гражданина"
            >
              <User className="w-5 h-5 text-slate-600" />
            </button>

            {/* Clean Logout Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                title="Выйти из личного кабинета"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Выйти</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Primary Horizontal Navigation Menu with Black Text Links */}
      <div className="border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-1 sm:space-x-8 h-11 overflow-x-auto no-scrollbar">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`relative h-11 inline-flex items-center text-sm font-medium transition-colors whitespace-nowrap px-1 ${
                    isActive
                      ? 'text-slate-950 font-semibold'
                      : 'text-slate-800 hover:text-sky-700'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 inset-x-0 h-[2.5px] bg-sky-600 rounded-t-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
