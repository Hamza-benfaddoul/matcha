import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import useRefreshToken from "@/hooks/useRefreshToken";
import NavBar from "./nav-bar";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { SideBar } from "@/components/side-bar";
import { Separator } from "@/components/ui/separator";
import { SearchBar } from "@/components/search-bar";

interface ProtectedRouteProps {
  element: React.ReactElement;
}

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/reset",
  "/new-verification",
];
const AUTH_REDIRECT_ROUTES = [...PUBLIC_ROUTES];
const PROFILE_ONLY_ROUTES = ["/complete-profile"];

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { auth } = useAuth();
  const { refresh } = useRefreshToken();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    let isMounted = true;

    const verifyToken = async () => {
      try {
        await refresh();
        if (isMounted) setLoading(false);
      } catch (err) {
        console.error("Token refresh error:", err);
        if (isMounted) {
          setError("Failed to refresh token. Please try again.");
          setLoading(false);
        }
      }
    };

    if (!auth?.accessToken) {
      verifyToken();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [auth?.accessToken, refresh]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  // User is authenticated
  if (auth?.accessToken) {
    // Redirect if trying to access public routes while logged in
    if (AUTH_REDIRECT_ROUTES.includes(pathname)) {
      return <Navigate to="/dashboard" replace />;
    }

    // Handle profile completion route
    if (PROFILE_ONLY_ROUTES.includes(pathname)) {
      return auth.user.isprofilecomplete ? (
        <Navigate to="/dashboard" replace />
      ) : (
        <div className="flex w-full h-screen justify-center items-center overflow-hidden">
          {element}
        </div>
      );
    }

    // Render protected layout
    return (
      <SidebarProvider>
        <div className="flex w-full h-screen overflow-hidden">
          <SideBar />
          <SidebarInset className="flex flex-col flex-grow overflow-hidden">
            <header className="flex bg-sidebar h-16 shrink-0 items-center gap-2 transition-all duration-300 ease-in-out border-b border-border">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
              </div>
              <SearchBar />
              <div className="flex gap-4 justify-end items-center ml-auto mr-4">
                <NavBar />
              </div>
            </header>
            <main className="bg-muted/50 flex-grow overflow-auto sm:p-4">
              {element}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  // User is not authenticated
  if (PUBLIC_ROUTES.includes(pathname)) {
    if (pathname === "/") return element;
    else
      return (
        <div className="flex w-full h-screen justify-center items-center overflow-hidden">
          {element}
        </div>
      );
  }

  // Default case - redirect to login for any other protected route
  return <Navigate to="/login" state={{ from: pathname }} replace />;
};

export default ProtectedRoute;
