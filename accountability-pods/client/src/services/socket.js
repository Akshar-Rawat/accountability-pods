import { io } from 'socket.io-client';

let socket = null;
let isConnected = false;

export const connectSocket = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      withCredentials: true,
      auth: {
        token: localStorage.getItem('accessToken'),
      },
    });

    socket.on('connect', () => {
      isConnected = true;
      console.log('socket connected');
    });

    socket.on('disconnect', () => {
      isConnected = false;
      console.log('socket disconnected');
    });

    socket.on('error', (error) => {
      console.error('socket error:', error);
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return connectSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    isConnected = false;
  }
};

export const isSocketConnected = () => {
  return isConnected;
};

export default getSocket;
