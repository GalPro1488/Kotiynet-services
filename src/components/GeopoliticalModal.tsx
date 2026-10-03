import React from 'react';
import { X, FileText, CheckCircle, Shield, Calendar, Landmark } from 'lucide-react';
import { GeopoliticalItem } from './GeopoliticalSection.tsx';

interface GeopoliticalModalProps {
  item: GeopoliticalItem | null;
  onClose: () => void;
}

export function GeopoliticalModal({ item, onClose }: GeopoliticalModalProps) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {item.flagComponent}
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-700">
                Международно-правовой акт
              </span>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                {item.primaryHeadline}
              </h3>
            </div>
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
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Регистрационный номер</span>
              <span className="font-mono font-semibold text-slate-800">{item.details.actNumber}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Дата ратификации</span>
              <span className="font-semibold text-slate-800">{item.details.effectiveDate}</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1.5">
              Официальное коммюнике
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed bg-white border border-slate-100 p-3 rounded-lg shadow-xs">
              {item.summary}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2">
              Ключевые пункты суверенного соглашения:
            </h4>
            <ul className="space-y-2 text-xs text-slate-700">
              {item.details.terms.map((term, i) => (
                <li key={i} className="flex items-start gap-2 bg-slate-50/70 p-2.5 rounded-lg border border-slate-200/60">
                  <CheckCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <span>{term}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
            <Shield className="w-4 h-4 text-sky-600 shrink-0" />
            <span>Документ имеет высшую юридическую силу на всей территории Котинетинской Федерации.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">Архив МИД КФ</span>
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
