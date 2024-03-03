import { io } from "socket.io-client";

export const socket = io("ws://localhost:5000", { autoConnect: false });

export const joinGameRoom = (roomName: string, playerName: string) => {
  socket.emit("JOIN_ROOM", roomName, playerName);
};

export const sendChatMessage = (roomId: string, message: string) => {
  socket.emit("CHAT_POSTED", roomId, message);
};

export const readyUp = () => {
  socket.emit("READY_UP_FOR_POSITION_DRAW");
};
