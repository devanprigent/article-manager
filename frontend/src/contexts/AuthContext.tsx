import { createContext, useContext } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { User } from '../constants/types';
import { useSession } from '../hooks/queries';

interface Auth {
  user: User | undefined;
  isConnected: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<Auth | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const qc = useQueryClient();
  const { data: user, isLoading, refetch } = useSession();
  const isConnected = !!user;

  const login = () => {
    refetch();
  };

  const logout = () => {
    qc.clear();
    refetch();
  };

  return <AuthContext.Provider value={{ user, isConnected, isLoading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
