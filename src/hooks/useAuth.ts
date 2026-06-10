import { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import type { SignupData, User } from '../types';

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (snap.exists()) {
            setCurrentUser({ id: firebaseUser.uid, ...(snap.data() as Omit<User, 'id'>) });
          }
        } catch {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email: string, password: string): Promise<string | null> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return null;
    } catch {
      return 'Incorrect email or password.';
    }
  };

  const signup = async (data: SignupData): Promise<string | null> => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const profile: Omit<User, 'id'> = {
        username: data.username,
        email: data.email,
        startDate: data.startDate,
        ...(data.avatarDataUrl ? { avatarDataUrl: data.avatarDataUrl } : {}),
      };
      await setDoc(doc(db, 'users', cred.user.uid), profile);
      return null;
    } catch (err: any) {
      if (err?.code === 'auth/email-already-in-use') return 'That email is already in use.';
      if (err?.code === 'auth/invalid-email') return 'Please enter a valid email.';
      if (err?.code === 'auth/weak-password') return 'Password must be at least 6 characters.';
      return 'Something went wrong. Please try again.';
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateCurrentUser = async (updates: Partial<Omit<User, 'id'>>) => {
    if (!currentUser) return;
    try {
      await updateDoc(doc(db, 'users', currentUser.id), updates);
      setCurrentUser({ ...currentUser, ...updates });
    } catch {
      // ignore
    }
  };

  return { currentUser, authLoading, login, signup, logout, updateCurrentUser };
}
