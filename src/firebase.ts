import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
  addDoc,
  getDocs,
  limit,
  getDocFromServer,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// CRITICAL: Must pass databaseId according to Skill instructions
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
  addDoc,
  getDocs,
  limit,
  serverTimestamp,
};

export interface ChatMessage {
  id?: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface ChatItem {
  id: string;
  participants: string[];
  participantPhones: string[];
  participantNames: Record<string, string>;
  lastMessage: string;
  updatedAt: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo?: Record<string, unknown>;
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase connection check: Client currently offline or initial connection pending.');
    }
  }
}

testConnection();

// Multi-layer persistent session management (LocalStorage + Cookies)
export const SESSION_KEY = 'kotiynet_session_uid';
export const CACHE_USER_KEY = 'kotiynet_cached_user';

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  try {
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
    return match ? decodeURIComponent(match[3]) : null;
  } catch {
    return null;
  }
}

export function setCookie(name: string, value: string, days = 365) {
  if (typeof document === 'undefined') return;
  try {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    // Write cookie with Lax and cross-context fallback
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  } catch (e) {
    console.warn('Cookie write error:', e);
  }
}

export function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  try {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
  } catch (e) {
    console.warn('Cookie delete error:', e);
  }
}

/**
 * Saves user session seamlessly to LocalStorage and Cookies.
 * Guarantees zero re-login prompts across page reloads and browser sessions.
 */
export function saveSession(user: CitizenUser) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SESSION_KEY, user.uid);
    localStorage.setItem(CACHE_USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
  setCookie(SESSION_KEY, user.uid, 365);
}

export function getSavedSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const localId = localStorage.getItem(SESSION_KEY);
    if (localId && localId.trim()) return localId.trim();
  } catch {
    // fallback to cookies
  }
  return getCookie(SESSION_KEY);
}

export function getCachedUser(): CitizenUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CACHE_USER_KEY);
    if (raw) {
      return JSON.parse(raw) as CitizenUser;
    }
  } catch (e) {
    console.warn('Cached user parse error:', e);
  }
  return null;
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(CACHE_USER_KEY);
  } catch (e) {
    console.warn('LocalStorage clear error:', e);
  }
  deleteCookie(SESSION_KEY);
}

export interface CitizenUser {
  uid: string;
  phone: string;
  fullName: string;
  birthDate: string;
  citizenId: string;
  balance: number;
  salary: number;
  debt: number;
  passwordHash?: string;
  createdAt: string;
  updatedAt: string;
}
