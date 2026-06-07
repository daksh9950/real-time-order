import { io } from 'socket.io-client';

const socket = io('https://real-time-order-777r.onrender.com', {
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

export default socket;
