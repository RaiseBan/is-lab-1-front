import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

const Header = ({ isAuthenticated, user, role, onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate('/');
    };

    return (
        <header className={styles.header}>
            <nav>
                <ul>
                    <li>
                        <Link
                            to="/"
                            className={`${styles.link} ${location.pathname === '/' ? styles.active : ''}`}
                        >
                            Table
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/visualization"
                            className={`${styles.link} ${location.pathname === '/visualization' ? styles.active : ''}`}
                        >
                            Visualization
                        </Link>
                    </li>
                    {isAuthenticated && role === 'USER' && (
                        <li>
                            <Link
                                to="/admin-request"
                                className={`${styles.link} ${location.pathname === '/admin-request' ? styles.active : ''}`}
                            >
                                Admin Request
                            </Link>
                        </li>
                    )}
                    {isAuthenticated && role === 'ADMIN' && (
                        <li>
                            <Link
                                to="/admin-panel"
                                className={`${styles.link} ${location.pathname === '/admin-panel' ? styles.active : ''}`}
                            >
                                Admin Panel
                            </Link>
                        </li>
                    )}
                </ul>
            </nav>
            <div className={styles.user}>
                {isAuthenticated ? (
                    <div>
                        <span>User: {user}</span>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                ) : (
                    <div>
                        <Link to="/login" className={styles.link}>Sign in</Link>
                        /
                        <Link to="/register" className={styles.link}>Sign up</Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
