import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ isAuthenticated, user, onLogout }) => {
    return (
        <header>
            <nav>
                <ul>
                    <li><Link to="/">Таблица</Link></li>
                    <li><Link to="/visualization">Визуализация</Link></li>
                </ul>
            </nav>
            <div>
                {isAuthenticated ? (
                    <div>
                        <span>Привет, {user}!</span>
                        <button onClick={onLogout}>Выйти</button>
                    </div>
                ) : (
                    <div>
                        <Link to="/login">Войти</Link>
                        <Link to="/register">Регистрация</Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
