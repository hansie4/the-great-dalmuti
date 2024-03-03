import { useEffect, useState } from "react";
import "./App.css";
import { joinGameRoom, sendChatMessage, socket } from "./websocket/SocketLogic";
import {
  createTheme,
  MantineProvider,
  MantineColorsTuple,
  Center
} from "@mantine/core";
import JoinRoomScreen from "./components/JoinRoomScreen";
import { ChatMessage } from "./utils/types";

const myColor: MantineColorsTuple = [
  "#e0fbff",
  "#cbf2ff",
  "#9ae2ff",
  "#64d2ff",
  "#3cc5fe",
  "#23bcfe",
  "#09b8ff",
  "#00a1e4",
  "#0090cd",
  "#007cb5"
];

const theme = createTheme({
  colors: {
    myColor
  }
});

const App = () => {
  const [roomJoinError, setRoomJoinError] = useState(false);
  const [playerRoom, setPlayerRoom] = useState<string | null>(null);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
    socket.connect();
  }, []);

  useEffect(() => {
    const onConnect = () => {
      console.log("connected");
    };

    const onDisconnect = () => {
      console.log("disconnected");
    };

    const onJoinRoomStatus = (status: boolean, roomName: string) => {
      setRoomJoinError(!status);
      if (status) {
        console.log("Joined room");
        setPlayerRoom(roomName);
      } else {
        console.log("Failed to join room");
      }
    };

    const onChatMessage = (sender: string, message: string) => {
      setChat((chat) => [
        ...chat,
        {
          message: message,
          timestamp: Date.now(),
          sender: sender
        }
      ]);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("ROOM_JOIN_STATUS", onJoinRoomStatus);
    socket.on("CHAT_MESSAGE", onChatMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("ROOM_JOIN_STATUS", onJoinRoomStatus);
      socket.off("CHAT_MESSAGE", onChatMessage);
    };
  }, []);

  return (
    <MantineProvider theme={theme}>
      <Center h={"100vh"} w={"100vw"} bg="myColor.1">
        {playerRoom ? (
          <div>
            <div>
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
              />
              <button
                onClick={() => {
                  sendChatMessage(playerRoom, currentMessage);
                  setCurrentMessage("");
                }}
              >
                Send
              </button>
            </div>
            <ul>
              {chat.map((CM: ChatMessage, index: number) => {
                return (
                  <li
                    key={index}
                  >{`[${new Date(CM.timestamp).toLocaleTimeString()}] ${CM.sender}: ${CM.message}`}</li>
                );
              })}
            </ul>
          </div>
        ) : (
          <JoinRoomScreen
            joinRoom={joinGameRoom}
            roomJoinError={roomJoinError}
            clearError={() => setRoomJoinError(false)}
          />
        )}
      </Center>
    </MantineProvider>
  );
};

export default App;
