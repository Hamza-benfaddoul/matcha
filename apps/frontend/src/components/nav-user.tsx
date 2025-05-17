import { BadgeCheck, LockIcon, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { GoBlocked } from "react-icons/go";

import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "./auth/logout-button";

export function NavUser() {
  const {
    auth: { user },
  } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex gap-2  w-full items-center cursor-pointer  justify-center data-[state=open]:text-sidebar-accent-foreground">
          <Avatar className="h-8 w-8 rounded-lg">
            {user?.profile_picture ? (
              <AvatarImage
                src={
                  user.profile_picture.startsWith("/")
                    ? `/api${user.profile_picture}`
                    : user.profile_picture
                }
                alt={user?.firstname}
              />
            ) : (
              <AvatarImage
                src={`${user?.google_picture}`}
                alt={user?.firstname}
              />
            )}
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
          <div className="sm:flex flex-col text-left text-sm leading-tight hidden">
            <span className="truncate font-semibold">{user?.firstname}</span>
            <span className="truncate text-xs">{user?.lastname}</span>
          </div>
          <CaretSortIcon className="ml-auto size-4 hidden sm:flex" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side={"bottom"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm ">
            <Avatar className="h-8 w-8 rounded-lg">
              {user?.profile_picture ? (
                <AvatarImage
                  src={
                    user.profile_picture.startsWith("/")
                      ? `/api${user.profile_picture}`
                      : user.profile_picture
                  }
                  alt={user?.firstname}
                />
              ) : (
                <AvatarImage
                  src={`${user?.google_picture}`}
                  alt={user?.firstname}
                />
              )}
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                {user?.firstname} {user?.lastname}
              </span>
              <span className="truncate text-xs">{user?.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user?.isprofilecomplete && (
          <>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link
                  to="/change-password"
                  className="flex w-full items-center gap-1"
                >
                  <LockIcon className="w-4 h-4" />
                  Change password
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link
                  to={`/profile/${user.id}`}
                  className="flex w-full items-center gap-1"
                >
                  <BadgeCheck className="w-4 h-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link to={`/blocks`} className="flex w-full items-center gap-1">
                  <GoBlocked className="w-4 h-4" />
                  Blocked Users
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </>
        )}
        <LogoutButton>
          <DropdownMenuItem>
            <Button
              variant="link"
              className="justify-start text-destructive p-0 w-full"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </Button>
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
