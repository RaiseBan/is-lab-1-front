import React, { useState } from 'react';
import styles from './EditModal.module.css';
import { deleteMusicBand, updateMusicBand } from '../../services/api';
import { validateForm } from "../../validation";

const EditModal = ({ band, onSave, onClose, onDelete }) => {
    const [editedBand, setEditedBand] = useState({
        ...band,
        genre: band.genre || "", 
        coordinates: band.coordinates || { x: 0, y: 0 }, 
        bestAlbum: band.bestAlbum || { name: "" }, 
        label: band.label || { name: "" }, 
        establishmentDate: band.establishmentDate?.split('T')[0] || "" 
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [validationErrors, setValidationErrors] = useState([]);

    const handleChange = (e) => {
        const { name, value, dataset } = e.target;

        if (dataset.field) {
            setEditedBand((prevBand) => ({
                ...prevBand,
                [dataset.field]: {
                    ...prevBand[dataset.field],
                    [name]: value,
                },
            }));
        } else {
            setEditedBand((prevBand) => ({
                ...prevBand,
                [name]: value,
            }));
        }
    };

    const handleSaveClick = async () => {
        try {
            
            const updatedBandData = {
                ...editedBand,
                
                establishmentDate: editedBand.establishmentDate
                    ? new Date(editedBand.establishmentDate).toISOString().split('T')[0]
                    : null,
                coordinatesWrapper: editedBand.coordinates
                    ? { coordinates: editedBand.coordinates, coordinatesId: null }
                    : { coordinates: null, coordinatesId: null },
                bestAlbumWrapper: editedBand.bestAlbum
                    ? { bestAlbum: editedBand.bestAlbum, bestAlbumId: null }
                    : { bestAlbum: null, bestAlbumId: null },
                labelWrapper: editedBand.label
                    ? { label: editedBand.label, labelId: null }
                    : { label: null, labelId: null }
            };

            
            const validationErrors = validateForm(updatedBandData);
            if (validationErrors.length > 0) {
                setValidationErrors(validationErrors);
                return;
            }

            
            await updateMusicBand(updatedBandData.id, updatedBandData);
            onSave(updatedBandData);

        } catch (error) {
            if (error.response && error.response.status === 403) {
                setErrorMessage('You have no permissions for this operation');
            } else {
                setErrorMessage('An error occurred while saving. Please try again.');
            }
        }
    };


    const handleDeleteClick = async () => {
        try {
            await deleteMusicBand(editedBand.id);
            onDelete(editedBand.id);
            onClose();
        } catch (error) {
            if (error.response && error.response.status === 403) {
                setErrorMessage('You have no permissions for this operation');
            } else {
                setErrorMessage('Ошибка при удалении. Попробуйте еще раз.');
            }
        }
    };

    return (
        <>
            <div className={styles.modalOverlay} onClick={onClose}></div>
            <div className={styles.modal}>
                <div className={styles.modalContent}>
                    <span className={styles.close} onClick={onClose}>&times;</span>
                    <h2>Edit {editedBand.name}</h2>
                    <form>
                        <label>
                            Name:
                            <input
                                type="text"
                                name="name"
                                value={editedBand.name || ""}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Coordinates (X):
                            <input
                                type="number"
                                name="x"
                                value={editedBand.coordinates?.x || 0}
                                data-field="coordinates"
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Coordinates (Y):
                            <input
                                type="number"
                                name="y"
                                value={editedBand.coordinates?.y || 0}
                                data-field="coordinates"
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Genre:
                            <select
                                name="genre"
                                value={editedBand.genre || ""}
                                onChange={handleChange}
                            >
                                <option value="">Select a genre</option>
                                <option value="PSYCHEDELIC_ROCK">Psychedelic Rock</option>
                                <option value="RAP">Rap</option>
                                <option value="MATH_ROCK">Math Rock</option>
                                <option value="PUNK_ROCK">Punk Rock</option>
                                <option value="POST_PUNK">Post Punk</option>
                            </select>
                        </label>
                        <label>
                            Participants:
                            <input
                                type="number"
                                name="numberOfParticipants"
                                value={editedBand.numberOfParticipants || 0}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Singles Count:
                            <input
                                type="number"
                                name="singlesCount"
                                value={editedBand.singlesCount || 0}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Description:
                            <input
                                type="text"
                                name="description"
                                value={editedBand.description || ""}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Albums Count:
                            <input
                                type="number"
                                name="albumsCount"
                                value={editedBand.albumsCount || 0}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Establishment Date:
                            <input
                                type="date"
                                name="establishmentDate"
                                value={editedBand.establishmentDate || ""}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Best Album Name:
                            <input
                                type="text"
                                name="name"
                                value={editedBand.bestAlbum?.name || ""}
                                data-field="bestAlbum"
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Label:
                            <input
                                type="text"
                                name="name"
                                value={editedBand.label?.name || ""}
                                data-field="label"
                                onChange={handleChange}
                            />
                        </label>
                        <div className={styles.buttonGroup}>
                            <button type="button" onClick={handleSaveClick}>Сохранить</button>
                            <button type="button" onClick={handleDeleteClick} className={styles.deleteButton}>Удалить</button>
                        </div>
                    </form>
                    {errorMessage && (
                        <div className={styles.errorMessage}>
                            {errorMessage}
                        </div>
                    )}
                    {Array.isArray(validationErrors) && validationErrors.length > 0 && (
                        <div className={styles.errorMessages}>
                            {validationErrors.map((error, index) => (
                                <p key={index} className={styles.errorText}>{error}</p>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default EditModal;
