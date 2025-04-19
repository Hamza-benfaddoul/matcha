import useAuth from "@/hooks/useAuth";
import useRefreshToken from "@/hooks/useRefreshToken";
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  element: React.ReactElement;
}

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
      return <Navigate to="/protected" />;
    if (
      auth?.user.isprofilecomplete === true ||
      pathname == "/complete-profile"
    ) {
      return element;
    } else return <Navigate to="/complete-profile" />;
  } else return <Navigate to="/login" />;
};

export default ProtectedRoute;
