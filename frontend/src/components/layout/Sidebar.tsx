import { ReactNode } from 'react';
import { BarChart2, Bookmark, BookOpen, Heart, Layers } from 'react-feather';
import { NavLink } from 'react-router-dom';

import { UserMenu } from './UserMenu';

type SidebarProps = {
  children: ReactNode;
};

const navigationItems = [
  { to: '/articles', label: 'Library', accessibleName: 'Articles', icon: Layers },
  { to: '/read-later', label: 'Read later', accessibleName: 'Read Later', icon: Bookmark },
  { to: '/likes', label: 'Liked', accessibleName: 'Likes', icon: Heart },
  { to: '/stats', label: 'Insights', accessibleName: 'Stats', icon: BarChart2 },
] as const;

function workspaceLinkClass(isActive: boolean) {
  return `flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm font-semibold transition ${
    isActive
      ? 'border-slate-950 bg-slate-950 text-white shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'
      : 'border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-100'
  }`;
}

function mobileLinkClass(isActive: boolean) {
  return `flex flex-1 flex-col items-center gap-1 rounded-2xl border px-2 py-2 text-[11px] font-semibold transition ${
    isActive
      ? 'border-slate-950 bg-slate-950 text-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'
      : 'border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-100'
  }`;
}

export function Sidebar({ children }: Readonly<SidebarProps>) {
  return (
    <div className="min-h-screen bg-[#f6f3ee] text-slate-950 transition-colors dark:bg-slate-950 dark:text-slate-50">
      <div className="mx-auto flex min-h-screen w-full max-w-[92rem]">
        <aside className="sticky top-0 z-40 hidden h-screen w-72 shrink-0 border-r border-slate-200/80 bg-white/70 px-4 py-5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70 lg:flex lg:flex-col">
          <div className="mb-8 flex items-center gap-3 px-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm dark:border dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
              <BookOpen size={20} aria-hidden="true" />
            </div>
            <div>
              <p className="m-0 text-sm font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Article</p>
              <h1 className="m-0 text-xl font-black tracking-tight">Manager</h1>
            </div>
          </div>

          <nav className="flex flex-1 flex-col gap-1" aria-label="Workspace navigation">
            {navigationItems.map(({ to, label, accessibleName, icon: Icon }) => (
              <NavLink key={to} to={to} aria-label={accessibleName} className={({ isActive }) => workspaceLinkClass(isActive)}>
                <Icon size={18} aria-hidden="true" />
                {label}
              </NavLink>
            ))}
          </nav>

          <section
            className="relative z-50 rounded-3xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/70"
            aria-label="User settings"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="m-0 text-xs font-black uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Settings</p>
                <p className="m-0 mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">Preferences</p>
              </div>
              <UserMenu />
            </div>
          </section>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <main className="min-w-0 flex-1 px-4 py-4 pb-28 sm:px-6 lg:px-8 lg:py-6">{children}</main>
        </div>
      </div>

      <nav
        className="fixed inset-x-3 bottom-3 z-30 flex gap-1 rounded-[1.7rem] border border-slate-200/80 bg-white/90 p-1.5 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90 lg:hidden"
        aria-label="Mobile workspace navigation"
      >
        {navigationItems.map(({ to, label, accessibleName, icon: Icon }) => (
          <NavLink key={to} to={to} aria-label={accessibleName} className={({ isActive }) => mobileLinkClass(isActive)}>
            <Icon size={17} aria-hidden="true" />
            {label}
          </NavLink>
        ))}
        <div className="flex flex-1 items-center justify-center rounded-2xl px-2 py-2">
          <UserMenu includeTestId={false} />
        </div>
      </nav>
    </div>
  );
}
