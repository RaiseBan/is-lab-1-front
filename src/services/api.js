import axios from 'axios';
import {MUSIC_URL, LABEL_URL, ALBUMS_URL, COORDINATES_URL} from "./urls";

export const fetchMusicBands = async () => {
    const response = await axios.get(`${MUSIC_URL}`);
    return response.data;
};

export const updateMusicBand = async (id, band) => {
    const token = localStorage.getItem('token');
    await axios.put(`${MUSIC_URL}/${id}`, band, {
        headers: {Authorization: `Bearer ${token}`},
    });
};


export const createMusicBand = async (band) => {
    const token = localStorage.getItem('token');

    try {
        const bandData = JSON.stringify(band);

        
        const res = await axios.post(MUSIC_URL, bandData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        
        return res;
    } catch (error) {
                    }
};

export const deleteMusicBand = async (id) => {
    const token = localStorage.getItem('token');

    const res = await axios.delete(`${MUSIC_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    });

    
    return res;
}



export const fetchAvailableAlbums = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${ALBUMS_URL}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        return response.data;
    } catch (error) {
                throw error;
    }
};


export const fetchAvailableLabels = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${LABEL_URL}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        return response.data;
    } catch (error) {
                throw error;
    }
};

export const fetchAvailableCoordinates = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${COORDINATES_URL}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });

        return response.data;
    } catch (error) {
                throw error;
    }
};




