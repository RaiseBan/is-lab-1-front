import React, { useState, useEffect } from 'react';
import WebSocket from 'isomorphic-ws';
import axios from 'axios';

const MusicBandTable = () => {
    const [musicBands, setMusicBands] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [bandsPerPage] = useState(5); // Количество объектов на одной странице

    // Функция для получения всех объектов из коллекции
    const fetchAllMusicBands = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/music'); // Выполняем GET запрос к API
            setMusicBands(response.data); // Обновляем состояние
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
        }
    };

    useEffect(() => {
        // Подключаемся к WebSocket
        const ws = new WebSocket('ws://localhost:8080/ws/music');
        console.log("connected");

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log(message); // Убедитесь, что получаете корректные данные

            if (message.type === 'create') {
                // Добавляем новый объект в список
                setMusicBands(prevBands => [...prevBands, message.musicBand]);
            }
            if (message.type === "delete"){
                setMusicBands(prevState => prevState.filter(band => band.id !== message.id))
            }
        };

        // При загрузке страницы получаем все объекты из БД
        fetchAllMusicBands();

        return () => ws.close(); // Закрыть вебсокет при размонтировании компонента
    }, []);

    // Вычисляем индексы для текущей страницы
    const indexOfLastBand = currentPage * bandsPerPage;
    const indexOfFirstBand = indexOfLastBand - bandsPerPage;
    const currentBands = musicBands.slice(indexOfFirstBand, indexOfLastBand);

    // Функция для перехода на другую страницу
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <h1>Список MusicBand</h1>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Coordinates</th>
                    <th>Creation Date</th>
                    <th>Genre</th>
                    <th>Participants</th>
                    <th>Description</th>
                    <th>Best Album</th>
                    <th>User</th>
                </tr>
                </thead>
                <tbody>
                {currentBands.length > 0 ? (
                    currentBands.map((band, index) => (
                        <tr key={index}>
                            <td>{band.name}</td>
                            <td>{band.coordinates.x}, {band.coordinates.y}</td>
                            <td>{band.creationDate}</td>
                            <td>{band.genre}</td>
                            <td>{band.numberOfParticipants}</td>
                            <td>{band.description}</td>
                            <td>{band.bestAlbum.name}</td>
                            <td>{band.ownerUsername}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="8">No data</td>
                    </tr>
                )}
                </tbody>
            </table>

            {/* Пагинация */}
            <div>
                <ul className="pagination">
                    {Array.from({ length: Math.ceil(musicBands.length / bandsPerPage) }, (_, i) => (
                        <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => paginate(i + 1)}>
                                {i + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    );
};

export default MusicBandTable;
