import { useContext } from "react";
import AuthContext from "@/context/AuthProvider";

// Define the shape of the auth object
interface Auth {
  accessToken: string | null;
  user: any; // You can replace 'any' with a more specific user type
}

interface AuthContextType {
  auth: Auth;
  setAuth: React.Dispatch<React.SetStateAction<Auth>>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;
