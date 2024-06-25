import React from "react";
import "components/Header.css";
import {logout} from "utils/Auth";

/**
 * Renders the header section for a webpage.
 * Includes a logo, search input, navigation links, and a logout button.
 */
const Header: React.FC = () => {
    const links = ['Search', 'Import/Export', 'Gestion Utilisateurs', 'Stat'];

    return (
        <header className="header">
            <div className="header-left">
                <a href="/" className="navbar-brand" aria-label="IMT Atlantique">
                    <img
                        src="https://www.imt-atlantique.fr/sites/default/files/Images/Ecole/charte-graphique/IMT_Atlantique_logo_RVB_Negatif_Baseline_400x272.png"
                        alt="IMT Atlantique Logo"
                    />
                </a>
                <input
                    type="text"
                    className="form-control navbar-search"
                    placeholder="Search"
                    aria-label="Search"
                />
            </div>
            <nav className="header-right gap-3">
                {links.map((link, index) => (
                    <a key={index} href={`/${link.toLowerCase().replace(/\s/g, '-')}`} className="nav-item nav-link">
                        {link}
                    </a>
                ))}
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={logout}
                >
                    Log out
                </button>
            </nav>
        </header>
    );
}

export default Header;