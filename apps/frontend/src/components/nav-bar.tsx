import { Button } from "@/components/ui/button";

import { Bell, MessageCircle } from "lucide-react";
import { NavUser } from "./nav-user";
import { Link } from "react-router-dom";
import NotificationBell from "./NotificationBell";

const NavBar = () => {
  return (
    <div className="flex items-center gap-4">
      <NotificationBell />
      {/* <Button variant="outline" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs text-white">
          3
        </span>
      </Button> */}
      <Link to={"/chat"}>
        <Button variant="outline" size="icon">
          <MessageCircle className="h-5 w-5" />
        </Button>
      </Link>
      <NavUser />
    </div>
  );
};

export default NavBar;
