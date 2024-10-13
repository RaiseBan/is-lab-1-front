import React, { useState, useEffect } from 'react';
import { requestAdminAccess, getAdminRequestStatus } from '../../services/adminAPI';
import { connectWebSocket } from '../../services/wsAPI'; 
import styles from './AdminRequestPage.module.css';

const AdminRequestPage = () => {
    const [responseMessage, setResponseMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [, setConnected] = useState(false);
    const [, setWebSocket] = useState(null);

    const handleAdminRequest = async () => {
        try {
            setLoading(true);
            const result = await requestAdminAccess();
            setResponseMessage(result);
            setError('');

            
            connectWebSocket(
                (message) => {
                    if (message === 'admin-approved') {
                        setLoading(false);
                        setResponseMessage('You are now an admin!');
                        setWebSocket(null);
                    }
                },
                () => setConnected(true),
                (error) => {
                                        setError('WebSocket error occurred.');
                },
                () => setConnected(false)
            );
        } catch (err) {
            setLoading(false);
                        setError(err.message || 'An error occurred');
            setResponseMessage('');
        }
    };

    useEffect(() => {
        const checkAdminRequestStatus = async () => {
            try {
                const { status, message } = await getAdminRequestStatus();
                if (status === 'pending') {
                    setLoading(true);
                    setResponseMessage(message);

                    
                    connectWebSocket(
                        (message) => {
                            if (message === 'admin-approved') {
                                setLoading(false);
                                setResponseMessage('You are now an admin!');
                                setWebSocket(null);
                            }
                        },
                        () => setConnected(true),
                        (error) => {
                                                        setError('WebSocket error occurred.');
                        },
                        () => setConnected(false)
                    );
                } else if (status === 'approved') {
                    setLoading(false);
                    setResponseMessage(message);
                }
            } catch (err) {
                                setError("Error checking admin request status.");
            }
        };

        checkAdminRequestStatus();
    }, []);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Request Admin Access</h2>

            {!loading && !responseMessage && (
                <button onClick={handleAdminRequest} className={styles.button}>
                    Submit Admin Request
                </button>
            )}

            {loading && (
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                </div>
            )}

            {responseMessage && <div className={styles.successMessage}>{responseMessage}</div>}

            {error && <div className={styles.errorMessage}>{error}</div>}
        </div>
    );
};

export default AdminRequestPage;
