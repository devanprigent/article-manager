import { NavLink } from 'react-router-dom';

export function NavTabs() {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
      <NavLink
        className={({ isActive }) =>
          `rounded-lg px-3 py-2 text-sm font-semibold transition dark:text-slate-300 ${
            isActive
              ? 'text-indigo-600 shadow-sm dark:text-indigo-300 dark:bg-slate-700 dark:text-slate-100'
              : 'text-slate-600 hover:bg-white/70 hover:text-slate-800 dark:hover:bg-slate-700 dark:hover:text-slate-100'
          }`
        }
        to="/articles"
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
        to="/likes"
      >
        Likes
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          `rounded-lg px-3 py-2 text-sm font-semibold transition dark:text-slate-300 ${
            isActive
              ? 'text-indigo-600 shadow-sm dark:text-indigo-300 dark:bg-slate-700 dark:text-slate-100'
              : 'text-slate-600 hover:bg-white/70 hover:text-slate-800 dark:hover:bg-slate-700 dark:hover:text-slate-100'
          }`
        }
        to="/read-later"
      >
        Read later
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
  );
}
