"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { User, X, Shield } from "lucide-react"
import useAuth from "@/hooks/useAuth"

interface BlockedUser {
  blocked_id: number
  user_id: number
  firstname: string
  lastname: string
  username: string
  email: string
  profile_picture: string
  fame_rating: number
  location_latitude: string
  location_longitude: string
  gender: string
  biography: string
}

const BlockLists = () => {
  const { id } = useParams()
  const [blockLists, setBlockLists] = useState<BlockedUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { auth } = useAuth()

  const fetchBlockLists = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`/api/user/block/lists`)
      console.log("Response:", response.data.blocks)
      setBlockLists(response.data.blocks)
    } catch (error) {
      console.error("Error fetching block lists:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnblock = async (blockedId: number) => {
    try {
      // Make API call to unblock the user
      await axios.post(`/api/user/block/remove`, {
          blocked_id: blockedId,
          blocker_id: auth.user.id,
      })

      // Refresh the block list
      fetchBlockLists()
    } catch (error) {
      console.error("Error unblocking user:", error)
    }
  }

  useEffect(() => {
    fetchBlockLists()
  }, [id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Blocked Users</h1>
          <p className="text-lg text-gray-600">
            Users you've blocked cannot view your profile, send you messages, or interact with you.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-red-500 mr-3" />
              <h2 className="text-xl font-semibold text-gray-800">
                {blockLists.length === 0
                  ? "You haven't blocked any users"
                  : `You have blocked ${blockLists.length} ${blockLists.length === 1 ? "user" : "users"}`}
              </h2>
            </div>
          </div>

          {blockLists.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <User className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Blocked Users</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                When you block someone, they will appear here. Blocked users cannot view your profile or send you
                messages.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {blockLists.map((user) => (
                <li key={user.blocked_id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {user.profile_picture ? (
                          <img
                            // src={user.profile_picture || "/placeholder.svg"}
                            src={user.profile_picture.startsWith("/")
                                ? `/api${user.profile_picture}`
                                : user.profile_picture
                            }
                            alt={`${user.firstname} ${user.lastname}`}
                            className="h-14 w-14 rounded-full object-cover border-2 border-gray-200"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder.svg?height=56&width=56"
                            }}
                          />
                        ) : (
                          <div className="h-14 w-14 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-8 w-8 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {user.firstname} {user.lastname}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 space-y-1 sm:space-y-0 sm:space-x-4">
                          <span>@{user.username}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>{user.email}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleUnblock(user.blocked_id)}
                      className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Unblock
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Blocking is a safety feature that helps you control your experience.
            <br />
            If you're experiencing harassment, please report it to our support team.
          </p>
        </div>
      </div>
    </div>
  )
}

export default BlockLists
