import type * as React from "react";
// import Image from "next/image";

// import { NavMain } from "@/components/nav-main";
// import { NavProjects } from "@/components/nav-projects";
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
  Search,
  Settings,
  Star,
  Users,
  Calendar,
} from "lucide-react"; // Import the Help icon

const items = [
  {
    name: "Dashboard",
    icon: <Users className="h-4 w-4" />,
    url: "/dashboard",
  },
  {
    name: "Matches",
    icon: <Heart className="h-4 w-4" />,
  },
  {
    name: "Messages",
    icon: <MessageCircle className="h-4 w-4" />,
  },
  {
    name: "Search",
    icon: <Search className="h-4 w-4" />,
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
          <SidebarGroupLabel>Events</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Calendar className="h-4 w-4" />
                  <span>Upcoming</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Star className="h-4 w-4" />
                  <span>Featured</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* <SidebarFooter> */}
      {/*   <div className="flex items-center space-x-2 p-4"> */}
      {/*     <HelpCircle /> */}
      {/*     <span>Help</span> */}
      {/*   </div> */}
      {/* </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  );
}
