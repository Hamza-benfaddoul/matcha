'use client'
import {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
  useEffect,
} from 'react'

import { useUserStore } from '@/hooks/use-current-user'

import { User } from '../types/User'

const AuthContext = createContext<User | undefined>(undefined)

type AuthProviderProps = PropsWithChildren & {
  children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const currentUser = useUserStore((state) => state.user)
  const [user, setUser] = useState<User | undefined>(currentUser)
  console.log('User', currentUser)

  useEffect(() => {
    setUser(currentUser)
  }, [currentUser])

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  return context
}
