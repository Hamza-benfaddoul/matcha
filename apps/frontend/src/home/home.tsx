// components/Home.tsx
import useAuth from "@/hooks/useAuth";
import useSocket from "@/hooks/useSocket";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { auth } = useAuth();
  const [message, setMessage] = useState("");
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleResponse = (data: { message: string }) => {
      console.log("Received message:", data);
      setMessage(data.message);
    };

    socket.on("test-connection-response", handleResponse);

    return () => {
      socket.off("test-connection-response", handleResponse);
    };
  }, [socket]);

  const sendMessage = () => {
    if (socket?.connected) {
      socket.emit("test-connection", {
        text: "Hello from client",
        timestamp: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="border-2 bg-gray-50 h-screen flex flex-col justify-center">
      <h1 className="text-3xl text-center text-red-400 font-bold underline">
        Protected route
      </h1>
      <div className="text-center">
        <p>User Data: {JSON.stringify(auth.user)}</p>
      </div>
      <div className="flex flex-col  justify-around  mt-4 border-2 bg-gray-50 p-4 rounded-lg">
        <div>
          <p>
            Connection Status:{" "}
            {isConnected ? "✅ Connected" : "❌ Disconnected"}
          </p>
          <p>Socket ID: {socket?.id || "Not connected"}</p>
        </div>
        <div>
          <Button onClick={sendMessage} disabled={!isConnected}>
            Send Test Message
          </Button>
          <p className="mt-2">Server Response: {message}</p>
        </div>
      </div>
    </div>
  );
}
