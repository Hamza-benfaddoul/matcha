// App.tsx
import { Outlet } from "react-router-dom";
import useSocket from "@/hooks/useSocket";
import { OnlineStatusProvider } from "@/context/OnlineStatusContext";
import { NotificationProvider } from "@/context/NotificationContext";

interface AppProps {
  children?: React.ReactNode;
}

export default function App({ children }: AppProps) {
  // Main connection for online status
  const { socket: onlineSocket } = useSocket('/online');
  // Separate connection for notifications
  const { socket: notificationSocket } = useSocket('/notifications');
  
  return (
    <div className="app">
      <OnlineStatusProvider socket={onlineSocket}>
        <NotificationProvider socket={notificationSocket}>
          {children || <Outlet />}
        </NotificationProvider>
      </OnlineStatusProvider>
    </div>
  );
}