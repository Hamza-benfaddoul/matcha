'use client';

import React, {
  createContext,
  useState
} from "react";

// Define the types for the auth context
interface AuthContextType {
  auth: {
    accessToken: string | null;
    user: any; // You can replace `any` with a more specific type for the user
  };
  setAuth: React.Dispatch<React.SetStateAction<{
    accessToken: string | null;
    user: any;
  }>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<{

    accessToken: string | null;
    user: any;

  }>({});

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext;
