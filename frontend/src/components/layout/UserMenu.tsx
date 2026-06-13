import { useEffect, useRef, useState } from 'react';
import { LogOut, Moon, Sun, User } from 'react-feather';

import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import { useIsDarkMode, useTheme } from '../../contexts/ThemeContext';
import { useLogout } from '../../hooks/mutations';

export function UserMenu() {
  const { user } = useAuth();
  const { toggle } = useTheme();
  const isDarkMode = useIsDarkMode();
  const { requireSummaryOnSave, setRequireSummaryOnSave } = useSettings();
  const logoutMutation = useLogout();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  function handleThemeToggle() {
    toggle();
    setIsOpen(false);
  }

  function handleLogout() {
    logoutMutation.mutate();
    setIsOpen(false);
  }

  if (!user) return null;

  return (
    <div ref={menuRef} className="user-menu relative" data-testid="user-menu">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={`user-menu__trigger ${isOpen ? 'user-menu__trigger--open' : ''}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`User menu for ${user.name}`}
      >
        <User size={18} className="user-menu__icon" />
      </button>

      {isOpen && (
        <div role="menu" className="user-menu__panel">
          <div className="user-menu__header">{user.name}</div>
          <div className="user-menu__divider" />
          <div className="user-menu__toggle-row">
            <label htmlFor="require-summary-toggle" className="user-menu__toggle-label">
              Require summary when saving
            </label>
            <button
              id="require-summary-toggle"
              type="button"
              role="menuitemcheckbox"
              aria-checked={requireSummaryOnSave}
              aria-label="Require summary when saving an article"
              className={`user-menu__switch ${requireSummaryOnSave ? 'user-menu__switch--on' : ''}`}
              onClick={() => setRequireSummaryOnSave(!requireSummaryOnSave)}
            >
              <span className="user-menu__switch-thumb" />
            </button>
          </div>
          <div className="user-menu__divider" />
          <button type="button" role="menuitem" onClick={handleThemeToggle} className="user-menu__item">
            {isDarkMode ? <Sun size={16} className="text-amber-500" /> : <Moon size={16} className="text-indigo-500" />}
            {isDarkMode ? 'Light mode' : 'Dark mode'}
          </button>
          <div className="user-menu__divider" />
          <button
            data-testid="logout-btn"
            type="button"
            role="menuitem"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="user-menu__item user-menu__item--danger"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
