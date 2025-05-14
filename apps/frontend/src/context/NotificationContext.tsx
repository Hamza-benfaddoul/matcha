// contexts/NotificationContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";

interface Notification {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  metadata?: Record<string, any>;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  addNotification: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  clearNotifications: () => {},
});

export const NotificationProvider = ({ 
  children, 
  socket 
}: { 
  children: React.ReactNode, 
  socket: Socket | null 
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!socket) return;

    // Listen for new notifications from server
    const handleNewNotification = (notification: Notification) => {
      setNotifications(prev => [{
        ...notification,
        createdAt: new Date(notification.createdAt)
      }, ...prev]);
      setUnreadCount(prev => prev + 1);
    };

    // Listen for initial notifications load
    const handleInitialNotifications = (notifications: Notification[]) => {
        console.log("Initial notifications received:", notifications);
      const formatted = notifications.map(n => ({
        ...n,
        createdAt: new Date(n.createdAt)
      }));
      setNotifications(formatted);
      setUnreadCount(formatted.filter(n => !n.isRead).length);
    };

    socket.on("new_notification", handleNewNotification);
    socket.on("initial_notifications", handleInitialNotifications);

    // Request initial notifications
    socket.emit("get_notifications");

    return () => {
      socket.off("new_notification", handleNewNotification);
      socket.off("initial_notifications", handleInitialNotifications);
    };
  }, [socket]);

  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      createdAt: new Date()
    };
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === id ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => prev - 1);
    socket?.emit("mark_as_read", id);
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
    setUnreadCount(0);
    socket?.emit("mark_all_as_read");
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
    socket?.emit("clear_notifications");
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount,
      addNotification,
      markAsRead, 
      markAllAsRead,
      clearNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);