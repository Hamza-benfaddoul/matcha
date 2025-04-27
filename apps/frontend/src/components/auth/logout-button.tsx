import { axiosPrivate } from "@/api/axios";
import { useNavigate } from "react-router-dom";

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      await axiosPrivate.get("/logout");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};
