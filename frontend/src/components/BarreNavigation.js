// Bibliothèques
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

/**
 * Le rôle de ce composant est de créer une barre de navigation.
 * La barre de navigation utilise la bibliothèque react-router-dom pour gérer la navigation
 * entre les différentes pages de l'application.
 */
function BarreNavigation() {
    const [expanded, setExpanded] = useState(false);
    const toggleNavbar = () => {
        setExpanded(!expanded);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <button className="navbar-toggler" type="button" onClick={toggleNavbar}>
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className={`collapse navbar-collapse ${expanded ? "show" : ""}`}>
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item display-7">
                        <NavLink className="nav-link font-weight-bold" to="/articles">
                            Articles
                        </NavLink>
                    </li>
                    <li className="nav-item display-7">
                        <NavLink className="nav-link font-weight-bold" to="/tags">
                            Tags
                        </NavLink>
                    </li>
                </ul>
                <span className="navbar-text mx-auto font-weight-bold display-5">
                    Article Manager
                </span>
            </div>
        </nav>
    );
}

export default BarreNavigation;
