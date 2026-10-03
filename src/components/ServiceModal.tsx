import React, { useState } from 'react';
import { X, CheckCircle, Clock, ShieldCheck, ArrowRight, FileText } from 'lucide-react';
import { ServiceItem } from './QuickServices.tsx';

interface ServiceModalProps {
  service: ServiceItem | null;
  onClose: () => void;
}

export function ServiceModal({ service, onClose }: ServiceModalProps) {
  const [submitted, setSubmitted] = useState(false);

  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-700">
              {service.category}
            </span>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              {service.title}
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
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            {service.description}
          </p>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2.5">
            <span className="text-xs font-semibold text-slate-900 block">
              Содержимое реестра и доступные опции:
            </span>
            <ul className="space-y-2 text-xs text-slate-700">
              {service.details.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {service.details.notice && (
            <div className="text-xs text-slate-500 bg-sky-50/60 border border-sky-100 rounded-lg p-3">
              <span className="font-semibold text-sky-900">Государственное уведомление: </span>
              {service.details.notice}
            </div>
          )}

          {submitted ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Заявка успешно зарегистрирована в ГИС «Kotiynet Services». Номер талона: #KF-{Math.floor(100000 + Math.random() * 900000)}.</span>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg transition-colors"
          >
            Закрыть
          </button>
          <button
            onClick={() => setSubmitted(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <span>{service.details.actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
