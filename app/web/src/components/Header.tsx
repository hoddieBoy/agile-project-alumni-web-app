import React from "react";
import {useNavigate} from "react-router-dom";
import "components/Header.css";
import {logout} from "routing/Router";

export default function Header() {
    const navigate = useNavigate();
    const handleLogout = () => {
        logout()
        navigate('/login');
    }

    return (
        <header className="header">
            <div className="header-left">
                <a href="#" className="navbar-brand">
                    <img
                        src="https://www.imt-atlantique.fr/sites/default/files/Images/Ecole/charte-graphique/IMT_Atlantique_logo_RVB_Negatif_Baseline_400x272.png"
                        alt="IMT Atlantique Logo"
                    />
                </a>
                <input type="text" className="form-control navbar-search" placeholder="Search"/>
            </div>
            <nav className="header-right gap-3">
                <a href="#" className="nav-item nav-link">Search</a>
                <a href="#" className="nav-item nav-link">Import/Export</a>
                <a href="#" className="nav-item nav-link">Gestion Utilisateurs</a>
                <button type="button" className="btn btn-primary" onClick={handleLogout}>Log out</button>
            </nav>
        </header>
    );
}