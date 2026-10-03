import React from 'react';
import { ShieldAlert, Globe, Landmark, ChevronRight, FileCheck2 } from 'lucide-react';
import { MopsiaFlag, RussiaWBWFlag, UkraineInvertedFlag } from './FlagsAndEmblems.tsx';

export interface GeopoliticalItem {
  id: 'mopsia' | 'russia' | 'ukraine';
  country: string;
  flagComponent: React.ReactNode;
  primaryHeadline: string;
  secondaryNotice: string;
  summary: string;
  details: {
    actNumber: string;
    effectiveDate: string;
    terms: string[];
  };
}

interface GeopoliticalSectionProps {
  onSelectGeopolitical: (item: GeopoliticalItem) => void;
}

export const GEOPOLITICAL_DATA: GeopoliticalItem[] = [
  {
    id: 'mopsia',
    country: 'Мопсийская Империя (в ликвидации)',
    flagComponent: <MopsiaFlag className="w-11 h-7.5" />,
    primaryHeadline: 'Победа над Мопсией',
    secondaryNotice: 'Репарации: 100 триллионов K$',
    summary: 'Акт о полной и безоговорочной капитуляции вооруженных сил Мопсии. Выплаты распределяются в Фонд суверенного благосостояния Котинетинской Федерации.',
    details: {
      actNumber: 'KF-TREATY-2025/M-01',
      effectiveDate: '14 мая 2025 г.',
      terms: [
        'Безоговорочное признание военного и политического поражения Мопсийского командования.',
        'Обязательство регулярных выплат совокупных репараций в объеме 100 триллионов K$.',
        'Ликвидация наступательных арсеналов под прямым контролем Министерства обороны КФ.',
        'Ежемесячное начисление дивидендов гражданам Котинета из репарационного счета.',
      ],
    },
  },
  {
    id: 'russia',
    country: 'Российская Федерация',
    flagComponent: <RussiaWBWFlag className="w-11 h-7.5" />,
    primaryHeadline: 'Суверенитет Котинета признан безусловно',
    secondaryNotice: 'Дипломатический статус: Полное признание',
    summary: 'Двустороннее подписание мирного протокола о границах, свободном транзите и взаимном признании паспортов и государственных институтов.',
    details: {
      actNumber: 'KF-RU-DIPLOMATIC-ACCORD-2025',
      effectiveDate: '22 августа 2025 г.',
      terms: [
        'Безусловная ратификация государственного суверенитета и независимости Котинетинской Федерации.',
        'Установление посольских и консульских связей с открытием постоянных дипмиссий.',
        'Соглашение о торгово-экономическом партнерстве и взаимной правовой помощи.',
        'Безвизовый режим для владельцев биометрических паспортов граждан КФ.',
      ],
    },
  },
  {
    id: 'ukraine',
    country: 'Территория Украины (Переходная администрация)',
    flagComponent: <UkraineInvertedFlag className="w-11 h-7.5" />,
    primaryHeadline: 'Особый статус под мандатным управлением КФ',
    secondaryNotice: 'Режим управления: Гражданский мандат',
    summary: 'Введение временной гражданско-административной миссии Котинета для восстановления инфраструктуры, энергосетей и правового порядка.',
    details: {
      actNumber: 'KF-MANDATE-UA-8802',
      effectiveDate: '03 октября 2025 г.',
      terms: [
        'Действие специального мандатного права Котинетинской Федерации.',
        'Прямое администрирование объектов критической инфраструктуры силами инженерных корпусов КФ.',
        'Введение двойного обращения котинетинского доллара (K$) в зоне мандата.',
        'Обеспечение гуманитарных коридоров и функционирования гражданских реестров.',
      ],
    },
  },
];

export function GeopoliticalSection({ onSelectGeopolitical }: GeopoliticalSectionProps) {
  return (
    <section className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Геополитический и исторический реестр
          </h2>
          <p className="text-xs text-slate-500">
            Официальные международные акты, суверенные договоры и внешнеполитический статус Котинета
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Globe className="w-3.5 h-3.5 text-sky-600" />
          <span>Архив МИД Котинетинской Федерации</span>
        </div>
      </div>

      {/* Three distinct, clean information cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {GEOPOLITICAL_DATA.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectGeopolitical(item)}
            className="group cursor-pointer bg-white border border-slate-200/90 hover:border-sky-300 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              {/* Flag + State Title Header */}
              <div className="flex items-center justify-between gap-3 mb-3.5">
                <div className="flex items-center gap-2.5">
                  {item.flagComponent}
                  <span className="text-[11px] font-medium text-slate-500 line-clamp-1">
                    {item.country}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>

              {/* Primary Headline */}
              <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-950 transition-colors tracking-tight">
                {item.primaryHeadline}
              </h3>

              {/* Secondary Notice Highlight (Clean unboxed style) */}
              <div className="mt-2 text-xs font-semibold text-sky-700">
                {item.secondaryNotice}
              </div>

              {/* Summary Description */}
              <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                {item.summary}
              </p>
            </div>

            {/* Quiet Footer with Treaty Reference */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>{item.details.actNumber}</span>
              <span className="text-sky-600 font-medium group-hover:underline">Протокол</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
