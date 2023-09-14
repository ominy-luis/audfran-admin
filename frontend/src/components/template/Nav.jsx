import './Nav.css';
import React from 'react';
import { Link } from 'react-router-dom';
import { AuthLogin } from '../login/Auth';

const Nav = () => {
    console.log(AuthLogin)

    return (
        <aside className="menu-area">
            <nav className="menu">
                <Link to="/dashboard">
                    <i className="fa fa-home"></i> Dashboard
                </Link>
                <Link to="/pacientes">
                    <i className="fa fa-user"></i> Pacientes
                </Link>
                <Link to="">
                    Logout
                </Link>
            </nav>
        </aside >
    );
};

export default Nav;
