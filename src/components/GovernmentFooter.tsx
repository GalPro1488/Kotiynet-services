import React from 'react';
import { Shield, Lock, Cookie, PhoneCall, ExternalLink } from 'lucide-react';
import { KotiynetEmblem } from './FlagsAndEmblems.tsx';

interface GovernmentMember {
  role: string;
  department: string;
  status: string;
}

export function GovernmentFooter() {
  const governmentMembers: GovernmentMember[] = [
    {
      role: 'Президент Котинетинской Федерации',
      department: 'Администрация Главы Государства',
      status: 'Действующий мандат',
    },
    {
      role: 'Министр образования и иностранных дел',
      department: 'Министерство образования и внешнеполитических связей КФ',
      status: 'Дипломатический корпус',
    },
    {
      role: 'Министр обороны',
      department: 'Министерство обороны и суверенной безопасности КФ',
      status: 'Генеральный штаб',
    },
    {
      role: 'Министр ПО и IT',
      department: 'Министерство программного обеспечения и цифровизации КФ',
      status: 'Цифровая платформа',
    },
  ];

  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-12 text-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Top Cabinet Ministers Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <KotiynetEmblem className="w-5 h-5 shrink-0" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Состав Правительства Котинетинской Федерации
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            {governmentMembers.map((member, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-slate-50/80 border border-slate-200/70"
              >
                <div className="text-xs font-semibold text-slate-900">
                  {member.role}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                  {member.department}
                </div>
                <div className="mt-2 text-[10px] text-sky-700 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-600 inline-block" />
                  {member.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200/80 my-6" />

        {/* Navigation & Help Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs text-slate-600">
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Государственные сервисы</h4>
            <ul className="space-y-1.5">
              <li><a href="#services" className="hover:text-sky-700 transition-colors">Единый реестр документов</a></li>
              <li><a href="#services" className="hover:text-sky-700 transition-colors">Электронная регистратура</a></li>
              <li><a href="#services" className="hover:text-sky-700 transition-colors">Налоговый мониторинг</a></li>
              <li><a href="#services" className="hover:text-sky-700 transition-colors">Федеральная биржа труда</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Финансовая система</h4>
            <ul className="space-y-1.5">
              <li><a href="#bank" className="hover:text-sky-700 transition-colors">Национальный Банк КФ</a></li>
              <li><a href="#bank" className="hover:text-sky-700 transition-colors">Курс котинетинского доллара (K$)</a></li>
              <li><a href="#bank" className="hover:text-sky-700 transition-colors">Фонд репараций Мопсии</a></li>
              <li><a href="#bank" className="hover:text-sky-700 transition-colors">Государственные облигации</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Международный статус</h4>
            <ul className="space-y-1.5">
              <li><a href="#geopolitical" className="hover:text-sky-700 transition-colors">Признание суверенитета Россией</a></li>
              <li><a href="#geopolitical" className="hover:text-sky-700 transition-colors">Мандатная миссия в Украине</a></li>
              <li><a href="#geopolitical" className="hover:text-sky-700 transition-colors">Акт о капитуляции Мопсии</a></li>
              <li><a href="#geopolitical" className="hover:text-sky-700 transition-colors">Дипломатический вестник</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Поддержка граждан</h4>
            <div className="space-y-1.5">
              <div className="font-mono font-medium text-slate-900">8 (800) 100-KOT</div>
              <div className="text-[11px] text-slate-500">Круглосуточный контакт-центр</div>
              <div className="text-[11px] text-slate-500">support@gosuslugi.kot.fed</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Discreet Auth & Cookie Notices */}
        <div className="border-t border-slate-200/80 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]">
            <span>© 2026 Котинетинская Федерация. Все права защищены.</span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span>Государственная информационная система «Kotiynet Services»</span>
          </div>

          {/* Discreet Technical Compliance Indications */}
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5" title="Защищенная авторизация">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Единая авторизация ЕСИА</span>
            </span>
            <span className="text-slate-300">·</span>
            <span className="flex items-center gap-1.5" title="Безопасная сессия">
              <Cookie className="w-3.5 h-3.5 text-slate-400" />
              <span>Session by cookies</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
