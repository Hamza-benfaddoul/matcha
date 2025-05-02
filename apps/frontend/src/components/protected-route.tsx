import useAuth from "@/hooks/useAuth";
import useRefreshToken from "@/hooks/useRefreshToken";
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import NavBar from "./nav-bar";

interface ProtectedRouteProps {
  element: React.ReactElement;
}
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { SideBar } from "@/components/side-bar";
import { Separator } from "@/components/ui/separator";
import { SearchBar } from "@/components/search-bar";

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { auth } = useAuth();
  const { refresh } = useRefreshToken(); // Ensure that refresh is a function
  const [loading, setLoading] = useState(true);

  const { pathname } = useLocation();

  useEffect(() => {
    const verifyToken = async () => {
      await refresh(); // Call the refresh function
      setLoading(false); // Stop loading after refreshing token
    };

    if (!auth?.accessToken) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, [auth, loading, refresh]);

  if (loading) return <div>Loading...</div>; // or a spinner component
  if (auth?.accessToken) {
    if (
      ["/", "/login", "/register", "/reset", "new-verification"].includes(
        pathname,
      )
    )
      return <Navigate to="/dashboard" />;
    else {
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
                {/* <BreadcrumbNav /> */}
                <SearchBar />
                <div className="flex gap-4 justify-end items-center ml-auto mr-4 ">
                  <NavBar />
                  {/* <ModeToggle /> */}
                </div>
              </header>
              <main className="bg-muted/50 flex-grow overflow-auto  sm:p-4">
                {element}
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      );
    }
  } else return <Navigate to="/login" />;
};

export default ProtectedRoute;
