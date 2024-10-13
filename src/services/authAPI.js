import axios from 'axios';
import {AUTH_URL} from "./urls";

export const registerUser = async (username, password) => {
    try {
        const response = await axios.post(`${AUTH_URL}/register`, {
            username,
            password,
        });
        return response.data; 
    } catch (error) {
                if (error.response && error.response.status === 409) {
            throw new Error('Пользователь с таким именем уже существует');
        } else {
            throw new Error('Ошибка регистрации. Попробуйте снова.');
        }
    }
};


export const loginUser = async (username, password) => {
    try {
        const response = await axios.post(`${AUTH_URL}/authenticate`, {
            username,
            password,
        });
        return response.data; 
    } catch (error) {
                if (error.response && error.response.status === 403) {
            throw new Error('Неправильный логин или пароль');
        } else {
            throw new Error('Ошибка авторизации. Попробуйте снова.');
        }
    }
};
