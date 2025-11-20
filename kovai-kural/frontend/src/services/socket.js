// frontend/src/services/socket.js
import { io } from 'socket.io-client';
import api from './api';

let socket = null;
export function connectSocket(token) {
  if (socket) return socket;
  socket = io(import.meta.env.VITE_API_BASE || 'http://localhost:5000', {
    auth: { token }
  });
  return socket;
}
export default () => socket;
