import { useState } from 'react';
import { Link } from 'react-router-dom';

import { buttonSize, buttonStyle } from '../../constants/constants';
import { AuthMode } from '../../constants/types';
import { useAuth } from '../../contexts/AuthContext';
import AuthForm from '../forms/AuthForm';
import { NavTabs } from './NavTabs';
import { UserMenu } from './UserMenu';

function NavBar() {
  const { isConnected } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isAuthFormOpen, setIsAuthFormOpen] = useState(false);

  function openAuthForm(mode: AuthMode) {
    setAuthMode(mode);
    setIsAuthFormOpen(true);
  }

  return (
    <nav className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur-md transition-colors dark:border-slate-700/70 dark:bg-slate-900/80">
      <div className="mx-auto grid min-h-16 w-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-2 sm:px-6">
        <Link
          to="/"
          className="justify-self-start text-lg font-semibold tracking-tight text-slate-800 transition hover:text-indigo-600 dark:text-slate-100 dark:hover:text-indigo-300"
        >
          Article Manager
        </Link>
        <div className="justify-self-center">{isConnected && <NavTabs />}</div>
        <div className="flex items-center justify-end gap-2 justify-self-end">
          {isConnected ? (
            <UserMenu />
          ) : (
            <>
              <button className={`${buttonStyle.neutral} ${buttonSize.small}`} onClick={() => openAuthForm('login')}>
                Login
              </button>
              <button className={`${buttonStyle.success} ${buttonSize.small}`} onClick={() => openAuthForm('register')}>
                Register
              </button>
            </>
          )}
        </div>
      </div>
      <AuthForm isOpen={isAuthFormOpen} mode={authMode} onClose={() => setIsAuthFormOpen(false)} />
    </nav>
  );
}

export default NavBar;
