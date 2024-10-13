import React, { useState, useEffect } from 'react';
import { fetchAdminRequests, approveAdminRequest } from '../../services/adminAPI';
import styles from './AdminPanel.module.css';

const AdminPanel = () => {
    const [adminRequests, setAdminRequests] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const getRequests = async () => {
        try {
            setLoading(true);
            const requests = await fetchAdminRequests();
            setAdminRequests(requests);
            setError(null);
        } catch (error) {
                        setError('nothing here...');
        } finally {
            setLoading(false);
        }
    };
    const approveRequest = async (id) => {
        try {
            await approveAdminRequest(id);
            getRequests();
        } catch (error) {
                        setError(`error while approving ${id}`);
        }
    };
    useEffect(() => {
        getRequests();
    }, []);

    return (
        <div className={styles.container}>
            <h1>Admin Panel</h1>
            <button onClick={getRequests} className={styles.refreshButton}>
                update table
            </button>

            {loading && <p>Loading...</p>}
            {error && <p className={styles.error}>{error}</p>}

            {!loading && !error && (
                <div className={styles.tableContainer}>
                    <table className={styles.resultTable}>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Requester</th>
                            <th>Approved By</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {adminRequests.map((request) => (
                            <tr key={request.id}>
                                <td>{request.id}</td>
                                <td>{request.requesterUsername}</td>
                                <td>{request.approvedByUsernames.join(', ')}</td>
                                <td className={styles.statusCell}>
                                    {request.approvedByAll ? 'Approved' : 'Pending'}
                                    {!request.approvedByAll && (
                                        <button
                                            onClick={() => approveRequest(request.id)}
                                            className={styles.approveButton}
                                        >
                                            Approve
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
