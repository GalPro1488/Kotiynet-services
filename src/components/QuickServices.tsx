import React from 'react';
import {
  FileText,
  Stethoscope,
  Briefcase,
  Building2,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export interface ServiceItem {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: 'docs' | 'health' | 'tax' | 'career';
  badge: string;
  details: {
    items: string[];
    actionLabel: string;
    notice?: string;
  };
}

interface QuickServicesProps {
  onSelectService: (service: ServiceItem) => void;
}

export const STATE_SERVICES: ServiceItem[] = [
  {
    id: 'documents',
    title: 'Мои документы',
    category: 'Паспортный и гражданский реестр',
    description: 'Цифровой паспорт гражданина КФ, СНИЛС, военный билет и водительское удостоверение.',
    icon: 'docs',
    badge: '4 документа активны',
    details: {
      items: [
        'Биометрический паспорт гражданина Котинетинской Федерации (Серия КФ № 991824)',
        'Государственный регистрационный номер налогоплательщика (ИНН КФ)',
        'Единый полис обязательного медицинского страхования КФ',
        'Цифровое водительское удостоверение категории B (действительно до 2034 г.)',
      ],
      actionLabel: 'Заказать выписку из реестра',
      notice: 'Все документы заверены усиленной квалифицированной электронной подписью Федерального регистратора.',
    },
  },
  {
    id: 'health',
    title: 'Запись к врачу',
    category: 'Единая система здравоохранения КФ',
    description: 'Электронная запись к терапевтам и узким специалистам, архив рецептов и анализов.',
    icon: 'health',
    badge: 'Ближайшая запись: Завтра 10:30',
    details: {
      items: [
        'Терапевтическое отделение № 1 (Столичный медицинский центр КФ)',
        'Электронная карта пациента #MC-8810-KF синхронизирована',
        'Выданные электронные рецепты на медикаменты (льгота 100%)',
        'Заказ талона на плановый медосмотр и диспансеризацию',
      ],
      actionLabel: 'Выбрать врача и время приема',
      notice: 'Медицинское обслуживание граждан Котинетинской Федерации осуществляется на безвозмездной основе.',
    },
  },
  {
    id: 'tax',
    title: 'Налоги и бизнес',
    category: 'Федеральная фискальная служба',
    description: 'Единый налоговый счет, самозанятость, регистрация юрлиц и льготные ставки для IT.',
    icon: 'tax',
    badge: 'Задолженностей нет • 0 K$',
    details: {
      items: [
        'Единый налоговый счет (ЕНС): Сальдо положительное (+1 450 K$)',
        'Специальный правовой режим для IT-компаний: Ставка налога на прибыль 0%, НДФЛ 3%',
        'Декларация доходов физлиц за предыдущий отчетный период принята без замечаний',
        'Реестр аккредитованных технологических предприятий Котинета',
      ],
      actionLabel: 'Перейти в кабинет налогоплательщика',
      notice: 'Суверенные доходы бюджета КФ субсидируются Репарационным фондом Мопсии.',
    },
  },
  {
    id: 'career',
    title: 'Трудоустройство',
    category: 'Государственная кадровая платформа',
    description: 'Единая биржа труда, вакансии в министерствах, дипломатической службе и IT-секторе КФ.',
    icon: 'career',
    badge: '1 420 вакансий в госсекторе',
    details: {
      items: [
        'Министерство программного обеспечения и IT — Ведущий архитектор распределенных систем',
        'Министерство иностранных дел КФ — Атташе по взаимодействию с мандатными территориями',
        'Национальный Банк Котинетинской Федерации — Старший аналитик валютных резервов',
        'Федеральная служба кибербезопасности — Специалист криптографической защиты',
      ],
      actionLabel: 'Подать резюме в кадровый резерв',
      notice: 'Служба в государственных органах Котинетинской Федерации гарантирует расширенный социальный пакет.',
    },
  },
];

export function QuickServices({ onSelectService }: QuickServicesProps) {
  const getIcon = (type: ServiceItem['icon']) => {
    switch (type) {
      case 'docs':
        return <FileText className="w-5 h-5 text-sky-600" />;
      case 'health':
        return <Stethoscope className="w-5 h-5 text-sky-600" />;
      case 'tax':
        return <Building2 className="w-5 h-5 text-sky-600" />;
      case 'career':
        return <Briefcase className="w-5 h-5 text-sky-600" />;
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Популярные государственные услуги
          </h2>
          <p className="text-xs text-slate-500">
            Быстрый доступ к ключевым реестрам и заявлениям граждан
          </p>
        </div>
      </div>

      {/* 2x2 Minimalist Grid with Clean Light-Blue Icons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {STATE_SERVICES.map((srv) => (
          <button
            key={srv.id}
            onClick={() => onSelectService(srv)}
            className="group text-left bg-white border border-slate-200/90 hover:border-sky-300 rounded-xl p-4 sm:p-5 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-xs flex flex-col justify-between"
          >
            <div>
              {/* Header with clean light-blue icon tile */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0 group-hover:bg-sky-100/70 transition-colors">
                  {getIcon(srv.icon)}
                </div>
                <span className="text-[11px] font-medium text-slate-500 group-hover:text-sky-700 transition-colors flex items-center gap-1">
                  Подробнее
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>

              <h3 className="text-base font-semibold text-slate-900 group-hover:text-sky-950 transition-colors">
                {srv.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {srv.description}
              </p>
            </div>

            {/* Unboxed Metadata with subtle separator */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium text-[11px]">
                {srv.badge}
              </span>
              <span className="text-[11px] text-slate-400">
                Госсистема КФ
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
