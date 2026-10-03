import React, { useState } from 'react';
import { ArrowRight, Sparkles, X, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { KivoKnotIcon } from './FlagsAndEmblems.tsx';

interface KivoWidgetProps {
  onOpenConsultation?: (topic?: string) => void;
}

export function KivoWidget({ onOpenConsultation }: KivoWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'kivo'; text: string; time: string }>>([
    {
      sender: 'kivo',
      text: 'Здравствуйте! Я Kivo AI — цифровой ассистент государственных служб Котинетинской Федерации. Чем я могу помочь вам сегодня?',
      time: '12:00',
    },
  ]);

  const quickQuestions = [
    'Как написать гражданину по номеру телефона?',
    'Как оформить паспорт гражданина КФ?',
    'Статус выплат из Репарационного фонда Мопсии',
    'Запись к терапевту в Столичную поликлинику',
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || query;
    if (!text.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery('');

    // State response logic
    setTimeout(() => {
      let reply = 'Ваш запрос обработан государственной информационной системой КФ.';
      const lower = text.toLowerCase();

      if (lower.includes('написать') || lower.includes('мессенджер') || lower.includes('сообщени')) {
        reply = 'Для отправки сообщений перейдите в раздел «Мессенджер» в верхнем меню. Введите в строке поиска номер телефона зарегистрированного гражданина и нажмите «Найти» → «Написать». Диалог синхронизируется в реальном времени.';
      } else if (lower.includes('паспорт') || lower.includes('документ')) {
        reply = 'Для оформления или замены паспорта гражданина Котинетинской Федерации воспользуйтесь разделом «Мои документы». Срок изготовления биометрического паспорта — 3 рабочих дня. Госпошлина: 500 K$.';
      } else if (lower.includes('репарац') || lower.includes('мопси')) {
        reply = 'В соответствии с Соглашением о капитуляции Мопсии, сумма репараций составляет 100 триллионов K$. Выплаты гражданам производятся автоматически через Национальный Банк КФ равными долями в целевые фонды развития и социальные счета.';
      } else if (lower.includes('врач') || lower.includes('поликлиник')) {
        reply = 'Электронная запись к врачам Единой медицинской системы КФ доступна в плитке «Запись к врачу». Ближайшие талоны к специалистам Столичного и Центрального округов открыты на текущую неделю.';
      } else if (lower.includes('налог') || lower.includes('бизнес') || lower.includes('it')) {
        reply = 'Для аккредитованных IT-компаний и специалистов решением Министерства ПО и IT действует нулевая ставка на прибыль и льготный НДФЛ 3%. Подача декларации осуществляется в один клик через раздел «Налоги и бизнес».';
      } else if (lower.includes('суверенитет') || lower.includes('росси') || lower.includes('украин')) {
        reply = 'Суверенитет Котинетинской Федерации признан Российской Федерацией безусловно согласно Декларации от 2025 года. На территории Украины действует специальный мандат гражданско-административного управления КФ.';
      } else {
        reply = `По вашему запросу «${text}» сформирована электронная справка в государственном реестре КФ. Вы можете подать официальное обращение в профильное министерство или воспользоваться быстрым сервисом на портале.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'kivo',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 450);
  };

  return (
    <div className="w-full">
      {/* Sleek, Discreet Integrated Widget */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-sky-300 transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Left: Knot Logo & Label */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0">
              <KivoKnotIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-slate-900 tracking-tight">
                  Kivo AI - Ваш ИИ-помощник
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-sky-700 bg-sky-50 rounded">
                  Госпортал 2.4
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Круглосуточные государственные консультации, поиск льгот и оформление заявлений
              </p>
            </div>
          </div>

          {/* Right: Quick Action Input & Button */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors shadow-xs"
            >
              <MessageSquare className="w-4 h-4 text-sky-300" />
              <span>{isOpen ? 'Свернуть диалог' : 'Задать вопрос Kivo AI'}</span>
            </button>
          </div>
        </div>

        {/* Quick query tags row */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs text-slate-600">
          <span className="text-[11px] text-slate-400 shrink-0 font-medium">Частые запросы:</span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setIsOpen(true);
                handleSend(q);
              }}
              className="shrink-0 px-2.5 py-1 bg-slate-50 hover:bg-sky-50 hover:text-sky-800 border border-slate-200/70 rounded-md text-[11px] transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Expandable Chat Drawer */}
        {isOpen && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-lg p-3 sm:p-4">
              <div className="max-h-64 overflow-y-auto space-y-3 pr-1 text-xs sm:text-sm">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-3.5 py-2.5 leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-slate-900 text-white'
                          : 'bg-white text-slate-800 border border-slate-200/80 shadow-xs'
                      }`}
                    >
                      {m.sender === 'kivo' && (
                        <div className="flex items-center gap-1.5 text-[10px] text-sky-700 font-semibold mb-1">
                          <KivoKnotIcon className="w-3.5 h-3.5" />
                          <span>Kivo AI • Государственный ассистент КФ</span>
                        </div>
                      )}
                      <p>{m.text}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 px-1">{m.time}</span>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSend();
                  }}
                  placeholder="Введите вопрос (например: оформление субсидии или статус мандата)..."
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!query.trim()}
                  className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center justify-center shrink-0"
                  title="Отправить запрос"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
