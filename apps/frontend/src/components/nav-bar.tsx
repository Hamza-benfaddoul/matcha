import { Button } from "@/components/ui/button";

import { Bell, Heart, MessageCircle } from "lucide-react";
import { NavUser } from "./nav-user";

const NavBar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="mx-auto max-w-7xl w-full flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-rose-500" />
          <span className="text-xl font-bold">Matcha</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs text-white">
              3
            </span>
          </Button>
          <Button variant="outline" size="icon">
            <MessageCircle className="h-5 w-5" />
          </Button>
          <NavUser />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
