// Libraries
import React from "react";
import { NavLink } from "react-router-dom";

/**
 * The role of this component is to create a navigation bar.
 * The navigation bar uses the react-router-dom library to handle navigation
 * between the various pages of the application.
 */
function NavBar() {
  const linkStyle = "text-gray-800 font-bold hover:text-white focus:text-white";

  return (
    <nav className="bg-gray-200">
      <div className="mx-4 flex flex-1 h-16 items-center space-x-6">
        <NavLink className={linkStyle} to="/">
          Articles
        </NavLink>

        <NavLink className={linkStyle} to="/favoris">
          Favoris
        </NavLink>
      </div>
    </nav>
  );
}

export default NavBar;
