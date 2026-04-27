import { createContext, useContext, useState } from 'react';

interface Auth {
  isConnected: boolean;
  login: (access_token: string, refresh_token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<Auth | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState<boolean>(!!sessionStorage.getItem('access_token'));

  const login = (access_token: string, refresh_token: string) => {
    sessionStorage.setItem('access_token', access_token);
    sessionStorage.setItem('refresh_token', refresh_token);
    setIsConnected(true);
  };

  const logout = () => {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    setIsConnected(false);
  };

  return <AuthContext.Provider value={{ isConnected, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
