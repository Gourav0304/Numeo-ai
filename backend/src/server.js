import 'dotenv/config';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { registerSocketHandlers } from './socketHandlers.js';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

registerSocketHandlers(io);

const PORT = Number(process.env.PORT) || 3002;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
