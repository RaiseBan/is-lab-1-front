import React, { useEffect, useState } from 'react';
import styles from './MusicBandTable.module.css';
import { fetchMusicBands } from '../../services/api';
import { connectMusicWs } from '../../services/wsAPI';
import Pagination from '../Pagination/Pagination';

const MusicBandTable = ({ musicBands, onRowClick, setMusicBands }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [filterConfig, setFilterConfig] = useState({});
    const currentUser = localStorage.getItem('user');

    
    const formatDateToISO = (dateString) => {
        if (!dateString) return ''; 
        if (typeof dateString === 'string' && dateString.includes('T')) {
            
            return dateString.split('T')[0];
        }
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return ''; 
        return date.toISOString().split('T')[0];
    };



    useEffect(() => {
        
        const fetchBands = async () => {
            const data = await fetchMusicBands();
            const formattedData = data.map(band => ({
                ...band,
                establishmentDate: formatDateToISO(band.establishmentDate) 
            }));
            setMusicBands(formattedData);
        };

        
        fetchBands();

        
        const ws = connectMusicWs((message) => {
            if (message.musicBand) {
                
                const parsedEstablishmentDate = formatDateToISO(message.musicBand.establishmentDate);

                
                message.musicBand.establishmentDate = parsedEstablishmentDate;

                
                if (message.type === 'create') {
                    setMusicBands((prevBands) => [...prevBands, message.musicBand]);
                } else if (message.type === 'delete') {
                    if (message.id) {
                        setMusicBands((prevBands) => prevBands.filter((band) => band.id !== message.id));
                    }
                } else if (message.type === 'update') {
                    setMusicBands((prevBands) =>
                        prevBands.map((band) => (band.id === message.musicBand.id ? message.musicBand : band))
                    );
                }
            }
        });

        
        return () => {
            ws.close();
        };
    }, [setMusicBands]);


    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedBands = [...musicBands].sort((a, b) => {
        if (sortConfig.key) {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];
            if (sortConfig.direction === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        }
        return 0;
    });

    
    const filteredBands = sortedBands.filter((band) => {
        return Object.keys(filterConfig).every((key) => {
            
            if (!filterConfig[key]) return true;

            
            if (key.startsWith('bestAlbum')) {
                const nestedKey = key.split('.')[1];
                return band.bestAlbum[nestedKey]?.toString().toLowerCase() === filterConfig[key].toLowerCase();
            }

            
            if (key === 'label.name') {
                return band.label?.name.toLowerCase() === filterConfig[key].toLowerCase();
            }

            
            if (key === 'creationDate' || key === 'establishmentDate') {
                return formatDateToISO(band[key]) === filterConfig[key];
            }

            
            if (key === 'coordinates.x') {
                return band.coordinates?.x?.toString() === filterConfig[key];
            }
            if (key === 'coordinates.y') {
                return band.coordinates?.y?.toString() === filterConfig[key];
            }

            
            return band[key] && band[key].toString().toLowerCase() === filterConfig[key].toLowerCase();
        });
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredBands.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleFilterChange = (e, key) => {
        setFilterConfig((prev) => ({
            ...prev,
            [key]: e.target.value,
        }));
    };

    return (
        <div className={styles['table-container']}>
            <h2 className={styles.tableHeader}>MusicBands</h2>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th rowSpan="2" onClick={() => handleSort('id')} className={styles.clickable}>Id {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                    <th rowSpan="2" onClick={() => handleSort('name')} className={styles.clickable}>Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                    <th colSpan="2">Coordinates</th>
                    <th rowSpan="2" onClick={() => handleSort('creationDate')} className={styles.clickable}>Creation Date {sortConfig.key === 'creationDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                    <th rowSpan="2" onClick={() => handleSort('genre')} className={styles.clickable}>Genre {sortConfig.key === 'genre' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                    <th rowSpan="2" onClick={() => handleSort('numberOfParticipants')} className={styles.clickable}>Participants {sortConfig.key === 'numberOfParticipants' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                    <th rowSpan="2" onClick={() => handleSort('singlesCount')} className={styles.clickable}>SingleCount {sortConfig.key === 'singlesCount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                    <th rowSpan="2" onClick={() => handleSort('description')} className={styles.clickable}>Description {sortConfig.key === 'description' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                    <th colSpan="3">Best Album</th>
                    <th rowSpan="2" onClick={() => handleSort('albumsCount')} className={styles.clickable}>Albums Count {sortConfig.key === 'albumsCount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                    <th rowSpan="2" onClick={() => handleSort('establishmentDate')} className={styles.clickable}>Establishment {sortConfig.key === 'establishmentDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                    <th rowSpan="2" onClick={() => handleSort('label.name')} className={styles.clickable}>Label {sortConfig.key === 'label.name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                    <th rowSpan="2" onClick={() => handleSort('ownerUsername')} className={styles.clickable}>User {sortConfig.key === 'ownerUsername' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                </tr>
                <tr>
                    <th onClick={() => handleSort('coordinates.x')} className={styles.clickable}>x</th>
                    <th onClick={() => handleSort('coordinates.y')} className={styles.clickable}>y</th>
                    <th onClick={() => handleSort('bestAlbum.name')} className={styles.clickable}>name</th>
                    <th onClick={() => handleSort('bestAlbum.tracks')} className={styles.clickable}>tracks</th>
                    <th onClick={() => handleSort('bestAlbum.length')} className={styles.clickable}>length</th>
                </tr>
                <tr>
                    <th><input type="text" onChange={(e) => handleFilterChange(e, 'id')} className={styles.filterInput}/></th>
                    <th><input type="text" onChange={(e) => handleFilterChange(e, 'name')} className={styles.filterInput}/></th>
                    <th><input type="text" onChange={(e) => handleFilterChange(e, 'coordinates.x')} className={styles.filterInput}/></th>
                    <th><input type="text" onChange={(e) => handleFilterChange(e, 'coordinates.y')} className={styles.filterInput}/></th>
                    <th><input type="text" onChange={(e) => handleFilterChange(e, 'creationDate')} className={styles.filterInput} placeholder="YYYY-MM-DD"/></th>
                    <th><input type="text" onChange={(e) => handleFilterChange(e, 'genre')} className={styles.filterInput}/></th>
                    <th><input type="text" onChange={(e) => handleFilterChange(e, 'numberOfParticipants')} className={styles.filterInput}/></th>
                    <th><input type="text" onChange={(e) => handleFilterChange(e, 'singlesCount')} className={styles.filterInput}/></th>
                    <th><input type="text" onChange={(e) => handleFilterChange(e, 'description')} className={styles.filterInput}/></th>
                    <th><input type="text" onChange={(e) => handleFilterChange(e, 'bestAlbum.name')} className={styles.filterInput}/></th>
                    <th><input type="text" onChange={(e) => handleFilterChange(e, 'bestAlbum.tracks')} className={styles.filterInput}/></th>
                    <th><input type="text" onChange={(e) => handleFilterChange(e, 'bestAlbum.length')} className={styles.filterInput}/></th>
                    <th><input type="text" onChange={(e) => handleFilterChange(e, 'albumsCount')} className={styles.filterInput}/></th>
                    <th><input type="text" onChange={(e) => handleFilterChange(e, 'establishmentDate')} className={styles.filterInput} placeholder="YYYY-MM-DD"/></th>
                    <th><input type="text" onChange={(e) => handleFilterChange(e, 'label.name')} className={styles.filterInput}/></th>
                    <th><input type="text" onChange={(e) => handleFilterChange(e, 'ownerUsername')} className={styles.filterInput}/></th>
                </tr>
                </thead>
                <tbody>
                {currentItems.length > 0 ? (
                    currentItems.map((band, index) => (
                        <tr
                            key={index}
                            className={`${styles.rowHighlight} ${band.ownerUsername === currentUser ? styles.currentUserRow : ''}`}
                            onClick={() => onRowClick(band)}
                        >
                            <td>{band.id}</td>
                            <td>{band.name}</td>
                            <td>{band.coordinates.x}</td>
                            <td>{band.coordinates.y}</td>
                            <td>{formatDateToISO(band.creationDate)}</td>
                            <td>{band.genre}</td>
                            <td>{band.numberOfParticipants}</td>
                            <td>{band.singlesCount}</td>
                            <td>{band.description}</td>
                            <td>{band.bestAlbum.name}</td>
                            <td>{band.bestAlbum.tracks}</td>
                            <td>{band.bestAlbum.length}</td>
                            <td>{band.albumsCount}</td>
                            <td>{formatDateToISO(band.establishmentDate)}</td>
                            <td>{band.label.name}</td>
                            <td>{band.ownerUsername}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="15" className={styles.noData}>No data</td>
                    </tr>
                )}
                </tbody>
            </table>
            <div className={styles.paginationContainer}>
                <Pagination
                    totalItems={filteredBands.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={paginate}
                />
            </div>
        </div>
    );
};

export default MusicBandTable;
