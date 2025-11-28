// src/services/socket.js
import { io } from 'socket.io-client'

let socketInstance = null

export function connectSocket(token) {
  if (socketInstance) return socketInstance

  const base = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

  socketInstance = io(base, {
    auth: { token },
  })

  return socketInstance
}

export default function getSocket() {
  return socketInstance
}