import { useState } from 'react';
import { Link } from 'react-router-dom';

import { buttonSize, buttonStyle } from '../../constants/constants';
import { AuthMode } from '../../constants/types';
import { useAuth } from '../../contexts/AuthContext';
import AuthForm from '../forms/AuthForm';
import { NavTabs } from './NavTabs';
import { UserMenu } from './UserMenu';

const logoClassName =
  'shrink-0 text-base font-semibold tracking-tight text-slate-800 transition hover:text-indigo-600 dark:text-slate-100 dark:hover:text-indigo-300';

function NavBar() {
  const { isConnected } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isAuthFormOpen, setIsAuthFormOpen] = useState(false);

  function openAuthForm(mode: AuthMode) {
    setAuthMode(mode);
    setIsAuthFormOpen(true);
  }

  const authControls = isConnected ? (
    <UserMenu />
  ) : (
    <>
      <button data-testid="login-btn" className={`${buttonStyle.neutral} ${buttonSize.small}`} onClick={() => openAuthForm('login')}>
        Login
      </button>
      <button data-testid="register-btn" className={`${buttonStyle.success} ${buttonSize.small}`} onClick={() => openAuthForm('register')}>
        Register
      </button>
    </>
  );

  return (
    <nav className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur-md transition-colors dark:border-slate-700/70 dark:bg-slate-900/80">
      <div className="mx-auto w-full min-w-0 max-w-6xl px-4 py-1 sm:px-6 sm:py-1.5">
        <div className="grid grid-cols-[1fr_auto] grid-rows-[auto_auto] gap-1 md:grid-cols-[1fr_auto_1fr] md:grid-rows-1 md:items-center md:gap-3">
          <Link to="/" className={`${logoClassName} col-start-1 row-start-1 md:justify-self-start`}>
            Article Manager
          </Link>
          <div className="col-start-2 row-start-1 flex items-center justify-end gap-2 md:col-start-3 md:justify-self-end">{authControls}</div>
          {isConnected ? (
            <div className="col-span-2 row-start-2 w-full min-w-0 md:col-span-1 md:col-start-2 md:row-start-1 md:w-auto md:justify-self-center">
              <NavTabs />
            </div>
          ) : null}
        </div>
      </div>
      <AuthForm isOpen={isAuthFormOpen} mode={authMode} onClose={() => setIsAuthFormOpen(false)} />
    </nav>
  );
}

export default NavBar;
