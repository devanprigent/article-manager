import { NavLink } from 'react-router-dom';

export function NavTabs() {
  const linkClass = (isActive: boolean) =>
    `flex items-center justify-center whitespace-nowrap rounded-lg px-2.5 py-2.5 text-center text-sm font-semibold transition dark:text-slate-300 sm:px-3 md:px-4 md:py-2.5 md:text-base ${
      isActive
        ? 'text-indigo-600 shadow-sm dark:text-indigo-300 dark:bg-slate-700 dark:text-slate-100'
        : 'text-slate-600 hover:bg-white/70 hover:text-slate-800 dark:hover:bg-slate-700 dark:hover:text-slate-100'
    }`;

  return (
    <div className="grid w-full grid-cols-4 gap-1 rounded-xl bg-slate-100 p-1.5 dark:bg-slate-800 md:flex md:w-max md:gap-1.5">
      <NavLink className={({ isActive }) => linkClass(isActive)} to="/articles">
        Articles
      </NavLink>
      <NavLink className={({ isActive }) => linkClass(isActive)} to="/likes">
        Likes
      </NavLink>
      <NavLink className={({ isActive }) => linkClass(isActive)} to="/read-later">
        Read later
      </NavLink>
      <NavLink className={({ isActive }) => linkClass(isActive)} to="/stats">
        Stats
      </NavLink>
    </div>
  );
}
