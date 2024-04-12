// Libraries
import React from "react";
import { NavLink } from "react-router-dom";

/**
 * The role of this component is to create a navigation bar.
 * The navigation bar uses the react-router-dom library to handle navigation
 * between the various pages of the application.
 */
function NavBar() {
  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl flex flex-1 h-16 items-center space-x-6">
        <NavLink
          className="text-gray-400 hover:text-gray-200 focus:text-white"
          to="/"
        >
          Articles
        </NavLink>

        <NavLink
          className="text-gray-400 hover:text-gray-200 focus:text-white"
          to="/favoris"
        >
          Favoris
        </NavLink>

        <NavLink
          className="text-gray-400 hover:text-gray-200 focus:text-white"
          to="/websites"
        >
          WebSites
        </NavLink>
      </div>
    </nav>
  );
}

export default NavBar;
