import React, { useState } from 'react';
import {
  KotiynetEmblem,
  KotiynetFlag,
} from './FlagsAndEmblems.tsx';
import {
  Lock,
  Phone,
  User,
  Calendar,
  KeyRound,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Cookie,
} from 'lucide-react';
import {
  db,
  doc,
  getDoc,
  setDoc,
  saveSession,
  CitizenUser,
  handleFirestoreError,
  OperationType,
} from '../firebase.ts';

interface AuthGateProps {
  onAuthenticated: (user: CitizenUser) => void;
}

export function AuthGate({ onAuthenticated }: AuthGateProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login fields
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register fields
  const [regPhone, setRegPhone] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regBirthDate, setRegBirthDate] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  const normalizePhoneId = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    return digits ? `user_${digits}` : `user_${Date.now()}`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessNotice('');

    if (!loginPhone.trim()) {
      setErrorMsg('Пожалуйста, укажите номер телефона или номер гражданина.');
      return;
    }
    if (!loginPassword.trim()) {
      setErrorMsg('Пожалуйста, введите пароль доступа.');
      return;
    }

    setIsLoading(true);
    const userId = normalizePhoneId(loginPhone);

    try {
      const userRef = doc(db, 'users', userId);
      const snapshot = await getDoc(userRef);

      if (!snapshot.exists()) {
        setErrorMsg('Учетная запись не найдена в едином реестре граждан КФ. Проверьте правильность номера или перейдите на вкладку «Регистрация».');
        setIsLoading(false);
        return;
      }

      const userData = snapshot.data() as CitizenUser;

      // Check password
      if (userData.passwordHash && userData.passwordHash !== loginPassword) {
        setErrorMsg('Неверный пароль доступа. Повторите попытку.');
        setIsLoading(false);
        return;
      }

      // Save persistent session in LocalStorage and cookies
      saveSession(userData);
      setSuccessNotice('Авторизация подтверждена. Вход в личный кабинет...');

      setTimeout(() => {
        onAuthenticated(userData);
      }, 300);

    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `users/${userId}`);
      setErrorMsg('Ошибка связи с государственной базой данных. Пожалуйста, повторите попытку.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessNotice('');

    if (!regPhone.trim()) {
      setErrorMsg('Укажите контактный номер телефона.');
      return;
    }
    if (!regFullName.trim()) {
      setErrorMsg('Укажите ФИО гражданина Котинетинской Федерации.');
      return;
    }
    if (!regBirthDate.trim()) {
      setErrorMsg('Укажите дату рождения (например: 12.04.1995).');
      return;
    }
    if (!regPassword.trim() || regPassword.length < 4) {
      setErrorMsg('Пароль должен содержать минимум 4 символа.');
      return;
    }

    setIsLoading(true);
    const userId = normalizePhoneId(regPhone);

    try {
      // Check if user already exists
      const userRef = doc(db, 'users', userId);
      const existingSnap = await getDoc(userRef);

      if (existingSnap.exists()) {
        setErrorMsg('Гражданин с таким номером уже зарегистрирован в едином реестре. Пожалуйста, выполните вход.');
        setIsLoading(false);
        return;
      }

      // Create new citizen profile
      const newCitizen: CitizenUser = {
        uid: userId,
        phone: regPhone.trim(),
        fullName: regFullName.trim(),
        birthDate: regBirthDate.trim(),
        citizenId: `KF-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        balance: 150000,
        salary: 450000,
        debt: 0,
        passwordHash: regPassword,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(userRef, newCitizen);

      // Save persistent session in LocalStorage and cookies
      saveSession(newCitizen);
      setSuccessNotice('Учетная запись успешно создана в едином реестре! Вход в систему...');

      setTimeout(() => {
        onAuthenticated(newCitizen);
      }, 400);

    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${userId}`);
      setErrorMsg('Не удалось сохранить данные гражданина. Пожалуйста, повторите попытку.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = () => {
    setLoginPhone('+7 (999) 150-00-00');
    setLoginPassword('citizen2026');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-3">
          <KotiynetEmblem className="w-12 h-12" />
          <KotiynetFlag className="w-8 h-5.5" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          КОТИНЕТИНСКАЯ ФЕДЕРАЦИЯ
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Единая система аутентификации «Kotiynet Services»
        </p>
      </div>

      {/* Main Auth Card (Pure White light-mode style) */}
      <div className="w-full sm:max-w-md bg-white border border-slate-200/90 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
        
        {/* Tab Headers */}
        <div className="grid grid-cols-2 border-b border-slate-200 text-xs font-semibold text-center bg-slate-50/60">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); setSuccessNotice(''); }}
            className={`py-3.5 transition-colors border-b-2 ${
              mode === 'login'
                ? 'border-sky-600 text-sky-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Вход в систему
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(''); setSuccessNotice(''); }}
            className={`py-3.5 transition-colors border-b-2 ${
              mode === 'register'
                ? 'border-sky-600 text-sky-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Регистрация гражданина
          </button>
        </div>

        <div className="p-6 sm:p-8">
          
          {/* Status Notices */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successNotice && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successNotice}</span>
            </div>
          )}

          {mode === 'login' ? (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Телефон или ИИН гражданина КФ
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    placeholder="+7 (___) ___-__-__"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Пароль доступа
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1.5 text-[11px]">
                  <Cookie className="w-3.5 h-3.5 text-sky-600" />
                  <span>Сессия сохраняется в Cookie</span>
                </span>
                <button
                  type="button"
                  onClick={handleDemoFill}
                  className="text-[11px] text-sky-700 hover:underline font-medium"
                >
                  Заполнить демо
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
                    <span>Проверка учетных данных...</span>
                  </>
                ) : (
                  <>
                    <span>Войти на госпортал</span>
                    <ArrowRight className="w-4 h-4 text-sky-300" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Номер телефона
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+7 (999) 000-00-00"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Фамилия, Имя, Отчество (ФИО)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="Александров Алексей Михайлович"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Дата рождения
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={regBirthDate}
                    onChange={(e) => setRegBirthDate(e.target.value)}
                    placeholder="ДД.ММ.ГГГГ (например: 15.08.1994)"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Придумайте пароль доступа
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Минимум 4 символа"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-sky-50/70 border border-sky-100 rounded-lg text-[11px] text-sky-800 flex items-start gap-1.5">
                <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span>
                  При регистрации открывается государственный счет в Национальном Банке КФ с приветственным балансом <strong>150 000 K$</strong>.
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Регистрация в едином реестре...</span>
                  </>
                ) : (
                  <>
                    <span>Зарегистрироваться в ЕСИА КФ</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

        </div>

        {/* Technical Authority Strip */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-slate-400" />
            <span>Государственный реестр ЕСИА</span>
          </span>
          <span className="flex items-center gap-1">
            <Cookie className="w-3 h-3 text-slate-400" />
            <span>Session by cookies</span>
          </span>
        </div>

      </div>

    </div>
  );
}
