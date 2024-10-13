export const validateForm = (data, useExistingCoordinates, useExistingAlbum, useExistingLabel) => {
    const errors = [];
    const validGenres = ['PSYCHEDELIC_ROCK', 'RAP', 'MATH_ROCK', 'PUNK_ROCK', 'POST_PUNK'];

    
    if (!data.name || data.name.trim() === '') {
        errors.push('Name cannot be null or empty');
    }

    
    if (!useExistingCoordinates) {
        if (data.coordinates.x < -599 || data.coordinates.x == null) {
            errors.push('X must be greater than -599');
        }
        if (data.coordinates.y == null) {
            errors.push('Y cannot be null');
        }
    }

    
    if (data.genre !== '' && !validGenres.includes(data.genre)) {
        errors.push('Not a valid genre');
    }

    
    if (data.numberOfParticipants <= 0) {
        errors.push('Number of participants must be greater than 0');
    }

    
    if (data.singlesCount == null || data.singlesCount <= 0) {
        errors.push('Singles count must be greater than 0');
    }

    
    if (!data.description || data.description.trim() === '') {
        errors.push('Description cannot be null or empty');
    }

    
    if (!useExistingAlbum) {
        if (!data.bestAlbum.name || data.bestAlbum.name.trim() === '') {
            errors.push('Best album name cannot be null or empty');
        }
        if (data.bestAlbum.tracks <= 0) {
            errors.push('Tracks count must be greater than 0');
        }
        if (data.bestAlbum.length == null || data.bestAlbum.length <= 0) {
            errors.push('Length must be greater than 0');
        }
    }

    
    if (data.albumsCount <= 0) {
        errors.push('Albums count must be greater than 0');
    }

    
    if (!data.establishmentDate || data.establishmentDate.trim() === '') {
        errors.push('Establishment date cannot be null');
    } else {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(data.establishmentDate)) {
            errors.push('Establishment date must be in the format YYYY-MM-DD');
        }
    }

    
    if (!useExistingLabel) {
        if (!data.label.name || data.label.name.trim() === '') {
            errors.push('Label name cannot be null or empty');
        }
    }

    return errors;
};
