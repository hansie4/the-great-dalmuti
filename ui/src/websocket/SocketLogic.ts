import { io } from "socket.io-client";

export const socket = io("ws://localhost:5000", { autoConnect: false });

export const socketLogic = () => {
  const onConnect = () => {
    console.log("connected");
  };

  const onDisconnect = () => {
    console.log("disconnected");
  };

  const onChatMessage = (message: string) => {
    console.log(message);
  };

  socket.on("connect", onConnect);
  socket.on("disconnect", onDisconnect);
  socket.on("CHAT_MESSAGE", onChatMessage);

  return () => {
    socket.off("connect", onConnect);
    socket.off("disconnect", onDisconnect);
    socket.off("CHAT_MESSAGE", onChatMessage);
  };
};
