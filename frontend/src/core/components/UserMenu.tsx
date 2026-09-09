import { useEffect, useId, useRef, useState } from 'react';
import { LogOut, Moon, Sun, User } from 'react-feather';

import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import { useIsDarkMode, useTheme } from '../../contexts/ThemeContext';
import { useLogout } from '../../hooks/mutations';

type UserMenuProps = {
  includeTestId?: boolean;
};

export function UserMenu({ includeTestId = true }: Readonly<UserMenuProps>) {
  const { user } = useAuth();
  const { toggle } = useTheme();
  const isDarkMode = useIsDarkMode();
  const { requireSummaryOnSave, setRequireSummaryOnSave } = useSettings();
  const logoutMutation = useLogout();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const requireSummaryToggleId = useId();

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

  const userInitial = user.name.trim().charAt(0).toUpperCase() || 'U';

  return (
    <div ref={menuRef} className="user-menu relative" data-testid={includeTestId ? 'user-menu' : undefined}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={`user-menu__trigger ${isOpen ? 'user-menu__trigger--open' : ''}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`User menu for ${user.name}`}
      >
        <span className="user-menu__avatar" aria-hidden="true">
          {userInitial}
        </span>
      </button>

      {isOpen && (
        <div role="menu" className="user-menu__panel">
          <div className="user-menu__header">
            <div className="user-menu__header-avatar" aria-hidden="true">
              <User size={16} />
            </div>
            <div className="min-w-0">
              <p className="user-menu__eyebrow">Signed in as</p>
              <p className="user-menu__name">{user.name}</p>
            </div>
          </div>
          <div className="user-menu__divider" />
          <div className="user-menu__toggle-row">
            <label htmlFor={requireSummaryToggleId} className="user-menu__toggle-label">
              <span className="user-menu__toggle-title">Require summary</span>
              <span className="user-menu__toggle-description">When saving consulted articles</span>
            </label>
            <button
              id={requireSummaryToggleId}
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
            <span className="user-menu__item-icon">
              {isDarkMode ? <Sun size={16} className="text-amber-500" /> : <Moon size={16} className="text-indigo-500" />}
            </span>
            <span>{isDarkMode ? 'Light mode' : 'Dark mode'}</span>
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
            <span className="user-menu__item-icon">
              <LogOut size={16} />
            </span>
            <span>{logoutMutation.isPending ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
