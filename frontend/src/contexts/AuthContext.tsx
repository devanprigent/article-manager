import { createContext, useContext, useState } from 'react';

interface Auth {
  isConnected: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<Auth | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState<boolean>(!!localStorage.getItem('access_token'));

  const login = (token: string) => {
    localStorage.setItem('access_token', token);
    setIsConnected(true);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setIsConnected(false);
  };

  return <AuthContext.Provider value={{ isConnected, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
