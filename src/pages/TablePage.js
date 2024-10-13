import React, {useState} from 'react';
import MusicBandTable from '../components/MusicBandTable/MusicBandTable';
import SpecialOperations from '../components/SpecialOperations/SpecialOperations';
import EditModal from '../components/EditModal/EditModal';
import CreateMusicBandModal from '../components/CreateMusicBandModal/CreateMusicBandModal';

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
        setMusicBands(prevBands => prevBands.filter(band => band.id !== id));
    };


    return (
        <div>
            <MusicBandTable musicBands={musicBands} onRowClick={handleRowClick} setMusicBands={setMusicBands}/>
            <SpecialOperations/>

            <button onClick={() => setIsCreating(true)}>Create New Music Band</button>

            {isEditing && (
                <EditModal band={selectedBand} onSave={handleSave} onClose={() => setIsEditing(false)}
                           onDelete={handleDelete}/>
            )}


            {isCreating && (
                <CreateMusicBandModal onClose={() => setIsCreating(false)} setMusicBands={setMusicBands}/>
            )}
        </div>
    );
};

export default TablePage;