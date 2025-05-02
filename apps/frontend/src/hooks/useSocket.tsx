import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import useAuth from "@/hooks/useAuth";

const BASE_URL = "http://localhost:8080";

export default function useSocket(namespace = "") {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { auth } = useAuth();
  const token = auth?.accessToken;

  useEffect(() => {
    if (!token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    if (!socketRef.current) {
      // Connect to specific namespace
      const socket = io(`${BASE_URL}${namespace}`, {
        path: "/ws/socket.io",
        withCredentials: true,
        transports: ["websocket"],
        auth: { token, userId: auth.user.id },
        autoConnect: true,
      });

      socket.on("connect", () => {
        setIsConnected(true);
        console.log(`Connected to namespace ${namespace}`);
      });

      socket.on("disconnect", () => {
        setIsConnected(false);
        console.log(`Disconnected from namespace ${namespace}`);
      });

      socket.on("connect_error", (err) => {
        console.error(`Connection error (${namespace}):`, err);
      });

      socketRef.current = socket;
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
    };
  }, [token, namespace]);

  return {
    socket: socketRef.current,
    isConnected,
  };
}
