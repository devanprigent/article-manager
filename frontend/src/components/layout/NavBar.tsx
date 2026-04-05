// Libraries
import { NavLink } from "react-router-dom";

/**
 * The role of this component is to create a navigation bar.
 * The navigation bar uses the react-router-dom library to handle navigation
 * between the various pages of the application.
 */
function NavBar() {
  return (
    <nav className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <h1 className="text-lg font-semibold tracking-tight text-slate-800">
          Article Manager
        </h1>
        <div className="flex items-center gap-2 rounded-xl bg-slate-100 p-1">
          <NavLink
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-semibold transition ${
                isActive
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:bg-white/70 hover:text-slate-800"
              }`
            }
            to="/"
          >
          Articles
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-semibold transition ${
                isActive
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:bg-white/70 hover:text-slate-800"
              }`
            }
            to="/favoris"
          >
            Favoris
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
