import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/main.scss';

function Header() {
    return (
        <header className="site-header">
            <div className="header-container">
                <h1 className="logo">
                    <NavLink to="/">DocSign</NavLink>
                </h1>
                <nav className="nav-menu">
                    <ul>
                        <li>
                            <NavLink to="/" exact activeClassName="active">
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/documents" activeClassName="active">
                                Documents
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/profiles" activeClassName="active">
                                Profiles
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;