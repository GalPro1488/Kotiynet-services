import React from 'react';
import { X, Image as ImageIcon, ExternalLink, Download } from 'lucide-react';
import screenshotImg from '../assets/images/kotiynet_services_portal_1791022339642.jpg';

interface DesignPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DesignPreviewModal({ isOpen, onClose }: DesignPreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-5xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <ImageIcon className="w-5 h-5 text-sky-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Официальный дизайн-макет «Kotiynet Services» (Скриншот интерфейса)
              </h3>
              <span className="text-[11px] text-slate-500">
                16:9 Desktop View • Чистый белый фон • Премиальный государственный портал
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

        {/* Content Image */}
        <div className="p-4 sm:p-6 overflow-y-auto bg-slate-100 flex items-center justify-center">
          <div className="rounded-xl overflow-hidden shadow-lg border border-slate-300 max-w-full bg-white">
            <img
              src={screenshotImg}
              alt="Kotiynet Services UI Design Screenshot"
              className="w-full h-auto object-contain max-h-[70vh]"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-white border-t border-slate-100 flex items-center justify-between shrink-0 text-xs">
          <span className="text-slate-500">
            Финальный запуск в десктопном браузере без рамок и студийных панелей
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors font-medium"
          >
            Закрыть просмотр
          </button>
        </div>

      </div>
    </div>
  );
}
