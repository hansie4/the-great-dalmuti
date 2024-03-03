import express from "express";
import { createServer } from "node:http";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { Game, Player, Table } from "./GameTypes";
import {
  orderPlayersBasedOnStartingCard,
  dealCards,
  populatePossibleTaxation,
  tradeCards,
  validateHands,
  goToNextPlayersTurn,
  makeMove,
  addPlayerToTable
} from "./tableUtils";
import { getDefaultGame } from "./gameUtils";
import { dealCardsForStartingOrder } from "./cardUtils";
import cors from "cors";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: "*" } });

interface GameMapType {
  [key: string]: Game;
}

const gameMap: GameMapType = {};

app.use(express.json());
app.use(cors());

app.get("/", (_, res) => {
  res.send("Hello");
});

app.get("/info", (_, res) => {
  res.send(gameMap);
});

app.get("/test", (_, res) => {
  const t: Table = {
    currentPlayerTurn: null,
    revolutionWasCalled: false,
    greaterRevolutionWasCalled: false,
    players: [
      {
        name: "P1",
        score: 0,
        startingOrderCard: null,
        cards: [],
        socketId: "1",
        possibleTradeCards: [],
        ready: false
      },
      {
        name: "P2",
        score: 0,
        startingOrderCard: null,
        cards: [],
        socketId: "2",
        possibleTradeCards: [],
        ready: false
      },
      {
        name: "P3",
        score: 0,
        startingOrderCard: null,
        cards: [],
        socketId: "3",
        possibleTradeCards: [],
        ready: false
      },
      {
        name: "P4",
        score: 0,
        startingOrderCard: null,
        cards: [],
        socketId: "4",
        possibleTradeCards: [],
        ready: false
      },
      {
        name: "P5",
        score: 0,
        startingOrderCard: null,
        cards: [],
        socketId: "5",
        possibleTradeCards: [],
        ready: false
      },
      {
        name: "P6",
        score: 0,
        startingOrderCard: null,
        cards: [],
        socketId: "6",
        possibleTradeCards: [],
        ready: false
      }
    ],
    playerSeatsNextRound: [],
    currentTrick: []
  };

  dealCardsForStartingOrder(t);
  orderPlayersBasedOnStartingCard(t);
  dealCards(t);
  validateHands(t);
  populatePossibleTaxation(t);

  tradeCards(t, t.players[0].socketId, [4, 5], [0, 1]);
  tradeCards(t, t.players[1].socketId, [6], [0]);
  validateHands(t);
  goToNextPlayersTurn(t);
  if (t.currentPlayerTurn) {
    makeMove(t, t.currentPlayerTurn.socketId, [t.currentPlayerTurn.cards[0]]);
    goToNextPlayersTurn(t);
  }

  console.log(gameMap);

  res.send(t);
});

app.post("/room", (req, res) => {
  const roomName: string = req.body.roomName;
  console.log(`Attempting to create room ${roomName}`);

  if (!roomName) return res.status(400).send("Missing room name");
  if (!roomName.match(/^([a-zA-Z0-9_-]){4,20}$/))
    return res.status(400).send("Invalid room name");
  if (roomName in gameMap)
    return res.status(400).send("Room with that name already exists");

  gameMap[roomName] = getDefaultGame();
  return res.send("Success");
});

io.on("connection", (socket) => {
  console.log(`User with id: ${socket.id} opened app`);

  socket.on("CHAT_POSTED", (roomId: string, message: string) => {
    console.log(`User with id: ${socket.id} has posted a chat message`);

    if (roomId && roomId in gameMap && message) {
      const sender = gameMap[roomId].table.players.find(
        (P: Player) => P.socketId === socket.id
      );
      if (socket.rooms.has(roomId)) {
        socket.nsp.to(roomId).emit("CHAT_MESSAGE", sender.name, message);
      }
    }
  });

  socket.on("JOIN_ROOM", async (roomId: string, name: string) => {
    console.log(
      `User with id: ${socket.id} attempting to join room: ${roomId}`
    );
    if (roomId && name && roomId in gameMap) {
      try {
        addPlayerToTable(gameMap[roomId].table, name, socket.id);

        await socket.join(roomId);
        socket.emit("ROOM_JOIN_STATUS", true, roomId);
        socket.nsp
          .to(roomId)
          .emit("CHAT_MESSAGE", "System", `${name} has joined the table.`);
        if (gameMap[roomId].table.players.length >= 4) {
          socket.nsp.to(roomId).emit("GAME_CAN_BE_STARTED");
        }
      } catch (error) {
        socket.emit("ROOM_JOIN_STATUS", false);
      }
    } else {
      socket.emit("ROOM_JOIN_STATUS", false);
    }
  });

  socket.on("READY_UP_FOR_POSITION_DRAW", () => {
    console.log(`User with id: ${socket.id} is ready for position draw`);
  });

  socket.on("disconnect", () => {
    console.log(`User with id: ${socket.id} closed the app`);
  });
});

server.listen(process.env["PORT"], () => {
  console.log(
    `The Great Dalmuti server up and running on port ${process.env["PORT"]}.`
  );
});
