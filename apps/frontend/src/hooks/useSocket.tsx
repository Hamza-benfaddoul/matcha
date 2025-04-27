import { useEffect, useRef } from "react";
import useAuth from "@/hooks/useAuth";
import { io, Socket } from "socket.io-client";

const BASE_URL = "http://localhost:8080/";

export default function useSocket() {
  const socketRef = useRef<Socket | null>(null);

  const { auth } = useAuth();
  const token = auth?.accessToken;

  useEffect(() => {
    if (!token || socketRef.current) return;

    // Initialize socket connection
    const socket = io(BASE_URL, {
      path: "/ws/socket.io",
      withCredentials: true,
      transports: ["websocket"],
      auth: { token },
    });
    socketRef.current = socket;

    // Cleanup function
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  return socketRef.current;
}
