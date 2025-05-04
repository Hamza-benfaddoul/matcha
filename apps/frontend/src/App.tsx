import { Outlet } from "react-router-dom";
import useSocket from "@/hooks/useSocket";
import { OnlineStatusProvider } from "@/context/OnlineStatusContext";
import React from "react";

interface AppProps {
    children?: React.ReactNode;
}

export default function App({ children }: AppProps) {
    const { socket } = useSocket('/online');
    
    return (
        <div className="app">
            <OnlineStatusProvider socket={socket}>
                {children || <Outlet />}
            </OnlineStatusProvider>
        </div>
    );
}