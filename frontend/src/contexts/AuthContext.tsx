import { createContext, useContext } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { User } from '../constants/types';
import { useSession } from '../hooks/queries';

interface Auth {
  user: User | undefined;
  isConnected: boolean;
  isFetching: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<Auth | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const qc = useQueryClient();
  const { data: user, isFetching, refetch } = useSession();
  const isConnected = !!user;

  const login = async () => {
    await refetch();
  };

  const logout = async () => {
    qc.clear();
    await refetch();
  };

  return <AuthContext.Provider value={{ user, isConnected, isFetching, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
