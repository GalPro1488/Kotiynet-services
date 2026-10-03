/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Header,
} from './components/Header.tsx';
import {
  KivoWidget,
} from './components/KivoWidget.tsx';
import {
  QuickServices,
  ServiceItem,
  STATE_SERVICES,
} from './components/QuickServices.tsx';
import {
  NationalBankCard,
} from './components/NationalBankCard.tsx';
import {
  GeopoliticalSection,
  GeopoliticalItem,
  GEOPOLITICAL_DATA,
} from './components/GeopoliticalSection.tsx';
import {
  GovernmentFooter,
} from './components/GovernmentFooter.tsx';
import {
  ServiceModal,
} from './components/ServiceModal.tsx';
import {
  BankModal,
} from './components/BankModal.tsx';
import {
  GeopoliticalModal,
} from './components/GeopoliticalModal.tsx';
import {
  ProfileModal,
} from './components/ProfileModal.tsx';
import {
  DesignPreviewModal,
} from './components/DesignPreviewModal.tsx';
import {
  AuthGate,
} from './components/AuthGate.tsx';
import {
  CitizenMessenger,
} from './components/CitizenMessenger.tsx';
import {
  KotiynetEmblem,
  KotiynetFlag,
} from './components/FlagsAndEmblems.tsx';
import {
  Image as ImageIcon,
  CheckCircle2,
  Search,
  Briefcase,
  Users,
  Shield,
  Building,
  GraduationCap,
  ArrowRight,
  ExternalLink,
  Database,
  CloudUpload,
  Check,
  Loader2,
  LogOut,
} from 'lucide-react';
import {
  db,
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  saveSession,
  getSavedSessionId,
  getCachedUser,
  clearSession,
  CitizenUser,
  handleFirestoreError,
  OperationType,
} from './firebase.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  
  // Authenticated citizen state (instantly restored from cache so user never has to re-login)
  const [currentUser, setCurrentUser] = useState<CitizenUser | null>(() => getCachedUser());
  const [isInitializing, setIsInitializing] = useState<boolean>(() => {
    // Only show loading if there is a session ID in storage but no cached user object yet
    const cached = getCachedUser();
    const sessionId = getSavedSessionId();
    return !cached && !!sessionId;
  });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Modals state
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedGeopolitical, setSelectedGeopolitical] = useState<GeopoliticalItem | null>(null);
  const [bankModalOpen, setBankModalOpen] = useState(false);
  const [bankModalMode, setBankModalMode] = useState<'details' | 'transfer'>('details');
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [designModalOpen, setDesignModalOpen] = useState(false);

  // Search filter inside Services tab
  const [serviceSearch, setServiceSearch] = useState('');

  // 1. Session check and real-time synchronization on initial render
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const checkSession = async () => {
      try {
        const sessionUid = getSavedSessionId();
        if (sessionUid) {
          const userRef = doc(db, 'users', sessionUid);
          const snap = await getDoc(userRef);

          if (snap.exists()) {
            const data = snap.data() as CitizenUser;
            setCurrentUser(data);
            saveSession(data);

            // 2. Attach real-time snapshot listener
            unsubscribe = onSnapshot(
              userRef,
              (docSnap) => {
                if (docSnap.exists()) {
                  const updatedData = docSnap.data() as CitizenUser;
                  setCurrentUser(updatedData);
                  saveSession(updatedData);
                }
              },
              (err) => {
                handleFirestoreError(err, OperationType.GET, `users/${sessionUid}`);
              }
            );
          } else {
            // Invalid session
            clearSession();
            setCurrentUser(null);
          }
        }
      } catch (err) {
        console.error('Session restore error:', err);
      } finally {
        setIsInitializing(false);
      }
    };

    checkSession();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Set up real-time listener when authenticated via AuthGate
  const handleAuthenticated = (user: CitizenUser) => {
    setCurrentUser(user);
    saveSession(user);

    const userRef = doc(db, 'users', user.uid);
    onSnapshot(
      userRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const updatedData = docSnap.data() as CitizenUser;
          setCurrentUser(updatedData);
          saveSession(updatedData);
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
      }
    );
  };

  // Dynamic write & update to Firebase Firestore
  const handleUpdateUser = async (updatedFields: Partial<CitizenUser>) => {
    if (!currentUser) return;
    setIsSyncing(true);

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        ...updatedFields,
        updatedAt: new Date().toISOString(),
      });
      // also update local cache
      const updatedUser: CitizenUser = {
        ...currentUser,
        ...updatedFields,
        updatedAt: new Date().toISOString(),
      };
      saveSession(updatedUser);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateBalance = async (newBalance: number) => {
    await handleUpdateUser({ balance: newBalance });
  };

  // Logout handler
  const handleLogout = () => {
    clearSession();
    setCurrentUser(null);
    setProfileModalOpen(false);
    setBankModalOpen(false);
  };

  // Initial loading state
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <KotiynetEmblem className="w-12 h-12 animate-pulse" />
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
            <span>Подключение к государственной системе...</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Государственная информационная система КФ
          </span>
        </div>
      </div>
    );
  }

  // Auth Gate: If no active session, show clean white-mode login / registration screen
  if (!currentUser) {
    return <AuthGate onAuthenticated={handleAuthenticated} />;
  }

  const currentBalance = currentUser.balance ?? 150000;

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      
      {/* 1. Header Branding & Navigation */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        balance={currentBalance}
        onOpenWallet={() => {
          setBankModalMode('details');
          setBankModalOpen(true);
        }}
        onOpenProfile={() => setProfileModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Container: Desktop presence 1440px max baseline */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        
        {/* Tab 1: HOME (Главная) */}
        {activeTab === 'home' && (
          <div className="space-y-8">
            
            {/* 4. Central Content: Kivo AI Assistant Widget */}
            <section aria-label="Интеллектуальный помощник Kivo AI">
              <KivoWidget />
            </section>

            {/* Quick Services Grid + National Bank Card Row */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Quick Services Grid (7 cols) */}
              <div className="lg:col-span-7">
                <QuickServices onSelectService={(srv) => setSelectedService(srv)} />
              </div>

              {/* National Bank Card Preview (5 cols) */}
              <div className="lg:col-span-5">
                <NationalBankCard
                  balance={currentBalance}
                  onOpenBankDetails={() => {
                    setBankModalMode('details');
                    setBankModalOpen(true);
                  }}
                  onOpenTransfer={() => {
                    setBankModalMode('transfer');
                    setBankModalOpen(true);
                  }}
                />
              </div>
            </section>

            {/* 5. Geopolitical & History Section */}
            <section aria-label="Геополитический и исторический реестр">
              <GeopoliticalSection
                onSelectGeopolitical={(item) => setSelectedGeopolitical(item)}
              />
            </section>

          </div>
        )}

        {/* Tab 2: SERVICES (Услуги) */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-5">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Каталог государственных услуг Котинетинской Федерации
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Все виды электронных обращений, выдача справок, лицензий и документов гражданина
              </p>

              <div className="mt-4 max-w-md relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={serviceSearch}
                  onChange={(e) => setServiceSearch(e.target.value)}
                  placeholder="Поиск по услугам, ведомствам и жизненным ситуациям..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            <QuickServices onSelectService={(srv) => setSelectedService(srv)} />

            {/* Additional state service categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50">
                <h3 className="font-semibold text-sm text-slate-900 mb-1">
                  Социальная защита и семья
                </h3>
                <p className="text-xs text-slate-500 mb-3">
                  Единовременные пособия, жилищные сертификаты, выплаты многодетным гражданам КФ.
                </p>
                <button
                  onClick={() => setSelectedService(STATE_SERVICES[0])}
                  className="text-xs text-sky-700 font-medium hover:underline inline-flex items-center gap-1"
                >
                  Оформить выплату <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50">
                <h3 className="font-semibold text-sm text-slate-900 mb-1">
                  Образование и наука
                </h3>
                <p className="text-xs text-slate-500 mb-3">
                  Зачисление в университеты КФ, стипендии Президента, подтверждение ученых степеней.
                </p>
                <button
                  onClick={() => setSelectedService(STATE_SERVICES[3])}
                  className="text-xs text-sky-700 font-medium hover:underline inline-flex items-center gap-1"
                >
                  Подать заявление <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50">
                <h3 className="font-semibold text-sm text-slate-900 mb-1">
                  Транспорт и регистрация
                </h3>
                <p className="text-xs text-slate-500 mb-3">
                  Постановка на учет транспортных средств, экзамены в Госавтоинспекции КФ.
                </p>
                <button
                  onClick={() => setSelectedService(STATE_SERVICES[0])}
                  className="text-xs text-sky-700 font-medium hover:underline inline-flex items-center gap-1"
                >
                  Записаться в ГАИ <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: BANK (Банк) */}
        {activeTab === 'bank' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-5">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Национальный Банк Котинетинской Федерации
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Государственное расчетное обслуживание, эмиссия котинетинского доллара (K$) и целевые фонды
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-6">
                <NationalBankCard
                  balance={currentBalance}
                  onOpenBankDetails={() => {
                    setBankModalMode('details');
                    setBankModalOpen(true);
                  }}
                  onOpenTransfer={() => {
                    setBankModalMode('transfer');
                    setBankModalOpen(true);
                  }}
                />
              </div>

              <div className="lg:col-span-6 space-y-4">
                <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
                  <h3 className="text-base font-semibold text-slate-900 mb-2">
                    Фонд национальных репараций Мопсии
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Общий объем репарационных обязательств: <strong className="text-slate-900">100 триллионов K$</strong>. 
                    Средства инвестируются в суверенную цифровую инфраструктуру, медицинские кластеры и прямые начисления на карты граждан Котинета.
                  </p>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Очередной транш: 15 октября 2026 г.</span>
                    <button
                      onClick={() => {
                        setBankModalMode('details');
                        setBankModalOpen(true);
                      }}
                      className="text-xs text-sky-700 font-semibold hover:underline"
                    >
                      Получить дивиденд
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 text-xs space-y-2 text-slate-700">
                  <div className="font-semibold text-slate-900">Официальные курсы валют НБКФ:</div>
                  <div className="flex justify-between font-mono">
                    <span>1 K$ (Котинетинский доллар)</span>
                    <span className="font-semibold text-slate-900">1.00 USD (Паритет)</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span>1 K$ / EUR</span>
                    <span className="font-semibold text-slate-900">0.92 EUR</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span>1 K$ / RUB</span>
                    <span className="font-semibold text-slate-900">92.40 RUB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: CAREER (Карьера) */}
        {activeTab === 'career' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-5">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Государственная служба и карьера в КФ
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Федеральная биржа вакансий в аппарате министерств, дипломатических представительствах и IT-институтах
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-sky-700">Министерство ПО и IT</span>
                    <span className="text-xs text-slate-400 font-mono">ID: IT-884</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Главный разработчик архитектуры «Kotiynet Services»</h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Проектирование и масштабирование распределенных государственных реестров, интеграция биометрии и аутентификации.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-mono font-semibold text-slate-900">Оклад: 450 000 K$ / мес</span>
                  <button
                    onClick={() => setSelectedService(STATE_SERVICES[3])}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium"
                  >
                    Откликнуться
                  </button>
                </div>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-sky-700">Министерство иностранных дел</span>
                    <span className="text-xs text-slate-400 font-mono">ID: MID-120</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Советник по мандатным территориям (Миссия в Украине)</h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Координация гуманитарного сотрудничества, правового регулирования и взаимодействия с местными муниципалитетами.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-mono font-semibold text-slate-900">Оклад: 520 000 K$ / мес</span>
                  <button
                    onClick={() => setSelectedService(STATE_SERVICES[3])}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium"
                  >
                    Откликнуться
                  </button>
                </div>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-sky-700">Министерство обороны</span>
                    <span className="text-xs text-slate-400 font-mono">ID: DEF-401</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Инспектор контроля демилитаризации Мопсии</h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Проведение регулярных полевых и документальных инспекций разоружения по Акту о безоговорочной капитуляции.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-mono font-semibold text-slate-900">Оклад: 480 000 K$ / мес</span>
                  <button
                    onClick={() => setSelectedService(STATE_SERVICES[3])}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium"
                  >
                    Откликнуться
                  </button>
                </div>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-sky-700">Национальный Банк КФ</span>
                    <span className="text-xs text-slate-400 font-mono">ID: NB-009</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Аудитор фонда суверенных резервов</h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Контроль за целевым распределением средств из 100-триллионного фонда репараций и золотого запаса.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-mono font-semibold text-slate-900">Оклад: 500 000 K$ / мес</span>
                  <button
                    onClick={() => setSelectedService(STATE_SERVICES[3])}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium"
                  >
                    Откликнуться
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: MESSENGER (Мессенджер) */}
        {activeTab === 'messenger' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Государственный мессенджер граждан КФ
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Защищенный обмен сообщениями между зарегистрированными гражданами Котинетинской Федерации. Для начала диалога найдите собеседника по его номеру телефона.
              </p>
            </div>

            <CitizenMessenger currentUser={currentUser} />
          </div>
        )}

        {/* Tab 6: GOVERNMENT (Правительство) */}
        {activeTab === 'government' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-5">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Руководство и Кабинет Министров Котинетинской Федерации
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Официальный реестр членов правительства, структура органов исполнительной власти и государственные декреты
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* President */}
              <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center">
                    <KotiynetEmblem className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-sky-700 uppercase tracking-wider">Глава Государства</span>
                    <h2 className="text-lg font-bold text-slate-900">Президент Котинетинской Федерации</h2>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Верховный Главнокомандующий Вооруженными силами Котинетинской Федерации, гарант Конституции, суверенитета и территориальной целостности государства.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Статус: Действующий мандат</span>
                  <span className="text-sky-700 font-medium">Канцелярия Президента</span>
                </div>
              </div>

              {/* Minister of Education and Foreign Affairs */}
              <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-slate-700" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-sky-700 uppercase tracking-wider">Внешняя политика и наука</span>
                    <h2 className="text-lg font-bold text-slate-900">Министр образования и иностранных дел</h2>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Руководитель дипломатического ведомства, курирует международное признание суверенитета, управление мандатными территориями и образовательные стандарты КФ.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Статус: Дипломатический корпус</span>
                  <span className="text-sky-700 font-medium">МИД и Минобрнауки КФ</span>
                </div>
              </div>

              {/* Minister of Defense */}
              <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-slate-700" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-sky-700 uppercase tracking-wider">Оборона и безопасность</span>
                    <h2 className="text-lg font-bold text-slate-900">Министр обороны</h2>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Обеспечение военной безопасности, стратегического сдерживания, исполнение условий капитуляции Мопсии и охрана государственных границ Федерации.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Статус: Генеральный штаб</span>
                  <span className="text-sky-700 font-medium">Минобороны КФ</span>
                </div>
              </div>

              {/* Minister of Software and IT */}
              <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center">
                    <Building className="w-6 h-6 text-sky-600" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-sky-700 uppercase tracking-wider">Цифровое развитие</span>
                    <h2 className="text-lg font-bold text-slate-900">Министр ПО и IT</h2>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Развитие государственных информационных систем «Kotiynet Services», внедрение ассистента Kivo AI, кибербезопасность и поддержка технологического сектора.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Статус: Государственная IT-платформа</span>
                  <span className="text-sky-700 font-medium">Минцифры КФ</span>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* 6. Footer */}
      <GovernmentFooter />

      {/* Modals */}
      <ServiceModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
      />

      <BankModal
        isOpen={bankModalOpen}
        onClose={() => setBankModalOpen(false)}
        balance={currentBalance}
        onUpdateBalance={handleUpdateBalance}
        mode={bankModalMode}
      />

      <GeopoliticalModal
        item={selectedGeopolitical}
        onClose={() => setSelectedGeopolitical(null)}
      />

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={currentUser}
        onUpdateUser={handleUpdateUser}
        onLogout={handleLogout}
      />

      <DesignPreviewModal
        isOpen={designModalOpen}
        onClose={() => setDesignModalOpen(false)}
      />

    </div>
  );
}
