const { io } = require('socket.io-client');

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected!', socket.id);
  socket.emit('join-queue', '69e3b27fbf29b5d818ade4da');
});

socket.on('token-called', (data) => {
  console.log('Token called:', data);
});

socket.on('token-served', (data) => {
  console.log('Token served:', data);
});

socket.on('token-created', (data) => {
  console.log('Queue updated:', data);
});