// App.tsx
import { Outlet } from "react-router-dom";
import useSocket from "@/hooks/useSocket";
import { OnlineStatusProvider } from "@/context/OnlineStatusContext";

interface AppProps {
  children?: React.ReactNode;
}

export default function App({ children }: AppProps) {
  const { socket } = useSocket('/online');
  console.log("App component rendered"); // This should now log
  
  return (
    <div className="app">
      <OnlineStatusProvider socket={socket}>
        {children || <Outlet />}
      </OnlineStatusProvider>
    </div>
  );
}