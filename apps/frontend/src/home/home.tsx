import useAuth from "@/hooks/useAuth";
import useSocket from "@/hooks/useSocket";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { auth } = useAuth();
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!socket) return;

    // Event listeners
    socket.on("connect", () => {
      console.log("Connected to WebSocket");
      setConnected(true);
    });

    socket.on("test-connection-response", (message) => {
      console.log("Received message:", message);
      setMessage(message.message);
    });

    // Cleanup listeners
    return () => {
      socket.off("connect");
      socket.off("new-message");
    };
  }, [socket]);

  const sendMessage = () => {
    if (connected) {
      socket.emit("test-connection", {
        text: "Hello from client",
        timestamp: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="border-2 bg-gray-50 h-screen flex flex-col justify-center ">
      <h1 className="text-3xl  text-center text-red-400 font-bold underline">
        Protected rout
      </h1>
      <div className="text-center">
        User Data
        <br />
        {JSON.stringify(auth.user)}
      </div>
      <div className="text-center">
        AccessToken
        <br />
        {JSON.stringify(auth.accessToken)}
      </div>
      <br />
      <div className="text-center">
        <Button onClick={sendMessage} disabled={!connected}>
          Send Test Message
        </Button>
        <p>Status: {connected ? "Connected" : "Disconnected"}</p>
        <p>Message: {message}</p>
      </div>
    </div>
  );
}
