import { useEffect, useState } from "react";
import "./App.css";
import { joinGameRoom, socket } from "./websocket/SocketLogic";
import {
  createTheme,
  MantineProvider,
  MantineColorsTuple,
  Center,
  Grid,
  GridCol
} from "@mantine/core";
import JoinRoomScreen from "./components/JoinRoomScreen";
import { ChatMessage } from "./utils/types";
import ChatBox from "./components/ChatBox";
import HandDisplay from "./components/HandDisplay";
import Table from "./components/Table";
import GameActions from "./components/GameActions";

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

    const onGameUpdate = (gameState: any) => {
      console.log(gameState);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("ROOM_JOIN_STATUS", onJoinRoomStatus);
    socket.on("CHAT_MESSAGE", onChatMessage);
    socket.on("GAME_UPDATE", onGameUpdate);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("ROOM_JOIN_STATUS", onJoinRoomStatus);
      socket.off("CHAT_MESSAGE", onChatMessage);
      socket.off("GAME_UPDATE", onGameUpdate);
    };
  }, []);

  return (
    <MantineProvider theme={theme}>
      <Center h={"100vh"} w={"100vw"} bg="myColor.1">
        {playerRoom ? (
          <div style={{ maxWidth: "1000px" }}>
            <Grid>
              <Grid.Col span={12}>
                <Table />
              </Grid.Col>
              <Grid.Col span={3}>
                <ChatBox
                  messages={chat}
                  playerRoom={playerRoom}
                  showTimestamps={false}
                />
              </Grid.Col>
              <GridCol span={7}>
                <HandDisplay />
              </GridCol>
              <GridCol span={2}>
                <GameActions />
              </GridCol>
            </Grid>
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
