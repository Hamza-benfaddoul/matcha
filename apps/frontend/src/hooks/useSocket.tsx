// hooks/useSocket.ts
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import useAuth from "@/hooks/useAuth";

const BASE_URL = "http://localhost:8080/";

export default function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { auth } = useAuth();
  const token = auth?.accessToken;

  useEffect(() => {
    if (!token) {
      // Disconnect if no token
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    // Initialize new connection if needed
    if (!socketRef.current) {
      const socket = io(BASE_URL, {
        path: "/ws/socket.io",
        withCredentials: true,
        transports: ["websocket"],
        auth: { token },
        autoConnect: true,
      });

      // Connection events
      socket.on("connect", () => {
        setIsConnected(true);
        console.log("Socket connected");
      });

      socket.on("disconnect", () => {
        setIsConnected(false);
        console.log("Socket disconnected");
      });

      socket.on("connect_error", (error) => {
        console.error("Connection error:", error);
        setIsConnected(false);
      });

      socketRef.current = socket;
    }

    // Reconnect if token changes
    else if (socketRef.current.auth.token !== token) {
      socketRef.current.auth.token = token;
      socketRef.current.disconnect().connect();
    }

    return () => {
      // Don't disconnect here - keep connection alive
      // Only cleanup state
      setIsConnected(false);
    };
  }, [token]);

  return {
    socket: socketRef.current,
    isConnected,
  };
}
