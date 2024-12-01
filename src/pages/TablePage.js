import React, { useState } from 'react';
import MusicBandTable from '../components/MusicBandTable/MusicBandTable';
import SpecialOperations from '../components/SpecialOperations/SpecialOperations';
import EditModal from '../components/EditModal/EditModal';
import CreateMusicBandModal from '../components/CreateMusicBandModal/CreateMusicBandModal';
import ImportHistory from '../components/ImportHistory/ImportHistory';

const TablePage = () => {
    const [musicBands, setMusicBands] = useState([]);
    const [selectedBand, setSelectedBand] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const handleRowClick = (band) => {
        setSelectedBand(band);
        setIsEditing(true);
    };

    const handleSave = async () => {
        setIsEditing(false);
    };

    const handleDelete = (id) => {
        setMusicBands((prevBands) => prevBands.filter((band) => band.id !== id));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
            {/* Главная таблица */}
            <div>
                <MusicBandTable musicBands={musicBands} onRowClick={handleRowClick} setMusicBands={setMusicBands} />
                <button onClick={() => setIsCreating(true)} style={{ marginTop: '10px' }}>
                    Create New Music Band
                </button>
            </div>

            {/* Нижняя часть с операциями и историей */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '40px' }}>
                <SpecialOperations />
                <ImportHistory />
            </div>



            {/* Модальные окна */}
            {isEditing && (
                <EditModal
                    band={selectedBand}
                    onSave={handleSave}
                    onClose={() => setIsEditing(false)}
                    onDelete={handleDelete}
                />
            )}

            {isCreating && (
                <CreateMusicBandModal onClose={() => setIsCreating(false)} setMusicBands={setMusicBands} />
            )}
        </div>
    );
};

export default TablePage;
