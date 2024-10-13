import axios from "axios";
import {SPECIAL_OP_URL} from "./urls";
export const groupByCreationDate = async () => {
    const response = await axios.get(`${SPECIAL_OP_URL}/group-by-creation-date`);
    return response.data;
};

export const findByDescription = async (substring) => {
    const response = await axios.get(`${SPECIAL_OP_URL}/find-by-description`, {
        params: { substring }
    });
    return response.data;
};

export const addSingle = async (bandId, singlesCount) => {
    const token = localStorage.getItem('token');


    const response = await axios.get(`${SPECIAL_OP_URL}/add-single`, {
        params: { bandId, singlesCount },
        headers: {Authorization: `Bearer ${token}`},
    });
    return response.data;
};

export const removeParticipant = async (bandId) => {
    const token = localStorage.getItem('token');

    const response = await axios.post(`${SPECIAL_OP_URL}/remove-participant`, null, {
        params: { bandId },
        headers: {Authorization: `Bearer ${token}`}
    });
    return response.data;
};

export const countLabelGreaterThan = async (labelThreshold) => {
    const response = await axios.get(`${SPECIAL_OP_URL}/count-label-greater-than`, {
        params: { labelThreshold }
    });
    return response.data;
};