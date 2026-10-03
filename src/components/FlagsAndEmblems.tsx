import React, { useState } from 'react';

/**
 * Official branding assets with provided user URLs and zero-broken-image fallbacks.
 */

export const ASSET_URLS = {
  emblem: 'https://i.imgur.com/aEW6biR.png',
  kotiynetFlag: 'https://static.wikia.nocookie.net/kotinet/images/8/85/Kotiynet.png/revision/latest?cb=20230808054214&path-prefix=ru',
  kivoLogo: 'https://i.imgur.com/bAdW3Pz.png',
  mopsiaFlag: 'https://static.wikia.nocookie.net/dogopedyrussian/images/5/54/Ekst-4.jpg/revision/latest?cb=20181009130848&path-prefix=ru',
  russiaWBWFlag: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6f/White-blue-white_flag.svg/250px-White-blue-white_flag.svg.png',
  ukraineInvertedFlag: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a1/Flag_of_Ukraine_%281917%E2%80%931921%29.svg/960px-Flag_of_Ukraine_%281917%E2%80%931921%29.svg.png',
};

// 1. Kotiynet Services Shield Emblem (Герб "Котинет Услуги")
export function KotiynetEmblem({ className = "w-9 h-9" }: { className?: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M24 3L6 10V22C6 33.2 13.8 43.6 24 46C34.2 43.6 42 33.2 42 22V10L24 3Z"
          fill="#0284C7"
        />
        <path
          d="M24 5.5L8.5 11.5V21.5C8.5 31.5 15.3 40.8 24 43.2C32.7 40.8 39.5 31.5 39.5 21.5V11.5L24 5.5Z"
          fill="#0369A1"
        />
        <path
          d="M24 13L26.5 17.5L31.5 16.5L29 20.5L33 24.5H28.5L27 29H21L19.5 24.5H15L19 20.5L16.5 16.5L21.5 17.5L24 13Z"
          fill="#FFFFFF"
          opacity="0.95"
        />
        <circle cx="24" cy="20.5" r="2.2" fill="#38BDF8" />
        <path
          d="M17 33C21 34.5 27 34.5 31 33C29 36.5 25.5 38 24 38.5C22.5 38 19 36.5 17 33Z"
          fill="#E0F2FE"
        />
      </svg>
    );
  }

  return (
    <img
      src={ASSET_URLS.emblem}
      alt="Герб Котинет Услуги"
      className={`${className} object-contain`}
      referrerPolicy="no-referrer"
      onError={() => setError(true)}
    />
  );
}

// 2. Kotiynet Federation Flag (Государственный флаг Котинетинской Федерации)
export function KotiynetFlag({ className = "w-7 h-5" }: { className?: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <svg className={`${className} shadow-xs rounded-xs overflow-hidden border border-slate-200/80`} viewBox="0 0 36 24" fill="none">
        <rect width="36" height="24" fill="#0284C7" />
        <rect y="7" width="36" height="10" fill="#FFFFFF" />
        <rect y="11" width="36" height="2" fill="#0284C7" />
        <circle cx="18" cy="12" r="3.5" fill="#0369A1" />
        <circle cx="18" cy="12" r="2.8" fill="#FFFFFF" />
        <polygon points="18,10.2 18.6,11.5 20,11.5 18.9,12.3 19.3,13.6 18,12.8 16.7,13.6 17.1,12.3 16,11.5 17.4,11.5" fill="#0284C7" />
      </svg>
    );
  }

  return (
    <img
      src={ASSET_URLS.kotiynetFlag}
      alt="Флаг Котинетинской Федерации"
      className={`${className} object-cover rounded-xs border border-slate-200/80 shadow-xs`}
      referrerPolicy="no-referrer"
      onError={() => setError(true)}
    />
  );
}

// 3. Mopsia Flag (Флаг Мопсии)
export function MopsiaFlag({ className = "w-11 h-7.5" }: { className?: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <svg className={`${className} shadow-xs rounded-xs overflow-hidden border border-slate-300`} viewBox="0 0 40 26" fill="none">
        <rect width="40" height="26" fill="#2E2438" />
        <rect y="6" width="40" height="14" fill="#1F1827" />
        <g transform="translate(14, 7) scale(0.65)">
          <circle cx="9" cy="9" r="7.5" fill="#584968" stroke="#8E7C9E" strokeWidth="1" />
          <path d="M3 4C2 6 2 9 4 10C5 9 5 6 4 4" fill="#1F1827" />
          <path d="M15 4C16 6 16 9 14 10C13 9 13 6 14 4" fill="#1F1827" />
          <ellipse cx="9" cy="10.5" rx="3.5" ry="2.5" fill="#1F1827" />
          <circle cx="6.5" cy="7.5" r="1.2" fill="#D8D1E0" />
          <circle cx="11.5" cy="7.5" r="1.2" fill="#D8D1E0" />
        </g>
      </svg>
    );
  }

  return (
    <img
      src={ASSET_URLS.mopsiaFlag}
      alt="Флаг Мопсии"
      className={`${className} object-cover rounded-xs border border-slate-300 shadow-xs`}
      referrerPolicy="no-referrer"
      onError={() => setError(true)}
    />
  );
}

// 4. Russia White-Blue-White Flag (Бело-сине-белый флаг)
export function RussiaWBWFlag({ className = "w-11 h-7.5" }: { className?: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <svg className={`${className} shadow-xs rounded-xs overflow-hidden border border-slate-200/90`} viewBox="0 0 36 24" fill="none">
        <rect width="36" height="8" fill="#FFFFFF" />
        <rect y="8" width="36" height="8" fill="#0080FF" />
        <rect y="16" width="36" height="8" fill="#FFFFFF" />
      </svg>
    );
  }

  return (
    <img
      src={ASSET_URLS.russiaWBWFlag}
      alt="Бело-сине-белый флаг"
      className={`${className} object-cover rounded-xs border border-slate-200/90 shadow-xs`}
      referrerPolicy="no-referrer"
      onError={() => setError(true)}
    />
  );
}

// 5. Ukraine Inverted Yellow-Blue Flag (Перевернутый желто-синий флаг)
export function UkraineInvertedFlag({ className = "w-11 h-7.5" }: { className?: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <svg className={`${className} shadow-xs rounded-xs overflow-hidden border border-slate-200/90`} viewBox="0 0 36 24" fill="none">
        <rect width="36" height="12" fill="#FFD700" />
        <rect y="12" width="36" height="12" fill="#0057B7" />
      </svg>
    );
  }

  return (
    <img
      src={ASSET_URLS.ukraineInvertedFlag}
      alt="Перевернутый желто-синий флаг (1917–1921)"
      className={`${className} object-cover rounded-xs border border-slate-200/90 shadow-xs`}
      referrerPolicy="no-referrer"
      onError={() => setError(true)}
    />
  );
}

// 6. Kivo AI Security Logo (С логотипом безопасности по ссылке https://i.imgur.com/bAdW3Pz.png)
export function KivoKnotIcon({ className = "w-6 h-6" }: { className?: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M8 4C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12H16C18.2091 12 20 13.7909 20 16C20 18.2091 18.2091 20 16 20C13.7909 20 12 18.2091 12 16V8C12 5.79086 10.2091 4 8 4Z"
          stroke="#0284C7"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="8" cy="8" r="1.5" fill="#38BDF8" />
        <circle cx="16" cy="16" r="1.5" fill="#38BDF8" />
      </svg>
    );
  }

  return (
    <img
      src={ASSET_URLS.kivoLogo}
      alt="Kivo AI Security Logo"
      className={`${className} object-contain`}
      referrerPolicy="no-referrer"
      onError={() => setError(true)}
    />
  );
}
