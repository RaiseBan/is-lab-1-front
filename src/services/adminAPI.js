import axios from 'axios';

import {ADMIN_REQUEST_URL} from "./urls";

export const requestAdminAccess = async () => {
    const token = localStorage.getItem("token")
    const response = await axios.post(`${ADMIN_REQUEST_URL}/request`, {},
        {headers: {Authorization: `Bearer ${token}`},});
    return response.data;
};
export const fetchAdminRequests = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${ADMIN_REQUEST_URL}/all`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};
export const approveAdminRequest = async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${ADMIN_REQUEST_URL}/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getAdminRequestStatus = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${ADMIN_REQUEST_URL}/status`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return response.data;
};

