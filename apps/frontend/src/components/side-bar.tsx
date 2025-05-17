import type * as React from "react";
import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import {
  Heart,
  MessageCircle,
  Settings,
  UserRoundSearch,
  Calendar,
  LayoutDashboard,
  CalendarHeart,
} from "lucide-react"; // Import the Help icon

const items = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard className="h-4 w-4 text-primary" />,
    url: "/dashboard",
  },
  {
    name: "Matches",
    icon: <Heart className="h-4 w-4 text-primary" />,
  },
  {
    name: "Messages",
    icon: <MessageCircle className="h-4 w-4 text-primary" />,
    url: "/chat",
  },
  {
    name: "Browse",
    icon: <UserRoundSearch className="h-4 w-4 text-primary" />,
    url: "/search",
  },
  {
    name: "Settings",
    icon: <Settings className="h-4 w-4" />,
  },
];

export function SideBar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link to="/dashboard">
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent mt-2 data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square min-w-8 bg-muted/50 max-w-16 items-center justify-center rounded-lg ">
                  <Heart className="h-6 w-6 text-rose-500" />
                </div>
                <div className="grid flex-1 text-left text-lg leading-tight">
                  <span className="truncate font-semibold">Matcha</span>
                </div>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <Link to={item.url} key={item.name}>
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton>
                      {item.icon}
                      <span>{item.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </Link>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Schedule</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link to="/dates">
                  <SidebarMenuButton>
                    <CalendarHeart className="h-4 w-4 text-primary" />
                    <span>Dates</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link to="/calendar">
                  <SidebarMenuButton>
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>Calendar</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
