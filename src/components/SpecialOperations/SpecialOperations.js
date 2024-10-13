import React, { useState } from 'react';
import { groupByCreationDate, findByDescription, addSingle, removeParticipant, countLabelGreaterThan } from '../../services/specialAPI';
import styles from './SpecialOperations.module.css';

const SpecialOperations = () => {
    const [operation, setOperation] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [secondInputValue, setSecondInputValue] = useState('');
    const [result, setResult] = useState('');
    const [errorMessages, setErrorMessages] = useState([]);
    const handleOperationChange = (e) => {
        setOperation(e.target.value);
        setResult('');
        setInputValue('');
        setSecondInputValue('');
        setErrorMessages([]);
    };
    const handleExecute = async () => {
        let errorMessage = '';
        let res;
        if (operation === 'findByDescription' && !inputValue.trim()) {
            errorMessage = 'Please provide a valid description.';
        } else if (operation === 'addSingle' && (!inputValue || !secondInputValue)) {
            errorMessage = 'Please provide a valid band ID and singles count.';
        } else if (operation === 'removeParticipant' && isNaN(Number(inputValue))) {
            errorMessage = 'Please provide a valid band ID.';
        }
        if (errorMessage) {
            setErrorMessages([errorMessage]);
            return;
        }
        try {
            setErrorMessages([]);
            switch (operation) {
                case 'groupByCreationDate':
                    res = await groupByCreationDate();
                    break;
                case 'findByDescription':
                    res = await findByDescription(inputValue);
                    break;
                case 'addSingle':
                    res = await addSingle(inputValue, secondInputValue);
                    break;
                case 'removeParticipant':
                    res = await removeParticipant(inputValue);
                    break;
                case 'countLabelGreaterThan':
                    res = await countLabelGreaterThan(inputValue);
                    break;
                default:
                    res = 'Unknown operation';
                    break;
            }
            setResult(res);
        } catch (error) {
            const errorMessages = [];
            if (error.response && error.response.status === 403) {
                errorMessages.push('You have no permissions for this operation');
            }
            if (error.response && error.response.status === 422) {
                errorMessages.push('Operation violates the constraints');
            }
            if (errorMessages.length === 0) {
                
                errorMessages.push('An unexpected error occurred');
            }
            setErrorMessages(errorMessages);
        }
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.header}>Special Operations</h3>

            <select value={operation} onChange={handleOperationChange} className={styles.select}>
                <option value="">Choose Operation</option>
                <option value="groupByCreationDate">Group by creationDate</option>
                <option value="findByDescription">Find by description</option>
                <option value="addSingle">Add single</option>
                <option value="removeParticipant">Remove participant</option>
                <option value="countLabelGreaterThan">Count Label Greater Than</option>
            </select>

            {/* Ввод только для операций, где это требуется */}
            {operation === 'findByDescription' && (
                <input
                    type="text"
                    placeholder="Enter description"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
            )}

            {operation === 'addSingle' && (
                <>
                    <input
                        type="text"
                        placeholder="Enter band ID"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Enter singles count"
                        value={secondInputValue}
                        onChange={(e) => setSecondInputValue(e.target.value)}
                    />
                </>
            )}

            {operation === 'removeParticipant' && (
                <input
                    type="text"
                    placeholder="Enter band ID"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
            )}

            {operation === 'countLabelGreaterThan' && (
                <input
                    type="text"
                    placeholder="Enter label threshold"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
            )}

            <button onClick={handleExecute} className={styles.button}>Confirm</button>

            {/* Отображаем ошибки, если они есть */}
            {Array.isArray(errorMessages) && errorMessages.length > 0 && (
                <div className={styles.errorMessages}>
                    {errorMessages.map((error, index) => (
                        <p key={index} className={styles.errorText}>{error}</p>
                    ))}
                </div>
            )}

            {/* Добавляем таблицу под кнопкой */}
            <div className={styles.tableContainer}>
                <div className={styles.result}>
                    {/* Пример рендера таблицы для вывода результатов */}
                    {Array.isArray(result) && result.length > 0 && operation === 'groupByCreationDate' ? (
                        <table className={styles.resultTable}>
                            <thead>
                            <tr>
                                <th>Creation Date</th>
                                <th>Count</th>
                            </tr>
                            </thead>
                            <tbody>
                            {result.map((item, index) => (
                                <tr key={index}>
                                    <td>{item[0]}</td>
                                    <td>{item[1]}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : Array.isArray(result) && result.length > 0 ? (
                        <table className={styles.resultTable}>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Coordinates</th>
                                <th>Genre</th>
                                <th>Participants</th>
                                <th>Singles Count</th>
                                <th>Description</th>
                                <th>Best Album</th>
                                <th>Album Count</th>
                                <th>Establishment Date</th>
                                <th>Label</th>
                                <th>Owner</th>
                            </tr>
                            </thead>
                            <tbody>
                            {result.map((band, index) => (
                                <tr key={index}>
                                    <td>{band.id}</td>
                                    <td>{band.name}</td>
                                    <td>{band.coordinates.x}, {band.coordinates.y}</td>
                                    <td>{band.genre}</td>
                                    <td>{band.numberOfParticipants}</td>
                                    <td>{band.singlesCount}</td>
                                    <td>{band.description}</td>
                                    <td>{band.bestAlbum.name}</td>
                                    <td>{band.albumsCount}</td>
                                    <td>{band.establishmentDate}</td>
                                    <td>{band.label.name}</td>
                                    <td>{band.ownerUsername}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Result: {typeof result === 'string' ? result : JSON.stringify(result)}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SpecialOperations;
