'use client'
import { useCurrentUser } from '@/hooks/use-current-user'

import { FaUser } from 'react-icons/fa'

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

export const UserButton = () => {
  const user = useCurrentUser()
   
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image || ''} />
          <AvatarFallback>
            <FaUser />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
    </DropdownMenu>
  )
}
