import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Moon, Sun } from 'react-feather';
import AuthForm from '../forms/AuthForm';
import { buttonSize, buttonStyle } from '../../constants/constants';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme, useIsDarkMode } from '../../contexts/ThemeContext';
import { useLogout } from '../../hooks/mutations';

type AuthMode = 'login' | 'register';

function NavBar() {
  const { toggle } = useTheme();
  const isDarkMode = useIsDarkMode();
  const { isConnected } = useAuth();
  const logoutMutation = useLogout();
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isAuthFormOpen, setIsAuthFormOpen] = useState(false);

  function openAuthForm(mode: AuthMode) {
    setAuthMode(mode);
    setIsAuthFormOpen(true);
  }

  return (
    <nav className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur-md transition-colors dark:border-slate-700/70 dark:bg-slate-900/80">
      <div className="mx-auto grid min-h-16 w-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-2 sm:px-6">
        <h1 className="text-lg font-semibold tracking-tight text-slate-800 dark:text-slate-100">Article Manager</h1>
        <div className="flex items-center gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          <NavLink
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-semibold transition dark:text-slate-300 ${
                isActive
                  ? 'text-indigo-600 shadow-sm dark:text-indigo-300 dark:bg-slate-700 dark:text-slate-100'
                  : 'text-slate-600 hover:bg-white/70 hover:text-slate-800 dark:hover:bg-slate-700 dark:hover:text-slate-100'
              }`
            }
            to="/"
          >
            Articles
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-semibold transition dark:text-slate-300 ${
                isActive
                  ? 'text-indigo-600 shadow-sm dark:text-indigo-300 dark:bg-slate-700 dark:text-slate-100'
                  : 'text-slate-600 hover:bg-white/70 hover:text-slate-800 dark:hover:bg-slate-700 dark:hover:text-slate-100'
              }`
            }
            to="/favorites"
          >
            Favorites
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-semibold transition dark:text-slate-300 ${
                isActive
                  ? 'text-indigo-600 shadow-sm dark:text-indigo-300 dark:bg-slate-700 dark:text-slate-100'
                  : 'text-slate-600 hover:bg-white/70 hover:text-slate-800 dark:hover:bg-slate-700 dark:hover:text-slate-100'
              }`
            }
            to="/stats"
          >
            Stats
          </NavLink>
        </div>
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={toggle}
            className="rounded-lg border border-slate-300 p-2 text-slate-600 transition bg-slate-100 hover:text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDarkMode ? 'Light mode' : 'Dark mode'}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {isConnected ? (
            <button
              className={`${buttonStyle.error} ${buttonSize.small}`}
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              Logout
            </button>
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
