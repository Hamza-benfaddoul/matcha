// contexts/OnlineStatusContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import useAuth from "@/hooks/useAuth";

interface OnlineStatusContextType {
  onlineUsers: string[];
  isUserOnline: (userId: string | number) => boolean;
}

const OnlineStatusContext = createContext<OnlineStatusContextType>({
  onlineUsers: [],
  isUserOnline: () => false,
});

export const OnlineStatusProvider = ({ children, socket }: { children: React.ReactNode, socket: Socket | null }) => {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { auth } = useAuth();
  const currentUserId = auth?.user?.id?.toString();

  useEffect(() => {
    if (!socket) return;

    // Add current user to online users immediately to prevent flickering
    if (currentUserId) {
      setOnlineUsers(prev => {
        if (!prev.includes(currentUserId)) {
          return [...prev, currentUserId];
        }
        return prev;
      });
    }

    // Initial fetch of online users
    socket.emit("get_online_status", null, (response: { onlineUsers: string[] }) => {
      // Always include current user in the list
      const updatedUsers = response.onlineUsers || [];
      if (currentUserId && !updatedUsers.includes(currentUserId)) {
        updatedUsers.push(currentUserId);
      }
      setOnlineUsers([...new Set(updatedUsers)]);
    });

    // Handle user_online events
    const handleUserOnline = (userId: string) => {
      console.log("User online event received:", userId);
      setOnlineUsers(prev => {
        if (!prev.includes(userId)) {
          return [...prev, userId];
        }
        return prev;
      });
    };

    // Handle user_offline events
    const handleUserOffline = (userId: string) => {
      // Don't remove current user on offline events (for page refreshes)
      if (userId === currentUserId) return;
      
      console.log("User offline event received:", userId);
      setOnlineUsers(prev => prev.filter(id => id !== userId));
    };

    // Handle receiving the complete list of online users
    const handleOnlineUsers = (userIds: string[]) => {
      console.log("Online users list received:", userIds);
      // Always include current user
      const updatedList = [...userIds];
      if (currentUserId && !updatedList.includes(currentUserId)) {
        updatedList.push(currentUserId);
      }
      setOnlineUsers([...new Set(updatedList)]);
    };

    // Listen for reconnection events
    const handleReconnect = () => {
      console.log("Socket reconnected, requesting latest online users");
      
      // Request the latest user list
      socket.emit("get_online_status", null, (response: { onlineUsers: string[] }) => {
        const updatedUsers = response.onlineUsers || [];
        if (currentUserId && !updatedUsers.includes(currentUserId)) {
          updatedUsers.push(currentUserId);
        }
        setOnlineUsers([...new Set(updatedUsers)]);
      });
      
      // Inform server we've reconnected
      if (currentUserId) {
        socket.emit("user_reconnect", { userId: currentUserId });
      }
    };

    // Register event listeners
    socket.on("user_online", handleUserOnline);
    socket.on("user_offline", handleUserOffline);
    socket.on("online_users", handleOnlineUsers);
    socket.on("connect", handleReconnect);
    
    // If already connected, request the latest status
    if (socket.connected) {
      handleReconnect();
    }

    // Clean up event listeners
    return () => {
      socket.off("user_online", handleUserOnline);
      socket.off("user_offline", handleUserOffline);
      socket.off("online_users", handleOnlineUsers);
      socket.off("connect", handleReconnect);
    };
  }, [socket, currentUserId]);

  // Check if a user is online
  const isUserOnline = (userId: string | number) => {
    const userIdStr = userId.toString();
    return onlineUsers.includes(userIdStr);
  };

  return (
    <OnlineStatusContext.Provider value={{ onlineUsers, isUserOnline }}>
      {children}
    </OnlineStatusContext.Provider>
  );
};

export const useOnlineStatus = () => useContext(OnlineStatusContext);


// // contexts/OnlineStatusContext.tsx
// import { createContext, useContext, useEffect, useState } from "react";
// import { Socket } from "socket.io-client";
// import useAuth from "@/hooks/useAuth";

// interface OnlineStatusContextType {
//   onlineUsers: string[];
//   isUserOnline: (userId: string) => boolean;
// }

// const OnlineStatusContext = createContext<OnlineStatusContextType>({
//   onlineUsers: [],
//   isUserOnline: () => false,
// });

// export const OnlineStatusProvider = ({ children, socket }: { children: React.ReactNode, socket: Socket | null }) => {
//   const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
//   const { auth } = useAuth();

//   useEffect(() => {
//     if (!socket) return;

//     // Initial fetch of online users
//     socket.emit("get_online_status", null, (response: { onlineUsers: string[] }) => {
//       setOnlineUsers(response.onlineUsers);
//     });

//     // Listen for user online events
//     const handleUserOnline = (userId: string) => {
//       console.log("user online: --==--: ", userId);
//       setOnlineUsers(prev => [...new Set([...prev, userId])]);
//     };

//     // Listen for user offline events
//     const handleUserOffline = (userId: string) => {
//       setOnlineUsers(prev => prev.filter(id => id !== userId));
//     };

//     socket.on("user_online", handleUserOnline);
//     socket.on("user_offline", handleUserOffline);
//     console.log("is user online", onlineUsers);

//     // Cleanup
//     return () => {
//       // socket.off("user_online", handleUserOnline);
//       socket.off("user_offline", handleUserOffline);
//     };
//   }, [socket]);

//   // In your context provider, ensure all IDs are stored as numbers

// const isUserOnline = (userId: string | number) => {
//   const userIdNum = typeof userId === 'string' ? parseInt(userId, 10) : userId;
//   return onlineUsers.includes(userIdNum);
// };

//   return (
//     <OnlineStatusContext.Provider value={{ onlineUsers, isUserOnline }}>
//       {children}
//     </OnlineStatusContext.Provider>
//   );
// };

// export const useOnlineStatus = () => useContext(OnlineStatusContext);