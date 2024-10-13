import {WS_URL} from "./urls";

export const connectWebSocket = (onMessageCallback, onOpenCallback, onErrorCallback, onCloseCallback) => {
    const token = localStorage.getItem('token');
    const ws = new WebSocket(`${WS_URL}/admin?token=${token}`);

    ws.onopen = () => {
        if (onOpenCallback) onOpenCallback(ws);
    };

    ws.onmessage = (event) => {
        if (onMessageCallback) onMessageCallback(event.data);
    };

    ws.onerror = (error) => {
                if (onErrorCallback) onErrorCallback(error);

    };

    ws.onclose = () => {
        if (onCloseCallback) onCloseCallback();
    };

    return ws;
};


export const connectMusicWs = (onMessageCallback) => {
    const ws = new WebSocket(`${WS_URL}/music`);

    ws.onopen = () => {
            };

    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (onMessageCallback) {
            onMessageCallback(message); 
        }
    };

    ws.onerror = (error) => {
            };

    ws.onclose = () => {
            };

    return ws; 
};
