import { io, Socket } from 'socket.io-client';
import { TargetLanguage } from './types';

let socket: Socket | null = null;

export const initializeSocket = () => {
  if (!socket) {
    socket = io('http://localhost:3002', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

export const sendTranslationRequest = (text: string, targetLanguage: TargetLanguage) => {
  const s = getSocket();
  s.emit('translate', { text, targetLanguage });
};
