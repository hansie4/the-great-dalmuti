import { getStartingDeck, shuffleDeck } from './cardUtils';

import express from 'express';
import { createServer } from 'node:http';
import dotenv from 'dotenv';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (_, res) => {
  res.send(shuffleDeck(getStartingDeck()));
});

io.on('connection', (socket) => {
  console.log(`a user connected: ${socket}`);
});

server.listen(3000, () => {
  console.log(
    `The Great Dalmuti server up and running on port ${process.env['PORT']}.`
  );
});
