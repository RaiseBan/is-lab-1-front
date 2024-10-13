import React, { useState, useEffect } from 'react';
import styles from './CreateMusicBandModal.module.css';
import { createMusicBand, fetchAvailableAlbums, fetchAvailableLabels, fetchAvailableCoordinates } from '../../services/api';
import { validateForm } from '../../validation';

const CreateMusicBandModal = ({ onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        coordinates: {
            x: 0,
            y: 0,
        },
        genre: '',
        numberOfParticipants: 1,
        singlesCount: 1,
        description: '',
        bestAlbum: {
            name: '',
            tracks: 1,
            length: 1,
        },
        albumsCount: 1,
        establishmentDate: '',
        label: {
            name: '',
        },
    });

    const [useExistingAlbum, setUseExistingAlbum] = useState(false);
    const [useExistingLabel, setUseExistingLabel] = useState(false);
    const [useExistingCoordinates, setUseExistingCoordinates] = useState(false);

    const [availableAlbums, setAvailableAlbums] = useState([]);
    const [availableLabels, setAvailableLabels] = useState([]);
    const [availableCoordinates, setAvailableCoordinates] = useState([]);

    const [selectedAlbumId, setSelectedAlbumId] = useState(null);
    const [selectedLabelId, setSelectedLabelId] = useState(null);
    const [selectedCoordinatesId, setSelectedCoordinatesId] = useState(null);

    const [errorMessages, setErrorMessages] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const albums = await fetchAvailableAlbums();
            const labels = await fetchAvailableLabels();
            const coordinates = await fetchAvailableCoordinates();
            console.log(labels)
            setAvailableAlbums(albums);
            setAvailableLabels(labels);
            setAvailableCoordinates(coordinates);
        };
        fetchData();
    }, []);

    const onCreate = async (formData) => {
        try {
            const response = await createMusicBand(formData);
            if (response && response.status === 201 && response.data) {
                onClose();
            } else {
                throw new Error('Server returned no response');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessages = Object.values(error.response.data).flat();
                setErrorMessages(errorMessages);
            } else {
                setErrorMessages(['Server error, try again later.']);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleNestedChange = (e, nestedKey) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [nestedKey]: {
                ...prevData[nestedKey],
                [name]: value,
            },
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const validationErrors = validateForm(formData, useExistingCoordinates, useExistingAlbum, useExistingLabel);

        if (validationErrors.length > 0) {
            setErrorMessages(validationErrors);
            return;
        }

        const formattedDate = new Date(formData.establishmentDate).toISOString();

        
        const updatedFormData = {
            name: formData.name,
            genre: formData.genre,
            numberOfParticipants: formData.numberOfParticipants,
            singlesCount: formData.singlesCount,
            description: formData.description,
            albumsCount: formData.albumsCount,
            establishmentDate: formattedDate,
            
            coordinatesWrapper: useExistingCoordinates
                ? { coordinatesId: selectedCoordinatesId, coordinates: null }
                : { coordinates: formData.coordinates, coordinatesId: null },
            
            bestAlbumWrapper: useExistingAlbum
                ? { bestAlbumId: selectedAlbumId, bestAlbum: null }
                : { bestAlbum: formData.bestAlbum, bestAlbumId: null },
            
            labelWrapper: useExistingLabel
                ? { labelId: selectedLabelId, label: null }
                : { label: formData.label, labelId: null }
        };

        
        onCreate(updatedFormData);
    };





    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2>Create New Music Band</h2>
                    <span className={styles.modalClose} onClick={onClose}>
                        ✕
                    </span>
                </div>
                <form onSubmit={handleSubmit}>


                    <fieldset className={styles.formGroup}>
                        <legend>Coordinates</legend>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    checked={!useExistingCoordinates}
                                    onChange={() => setUseExistingCoordinates(false)}
                                />
                                Enter New Coordinates
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    checked={useExistingCoordinates}
                                    onChange={() => setUseExistingCoordinates(true)}
                                />
                                Select Existing Coordinates
                            </label>
                        </div>
                        {useExistingCoordinates ? (
                            <div className={styles.formGroup}>
                                <label>Select Existing Coordinates:</label>
                                <select
                                    value={selectedCoordinatesId}
                                    onChange={(e) => setSelectedCoordinatesId(e.target.value)}
                                >
                                    <option value="">Select Coordinates</option>
                                    {availableCoordinates.map((coordinate) => (
                                        <option key={coordinate.id} value={coordinate.id}>
                                            {`X: ${coordinate.x}, Y: ${coordinate.y}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div className={styles.formGroup}>
                                <label>Coordinates X:</label>
                                <input
                                    type="number"
                                    name="x"
                                    value={formData.coordinates.x}
                                    onChange={(e) => handleNestedChange(e, 'coordinates')}
                                />
                                <label>Coordinates Y:</label>
                                <input
                                    type="number"
                                    name="y"
                                    value={formData.coordinates.y}
                                    onChange={(e) => handleNestedChange(e, 'coordinates')}
                                />
                            </div>
                        )}
                    </fieldset>
                    <fieldset className={styles.formGroup}>
                        <legend>Best Album</legend>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    checked={!useExistingAlbum}
                                    onChange={() => setUseExistingAlbum(false)}
                                />
                                Enter New Album
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    checked={useExistingAlbum}
                                    onChange={() => setUseExistingAlbum(true)}
                                />
                                Select Existing Album
                            </label>
                        </div>
                        {useExistingAlbum ? (
                            <div className={styles.formGroup}>
                                <label>Select Existing Album:</label>
                                <select
                                    value={selectedAlbumId}
                                    onChange={(e) => setSelectedAlbumId(e.target.value)}
                                >
                                    <option value="">Select an album</option>
                                    {availableAlbums.map((album) => (
                                        <option key={album.id} value={album.id}>
                                            {`${album.name} (Tracks: ${album.tracks}, Length: ${album.length})`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <>
                                <div className={styles.formGroup}>
                                    <label>Best Album Name:</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.bestAlbum.name}
                                        onChange={(e) => handleNestedChange(e, 'bestAlbum')}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Tracks:</label>
                                    <input
                                        type="number"
                                        name="tracks"
                                        value={formData.bestAlbum.tracks}
                                        onChange={(e) => handleNestedChange(e, 'bestAlbum')}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Length:</label>
                                    <input
                                        type="number"
                                        name="length"
                                        value={formData.bestAlbum.length}
                                        onChange={(e) => handleNestedChange(e, 'bestAlbum')}
                                    />
                                </div>
                            </>
                        )}
                    </fieldset>

                    {/* Label */}
                    <fieldset className={styles.formGroup}>
                        <legend>Label</legend>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    checked={!useExistingLabel}
                                    onChange={() => setUseExistingLabel(false)}
                                />
                                Enter New Label
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    checked={useExistingLabel}
                                    onChange={() => setUseExistingLabel(true)}
                                />
                                Select Existing Label
                            </label>
                        </div>
                        {useExistingLabel ? (
                            <div className={styles.formGroup}>
                                <label>Select Existing Label:</label>
                                <select
                                    value={selectedLabelId}
                                    onChange={(e) => setSelectedLabelId(e.target.value)}
                                >
                                    <option value="">Select a label</option>
                                    {availableLabels.map((label) => (
                                        <option key={label.id} value={label.id}>
                                            {label.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div className={styles.formGroup}>
                                <label>Label Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.label.name}
                                    onChange={(e) => handleNestedChange(e, 'label')}
                                />
                            </div>
                        )}
                    </fieldset>
                    <div className={styles.formGroup}>
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Genre:</label>
                        <select
                            name="genre"
                            value={formData.genre}
                            onChange={handleChange}
                        >
                            <option value="">Select a genre</option>
                            <option value="PSYCHEDELIC_ROCK">Psychedelic Rock</option>
                            <option value="RAP">Rap</option>
                            <option value="MATH_ROCK">Math Rock</option>
                            <option value="PUNK_ROCK">Punk Rock</option>
                            <option value="POST_PUNK">Post Punk</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Number of Participants:</label>
                        <input
                            type="number"
                            name="numberOfParticipants"
                            value={formData.numberOfParticipants}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Singles Count:</label>
                        <input
                            type="number"
                            name="singlesCount"
                            value={formData.singlesCount}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Description:</label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Best Album */}


                    <div className={styles.formGroup}>
                        <label>Albums Count:</label>
                        <input
                            type="number"
                            name="albumsCount"
                            value={formData.albumsCount}
                            onChange={handleChange}
                        />
                    </div>



                    <div className={styles.formGroup}>
                        <label>Establishment Date:</label>
                        <input
                            type="date"
                            name="establishmentDate"
                            value={formData.establishmentDate}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Display validation errors */}
                    {Array.isArray(errorMessages) && errorMessages.length > 0 && (
                        <div className={styles.errorMessages}>
                            {errorMessages.map((error, index) => (
                                <p key={index} className={styles.errorText}>{error}</p>
                            ))}
                        </div>
                    )}

                    <button className={styles.createbutton} type="submit">
                        Create
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateMusicBandModal;
