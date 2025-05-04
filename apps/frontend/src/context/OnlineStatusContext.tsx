// contexts/OnlineStatusContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import useAuth from "@/hooks/useAuth";

interface OnlineStatusContextType {
  onlineUsers: string[];
  isUserOnline: (userId: string) => boolean;
}

const OnlineStatusContext = createContext<OnlineStatusContextType>({
  onlineUsers: [],
  isUserOnline: () => false,
});

export const OnlineStatusProvider = ({ children, socket }: { children: React.ReactNode, socket: Socket | null }) => {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { auth } = useAuth();

  useEffect(() => {
    if (!socket) return;

    // Initial fetch of online users
    socket.emit("get_online_status", null, (response: { onlineUsers: string[] }) => {
      setOnlineUsers(response.onlineUsers);
    });

    // Listen for user online events
    const handleUserOnline = (userId: string) => {
      setOnlineUsers(prev => [...new Set([...prev, userId])]);
    };

    // Listen for user offline events
    const handleUserOffline = (userId: string) => {
      setOnlineUsers(prev => prev.filter(id => id !== userId));
    };

    socket.on("user_online", handleUserOnline);
    socket.on("user_offline", handleUserOffline);

    // Cleanup
    return () => {
      // socket.off("user_online", handleUserOnline);
      socket.off("user_offline", handleUserOffline);
    };
  }, [socket]);

  // In your context provider, ensure all IDs are stored as numbers

const isUserOnline = (userId: string | number) => {
  const userIdNum = typeof userId === 'string' ? parseInt(userId, 10) : userId;
  return onlineUsers.includes(userIdNum);
};

  return (
    <OnlineStatusContext.Provider value={{ onlineUsers, isUserOnline }}>
      {children}
    </OnlineStatusContext.Provider>
  );
};

export const useOnlineStatus = () => useContext(OnlineStatusContext);