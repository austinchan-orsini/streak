import { useState } from 'react';
import type { User } from '../types';

const ACCOUNTS_KEY = 'streak-accounts';
const SESSION_KEY = 'streak-session';

function readAccounts(): User[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAccounts(users: User[]) {
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(users));
  } catch {
    // ignore
  }
}

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const id = localStorage.getItem(SESSION_KEY);
      if (!id) return null;
      return readAccounts().find((u) => u.id === id) ?? null;
    } catch {
      return null;
    }
  });

  const login = (username: string, password: string): string | null => {
    const user = readAccounts().find(
      (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password,
    );
    if (!user) return 'Incorrect username or password.';
    try { localStorage.setItem(SESSION_KEY, user.id); } catch { /* ignore */ }
    setCurrentUser(user);
    return null;
  };

  const signup = (data: Omit<User, 'id'>): string | null => {
    const all = readAccounts();
    if (all.some((u) => u.username.toLowerCase() === data.username.toLowerCase())) {
      return 'That username is already taken.';
    }
    const user: User = { ...data, id: `user-${Date.now()}` };
    writeAccounts([...all, user]);
    try { localStorage.setItem(SESSION_KEY, user.id); } catch { /* ignore */ }
    setCurrentUser(user);
    return null;
  };

  const logout = () => {
    try { localStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
    setCurrentUser(null);
  };

  const updateCurrentUser = (updates: Partial<Omit<User, 'id'>>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    writeAccounts(readAccounts().map((u) => (u.id === currentUser.id ? updated : u)));
    setCurrentUser(updated);
  };

  return { currentUser, login, signup, logout, updateCurrentUser };
}
