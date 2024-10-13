import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MusicBandTable from './pages/TablePage';
import Header from './components/Header/Header';
import Visualization from './pages/Vizualization';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminRequestPage from './pages/AdminRequestPage/AdminRequestPage';
import AdminPanel from './pages/AdminPanel/AdminPanel';
import ProtectedRoute from './route/ProtectedRoute';
import './App.css';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedRole = localStorage.getItem('role');
        if (token) {
            setIsAuthenticated(true);
            setUser(localStorage.getItem('user'));
            setRole(storedRole);
        }
    }, []);

    const handleLogin = (data, username) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('user', username);
        setIsAuthenticated(true);
        setUser(username);
        setRole(data.role);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
        setRole(null);
    };

    return (
        <Router>
            <Header
                isAuthenticated={isAuthenticated}
                user={user}
                role={role}
                onLogout={handleLogout}
            />
            <Routes>
                <Route path="/" element={<MusicBandTable />} />
                <Route path="/visualization" element={<Visualization />} />
                <Route path="/admin-request" element={<AdminRequestPage />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/register" element={<Register />} />

                {/* Защищенный маршрут для админов */}
                <Route path="/admin-panel" element={
                    <ProtectedRoute role={role} requiredRole="ADMIN">
                        <AdminPanel />
                    </ProtectedRoute>
                } />
            </Routes>
        </Router>
    );
};

export default App;
