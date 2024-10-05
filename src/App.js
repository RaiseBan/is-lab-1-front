import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import MusicBandTable from './pages/MusicBandTable';
import Header from './pages/Header';
import Visualization from './pages/Vizualization';
import Login from './pages/Login';
import Register from './pages/Register';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Получаем информацию о пользователе, если он авторизован
            setIsAuthenticated(true);
            setUser(localStorage.getItem('user')); // Загружаем имя пользователя
        }
    }, []);

    const handleLogin = (data, username) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', username);
        setIsAuthenticated(true);
        setUser(username);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <Router>
            <Header
                isAuthenticated={isAuthenticated}
                user={user}
                onLogout={handleLogout}
            />
            <Routes>
                <Route path="/" element={<MusicBandTable />} />
                <Route path="/visualization" element={<Visualization />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    );
};

export default App;
