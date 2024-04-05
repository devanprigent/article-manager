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
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <ul className="navbar-nav">
          <li className="nav-item display-7">
            <NavLink className="nav-link font-weight-bold" to="/">
              Articles
            </NavLink>
          </li>
          <li className="nav-item display-7">
            <NavLink className="nav-link font-weight-bold" to="/favoris">
              Favoris
            </NavLink>
          </li>
          <li className="nav-item display-7">
            <NavLink className="nav-link font-weight-bold" to="/websites">
              WebSites
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

// Exportation
export default NavBar;
