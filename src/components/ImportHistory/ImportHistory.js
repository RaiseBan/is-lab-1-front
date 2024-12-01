import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ImportHistory.module.css';

const ImportHistory = () => {
    const [importHistory, setImportHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null); // Состояние для файла
    const [uploadStatus, setUploadStatus] = useState(''); // Для статуса загрузки

    const isDataChanged = (newData, currentData) => {
        if (newData.length !== currentData.length) return true;

        for (let i = 0; i < newData.length; i++) {
            if (JSON.stringify(newData[i]) !== JSON.stringify(currentData[i])) {
                return true;
            }
        }

        return false;
    };

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('JWT token is missing!');
                    return;
                }

                const response = await axios.get('http://localhost:8080/api/import-history', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const newData = response.data;

                if (isDataChanged(newData, importHistory)) {
                    setImportHistory(newData);
                }
            } catch (error) {
                console.error('Error fetching import history:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
        const interval = setInterval(fetchHistory, 1000);

        return () => clearInterval(interval);
    }, [importHistory]);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            setUploadStatus('choose file.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setUploadStatus('Токен отсутствует.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            setUploadStatus('loading file...');
            await axios.post('http://localhost:8080/api/music/import', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUploadStatus('file loaded success!');
            setSelectedFile(null);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setUploadStatus('Unexpected file format');
            }else if (error.response && error.response.status === 500){
                setUploadStatus('Maximum upload size exceeded')
            }else {
                setUploadStatus('');
            }
            console.error('error while loading file:', error);
        }
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.header}>Import History</h3>
            {isLoading ? (
                <p className={styles.emptyMessage}>Загрузка...</p>
            ) : importHistory.length > 0 ? (
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>status</th>
                            <th>user</th>
                            <th>added</th>
                            <th>total</th>
                        </tr>
                        </thead>
                        <tbody>
                        {importHistory.slice().reverse().map((operation) => (
                            <tr key={operation.id}>
                                <td>{operation.id}</td>
                                <td>{operation.status}</td>
                                <td>{operation.username}</td>
                                <td>{operation.status === 'SUCCESS' ? operation.addedObjectsCount : 'N/A'}</td>
                                <td>{operation.totalObjectsCount}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className={styles.emptyMessage}>История пуста</p>
            )}
            <div className={styles.fileUploadContainer}>
                <input
                    type="file"
                    onChange={handleFileChange}
                    className={styles.fileInput}
                />
                <button onClick={handleFileUpload} className={styles.uploadButton}>
                    Send
                </button>
            </div>
            {uploadStatus && <p className={styles.uploadStatus}>{uploadStatus}</p>}
        </div>
    );
};

export default ImportHistory;
