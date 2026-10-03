import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Send,
  MessageSquare,
  User,
  ShieldCheck,
  Phone,
  Clock,
  ArrowRight,
  CheckCheck,
  UserCheck,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';
import {
  db,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  CitizenUser,
  ChatItem,
  ChatMessage,
  handleFirestoreError,
  OperationType,
} from '../firebase.ts';

interface CitizenMessengerProps {
  currentUser: CitizenUser;
}

export function CitizenMessenger({ currentUser }: CitizenMessengerProps) {
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [activeChat, setActiveChat] = useState<ChatItem | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');

  // Search by phone state
  const [searchPhone, setSearchPhone] = useState('');
  const [searchResult, setSearchResult] = useState<CitizenUser | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 1. Subscribe to all chats where currentUser is a participant
  useEffect(() => {
    if (!currentUser?.uid) return;

    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, where('participants', 'array-contains', currentUser.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loadedChats: ChatItem[] = [];
        snapshot.forEach((docSnap) => {
          loadedChats.push({
            id: docSnap.id,
            ...(docSnap.data() as Omit<ChatItem, 'id'>),
          });
        });

        // Sort locally by updatedAt desc
        loadedChats.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        setChats(loadedChats);

        // Keep activeChat synced
        if (activeChat) {
          const freshActive = loadedChats.find((c) => c.id === activeChat.id);
          if (freshActive) setActiveChat(freshActive);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'chats');
      }
    );

    return () => unsubscribe();
  }, [currentUser?.uid]);

  // 2. Subscribe to messages of active chat
  useEffect(() => {
    if (!activeChat) {
      setMessages([]);
      return;
    }

    const messagesRef = collection(db, 'chats', activeChat.id, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs: ChatMessage[] = [];
        snapshot.forEach((docSnap) => {
          msgs.push({
            id: docSnap.id,
            ...(docSnap.data() as Omit<ChatMessage, 'id'>),
          });
        });
        setMessages(msgs);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `chats/${activeChat.id}/messages`);
      }
    );

    return () => unsubscribe();
  }, [activeChat?.id]);

  // 3. Search registered citizen by phone number
  const handleSearchUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    setSearchResult(null);

    const cleanInput = searchPhone.trim();
    if (!cleanInput) {
      setSearchError('Введите номер телефона гражданина для поиска.');
      return;
    }

    const digitsOnly = cleanInput.replace(/\D/g, '');
    if (!digitsOnly) {
      setSearchError('Пожалуйста, укажите корректный номер телефона.');
      return;
    }

    const targetUserId = `user_${digitsOnly}`;

    if (targetUserId === currentUser.uid) {
      setSearchError('Вы указали собственный номер телефона.');
      return;
    }

    setIsSearching(true);
    try {
      // Look up target citizen in Firestore
      const userRef = doc(db, 'users', targetUserId);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        setSearchError(`Гражданин с номером «${cleanInput}» пока не зарегистрирован в государственной системе КФ.`);
      } else {
        const found = snap.data() as CitizenUser;
        setSearchResult(found);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `users/${targetUserId}`);
      setSearchError('Ошибка поиска в базе данных. Повторите попытку.');
    } finally {
      setIsSearching(false);
    }
  };

  // 4. Start or open chat with searched citizen
  const handleStartChatWith = async (targetUser: CitizenUser) => {
    // Generate deterministic chatId between two users
    const sortedUids = [currentUser.uid, targetUser.uid].sort();
    const chatId = `chat_${sortedUids[0]}_${sortedUids[1]}`;

    const chatRef = doc(db, 'chats', chatId);
    const snap = await getDoc(chatRef);

    const chatData: ChatItem = {
      id: chatId,
      participants: [currentUser.uid, targetUser.uid],
      participantPhones: [currentUser.phone, targetUser.phone],
      participantNames: {
        [currentUser.uid]: currentUser.fullName || 'Гражданин КФ',
        [targetUser.uid]: targetUser.fullName || 'Гражданин КФ',
      },
      lastMessage: snap.exists() ? (snap.data().lastMessage || 'Диалог начат') : 'Диалог начат',
      updatedAt: snap.exists() ? (snap.data().updatedAt || new Date().toISOString()) : new Date().toISOString(),
    };

    if (!snap.exists()) {
      await setDoc(chatRef, chatData);
    }

    setActiveChat(chatData);
    setSearchResult(null);
    setSearchPhone('');
    setSearchError('');
  };

  // 5. Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChat || !inputText.trim() || isSending) return;

    const text = inputText.trim();
    setInputText('');
    setIsSending(true);

    try {
      const messagesRef = collection(db, 'chats', activeChat.id, 'messages');
      const nowIso = new Date().toISOString();

      await addDoc(messagesRef, {
        senderId: currentUser.uid,
        senderName: currentUser.fullName || 'Гражданин КФ',
        text: text,
        timestamp: nowIso,
      });

      // Update parent chat's last message and updatedAt
      const chatRef = doc(db, 'chats', activeChat.id);
      await updateDoc(chatRef, {
        lastMessage: text,
        updatedAt: nowIso,
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `chats/${activeChat.id}/messages`);
    } finally {
      setIsSending(false);
    }
  };

  const getOtherParticipantName = (chat: ChatItem) => {
    const otherUid = chat.participants.find((uid) => uid !== currentUser.uid);
    if (!otherUid) return 'Гражданин КФ';
    return chat.participantNames?.[otherUid] || 'Гражданин КФ';
  };

  const getOtherParticipantPhone = (chat: ChatItem) => {
    const myDigits = currentUser.phone.replace(/\D/g, '');
    const otherPhone = chat.participantPhones?.find((p) => p.replace(/\D/g, '') !== myDigits);
    return otherPhone || '';
  };

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col md:flex-row h-[720px]">
      
      {/* Left Sidebar: Contact Search & Chat List */}
      <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-slate-200/90 flex flex-col bg-slate-50/40 shrink-0">
        
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200/80 bg-white">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Государственный мессенджер КФ
              </h2>
              <span className="text-[10px] text-slate-400">
                Защищенный защищенный канал Госсвязи
              </span>
            </div>
          </div>

          {/* Search by Phone Form */}
          <form onSubmit={handleSearchUser} className="space-y-2">
            <div className="relative">
              <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchPhone}
                onChange={(e) => {
                  setSearchPhone(e.target.value);
                  setSearchError('');
                }}
                placeholder="Поиск по номеру телефона..."
                className="w-full pl-8 pr-16 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono"
              />
              <button
                type="submit"
                disabled={isSearching || !searchPhone.trim()}
                className="absolute right-1 top-1 bottom-1 px-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-[11px] font-medium rounded-md transition-colors flex items-center justify-center"
              >
                {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Найти'}
              </button>
            </div>
          </form>

          {/* Search Error Notice */}
          {searchError && (
            <div className="mt-2.5 p-2 bg-rose-50 border border-rose-200 rounded-lg text-[11px] text-rose-700 flex items-start gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{searchError}</span>
            </div>
          )}

          {/* Search Result Card */}
          {searchResult && (
            <div className="mt-2.5 p-3 bg-sky-50/70 border border-sky-200/90 rounded-xl space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white border border-sky-200 text-sky-700 flex items-center justify-center font-bold text-xs">
                    {searchResult.fullName ? searchResult.fullName[0].toUpperCase() : 'К'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      <span>{searchResult.fullName}</span>
                      <ShieldCheck className="w-3 h-3 text-sky-600 shrink-0" />
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono block">
                      {searchResult.phone}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-sky-100 text-[10px] text-slate-500">
                <span>{searchResult.citizenId}</span>
                <button
                  type="button"
                  onClick={() => handleStartChatWith(searchResult)}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-medium flex items-center gap-1 transition-colors"
                >
                  <span>Написать</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Existing Chats List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          <div className="px-4 py-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/80">
            Активные диалоги ({chats.length})
          </div>

          {chats.length === 0 ? (
            <div className="p-6 text-center">
              <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-medium">Нет активных переписок</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Введите номер телефона гражданина в строке поиска выше, чтобы начать диалог.
              </p>
            </div>
          ) : (
            chats.map((chat) => {
              const otherName = getOtherParticipantName(chat);
              const otherPhone = getOtherParticipantPhone(chat);
              const isActive = activeChat?.id === chat.id;

              return (
                <button
                  key={chat.id}
                  onClick={() => {
                    setActiveChat(chat);
                    setSearchResult(null);
                  }}
                  className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors ${
                    isActive ? 'bg-sky-50/80 border-l-3 border-sky-600' : 'hover:bg-slate-100/60'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-300">
                    {otherName[0].toUpperCase()}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-semibold text-slate-900 truncate">
                        {otherName}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                        {chat.updatedAt ? new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400 font-mono block">
                      {otherPhone}
                    </span>

                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {chat.lastMessage || 'Нет сообщений'}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>

      </div>

      {/* Right Conversation Window */}
      <div className="flex-1 flex flex-col bg-white">
        
        {activeChat ? (
          <>
            {/* Conversation Header */}
            <div className="px-5 py-3.5 border-b border-slate-200/90 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                  {getOtherParticipantName(activeChat)[0].toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                      {getOtherParticipantName(activeChat)}
                    </h3>
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono block">
                    {getOtherParticipantPhone(activeChat)}
                  </span>
                </div>
              </div>

              <div className="text-right text-[11px] text-slate-400">
                <span className="text-emerald-600 font-medium flex items-center gap-1 justify-end">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Защищенная Госсвязь КФ
                </span>
                <span>Сквозное шифрование ЕСИА</span>
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 bg-slate-50/30">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <UserCheck className="w-8 h-8 text-sky-400 mb-2" />
                  <p className="text-xs font-semibold text-slate-700">Диалог открыт</p>
                  <p className="text-[11px] text-slate-400 max-w-xs mt-1">
                    Отправьте первое сообщение, чтобы начать общение с гражданином {getOtherParticipantName(activeChat)}.
                  </p>
                </div>
              ) : (
                messages.map((m) => {
                  const isMine = m.senderId === currentUser.uid;

                  return (
                    <div
                      key={m.id || m.timestamp}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-xs leading-relaxed ${
                          isMine
                            ? 'bg-slate-900 text-white rounded-br-xs'
                            : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs'
                        }`}
                      >
                        {!isMine && (
                          <span className="text-[10px] text-sky-700 font-semibold block mb-0.5">
                            {m.senderName}
                          </span>
                        )}
                        <p className="whitespace-pre-wrap break-words">{m.text}</p>
                      </div>

                      <span className="text-[10px] text-slate-400 mt-1 px-1 font-mono">
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t border-slate-200/90 bg-white flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Напишите сообщение гражданину..."
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isSending}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-xs"
              >
                <span>Отправить</span>
                <Send className="w-3.5 h-3.5 text-sky-300" />
              </button>
            </form>
          </>
        ) : (
          /* Empty State when no chat is selected */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-50/20">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 mb-3">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Выберите диалог или найдите гражданина
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1.5 leading-relaxed">
              Чтобы отправить сообщение другому гражданину Котинетинской Федерации, введите в строке поиска слева номер телефона, который он указал при регистрации.
            </p>
            <div className="mt-4 p-3 bg-white border border-slate-200/80 rounded-xl text-xs text-slate-600 max-w-sm flex items-center gap-2 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
              <span>Все переписки защищены государственным шифрованием связи ЕСИА.</span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
