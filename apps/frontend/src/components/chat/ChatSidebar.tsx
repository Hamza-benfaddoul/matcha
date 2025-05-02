"use client"

import { useState } from "react"
import { Search, Plus } from "lucide-react"

const ChatSidebar = ({ currentUser, contacts, activeChat, onSelectChat, isLoading }) => {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

 
  const formatTime = (isoString) => {
    const date = new Date(isoString)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()

    if (isToday) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  return (
    <>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Messages</h1>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <Plus size={20} />
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full p-2 pl-10 rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Contacts list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-500 dark:text-gray-400">
            No conversations found
          </div>
        ) : (
          <ul>
            {filteredContacts.map((contact) => (
              <li
                key={contact.id}
                className={`p-3 flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
                  activeChat && activeChat.id === contact.id ? "bg-gray-100 dark:bg-gray-700" : ""
                }`}
                onClick={() => onSelectChat(contact)}
              >
                <div className="relative">
                  <img
                    src={contact.profile_picture.startsWith("/")
                        ? `/api${contact.profile_picture}`
                        : contact.profile_picture
                    }
                    alt={`${contact.firstname} ${contact.lastname}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {contact.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                  )}
                </div>
                <div className="ml-3 flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold truncate">{`${contact.firstname} ${contact.lastname}`}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTime(contact.lastmessagetime)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{contact.lastMessage}</p>
                    {contact.unreadCount > 0 && (
                      <span className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {contact.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* User profile */}
      {currentUser && (
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex items-center">
          <img
            src={currentUser.profile_picture.startsWith("/")
              ? `/api${currentUser.profile_picture}`
              : currentUser.profile_picture
          }
            alt={`${currentUser.firstname} ${currentUser.lastname}`}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="ml-3">
            <h3 className="font-semibold">{`${currentUser.firstname} ${currentUser.lastname}`}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">@{currentUser.username}</p>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatSidebar
