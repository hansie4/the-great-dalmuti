import { useEffect } from "react";
import "./App.css";
import { socket, socketLogic } from "./websocket/SocketLogic";

const App = () => {
  useEffect(socketLogic, []);

  return (
    <div className="App">
      {JSON.stringify(socket.connected)}
      <button onClick={() => socket.connect()}>Connect</button>
      <button onClick={() => socket.disconnect()}>Disconnect</button>
      <button onClick={() => socket.emit("JOIN_ROOM", "test123", "Beryl")}>
        Test
      </button>
    </div>
  );
};

export default App;
