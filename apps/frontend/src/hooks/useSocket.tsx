import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import useAuth from "@/hooks/useAuth";

const BASE_URL = "http://localhost:8080";

// Global socket instance cache to persist across page refreshes
const socketInstances: Record<string, Socket> = {};

export default function useSocket(namespace = "") {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { auth } = useAuth();
  const token = auth?.accessToken;
  const userId = auth?.user?.id;

  // Generate a unique key for this namespace
  const instanceKey = namespace || "default";

  useEffect(() => {
    if (!token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    // Use existing socket or create a new one
    if (!socketInstances[instanceKey]) {
      console.log(`Creating new socket connection for namespace: ${namespace}`);
      
      const socket = io(`${BASE_URL}${namespace}`, {
        path: "/ws/socket.io",
        withCredentials: true,
        transports: ["websocket"],
        auth: { 
          token, 
          userId 
        },
        autoConnect: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      });
      
      socketInstances[instanceKey] = socket;
    } else {
      console.log(`Reusing existing socket for namespace: ${namespace}`);
    }
    
    socketRef.current = socketInstances[instanceKey];

    const onConnect = () => {
      setIsConnected(true);
      console.log(`Socket connected to ${namespace} with ID: ${socketRef.current?.id}`);
      
      // Notify server of reconnection to maintain user presence
      if (socketRef.current && userId) {
        console.log(`Sending user_reconnect event for userId: ${userId}`);
        socketRef.current.emit("user_reconnect", { userId });
      }
    };

    const onDisconnect = (reason: string) => {
      setIsConnected(false);
      console.log(`Socket disconnected from ${namespace}, reason: ${reason}`);
    };

    const onConnectError = (err: Error) => {
      console.error(`Socket connection error (${namespace}):`, err);
    };

    // Set up event listeners
    const socket = socketRef.current;
    if (socket) {
      // Remove any existing listeners to prevent duplicates
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      
      // Add listeners
      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);
      socket.on("connect_error", onConnectError);
      
      // Update connection state
      setIsConnected(socket.connected);
      
      // If already connected, trigger reconnect manually
      if (socket.connected && userId) {
        console.log(`Socket already connected, sending user_reconnect event`);
        socket.emit("user_reconnect", { userId });
      }
    }

    // Cleanup function - only remove event listeners
    return () => {
      if (socketRef.current) {
        socketRef.current.off("connect", onConnect);
        socketRef.current.off("disconnect", onDisconnect);
        socketRef.current.off("connect_error", onConnectError);
      }
    };
  }, [token, namespace, userId]);

  // Public API for cleanup (used for logout, etc.)
  const disconnect = () => {
    if (socketInstances[instanceKey]) {
      socketInstances[instanceKey].disconnect();
      delete socketInstances[instanceKey];
    }
    socketRef.current = null;
    setIsConnected(false);
  };

  return {
    socket: socketRef.current,
    isConnected,
    disconnect,
  };
}


// import { useEffect, useRef, useState } from "react";
// import { io, Socket } from "socket.io-client";
// import useAuth from "@/hooks/useAuth";

// const BASE_URL = "http://localhost:8080";

// export default function useSocket(namespace = "") {
//   const socketRef = useRef<Socket | null>(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const { auth } = useAuth();
//   const token = auth?.accessToken;

//   useEffect(() => {
//     if (!token) {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//         socketRef.current = null;
//         setIsConnected(false);
//       }
//       return;
//     }

//     if (!socketRef.current) {
//       // Connect to specific namespace
//       const socket = io(`${BASE_URL}${namespace}`, {
//         path: "/ws/socket.io",
//         withCredentials: true,
//         transports: ["websocket"],
//         auth: { token, userId: auth.user.id },
//         autoConnect: true,
//       });

//       socket.on("connect", () => {
//         setIsConnected(true);
//         // console.log(`Connected to namespace ${namespace}`);
//       });

//       socket.on("disconnect", () => {
//         setIsConnected(false);
//         // console.log(`Disconnected from namespace ${namespace}`);
//       });

//       socket.on("connect_error", (err) => {
//         console.error(`Connection error (${namespace}):`, err);
//       });

//       socketRef.current = socket;
//     }

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//         socketRef.current = null;
//         setIsConnected(false);
//       }
//     };
//   }, [token, namespace]);

//   return {
//     socket: socketRef.current,
//     isConnected,
//   };
// }
