"use client"

import { useState, useEffect } from "react"
import { io } from "socket.io-client"
import ChatSidebar from "@/components/chat/ChatSidebar"
import ChatWindow from "@/components/chat/ChatWindow"
import useAuth from "@/hooks/useAuth"
import useSocket from "@/hooks/useSocket"
import axios from "axios"


function Chat() {
//   const [socket, setSocket] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [activeChat, setActiveChat] = useState(null)
  const [contacts, setContacts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768)
  const [showSidebar, setShowSidebar] = useState(true)
  const { auth } = useAuth()
  const { socket, isConnected } = useSocket('/chat')
  const [typingStatus, setTypingStatus] = useState({});

  // Initialize socket connection
  useEffect(() => {
    // In a real app, you would get the user from your auth system
    fetchContacts();
    setCurrentUser(auth.user)
  }, [])

  // Handle socket events
  useEffect(() => {
    if (!socket) return

    // Fetch contacts/conversations when socket connects
    socket.on("connect", () => {
      console.log("Connected to socket server")
      // fetchContacts()
    })

    socket.on("disconnect", () => {
      console.log("Disconnected from socket server")
    })

    socket.on("user_online", (userId) => {
      console.log("User online:", userId)
      setContacts((prev) => prev.map((contact) => (contact.id === userId ? { ...contact, isOnline: true } : contact)))
    })

    socket.on("user_offline", (userId) => {
      console.log("User offline:", userId)
      setContacts((prev) => prev.map((contact) => (contact.id === userId ? { ...contact, isOnline: false } : contact)))
    })

    socket.on("user_typing", ({ userId, isTyping }) => {
      setTypingStatus(prev => ({
        ...prev,
        [userId]: isTyping
      }));
    });

    socket.on("new_message", (message) => {
      // Handle incoming messages
      console.log("New message:", message)
      if (activeChat && activeChat.id === message.senderId) {
        // If the message is from the active chat, update the messages
        setActiveChat((prev) => ({
          ...prev,
          messages: [...prev.messages, message],
        }))
      } else {
        // Otherwise, update the unread count for the contact
        setContacts((prev) =>
          prev.map((contact) =>
            contact.id === message.senderId ? { ...contact, unreadCount: (contact.unreadCount || 0) + 1 } : contact,
          ),
        )
      }
    })

    socket.on("incoming_call", ({ callerId, callerName }) => {
      setContacts(prev => prev.map(contact => 
        contact.id === callerId ? { ...contact, isIncomingCall: true } : contact
      ))
      
      // If this caller is the active chat, show call UI
      if (activeChat?.id === callerId) {
        setActiveChat(prev => ({
          ...prev,
          isInCall: true,
          isIncomingCall: true
        }))
      }
    })

    return () => {
      socket.off("connect")
      socket.off("disconnect")
      // socket.off("user_online")
      socket.off("user_offline")
      socket.off("new_message")
      socket.off("user_typing");
      socket.off("incoming_call")
    }
  }, [socket, activeChat, contacts])

  const handleTyping = (isTyping) => {
    if (!socket || !activeChat) return;
    
    socket.emit("typing", {
      recipientId: activeChat.id,
      isTyping
    });
  };

  const handleMessageChange = (e) => {
    // You'll call this from your ChatWindow when the input changes
    const hasText = e.target.value.length > 0;
    handleTyping(hasText);
  };

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobileView(mobile)
      if (!mobile) setShowSidebar(true)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Mock function to fetch contacts - in a real app, this would be an API call
  const fetchContacts = async () => {
    setIsLoading(true)
      const contactResponse = await axios.get("/api/user/chat/get-contact")
      setContacts(contactResponse.data)
      setIsLoading(false)
    // }, 1000)
  }

  // Handle selecting a chat
  const handleSelectChat = async (contact) => {
    if (isMobileView) {
      setShowSidebar(false)
    }

    // Mark messages as read
    setContacts((prev) => prev.map((c) => (c.id === contact.id ? { ...c, unreadCount: 0 } : c)))

    // Fetch chat history - in a real app, this would be an API call
    const chatHistory = await axios.get(`/api/user/chat/get-messages`, { params: { userId: currentUser.id, contactId: contact.id } })
    setTimeout(() => {
      const mockMessages = [
        {
          id: 1,
          senderId: contact.id,
          receiverId: currentUser.id,
          content: "Hey there!",
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          type: "text",
        },
        {
          id: 2,
          senderId: currentUser.id,
          receiverId: contact.id,
          content: "Hi! How are you?",
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          type: "text",
        },
        {
          id: 3,
          senderId: contact.id,
          receiverId: currentUser.id,
          content: "I'm good, thanks! How about you?",
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          type: "text",
        },
      ]

      setActiveChat({
        ...contact,
        messages: chatHistory.data,
        isInCall: false,
      })
    }, 500)
  }

  // Handle sending a message
  const handleSendMessage = (content, type = "text") => {
    if (!socket || !activeChat) return;
  
    const message = {
      id: Date.now(),
      senderId: currentUser.id,
      receiverId: activeChat.id,
      content,
      timestamp: new Date().toISOString(),
      type,
    };
  
    // Update local state
    setActiveChat((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  
    // Send message via socket
    socket.emit("send_message", message);
  
    // Update last message in contacts
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === activeChat.id
          ? {
              ...contact,
              lastMessage: type === 'audio' ? 'Audio message' : content,
              lastMessageTime: message.timestamp,
            }
          : contact,
      ),
    );
  };

  // Handle starting/ending audio call
  const handleToggleCall = () => {
    if (!activeChat) return
  
    const isInCall = !activeChat.isInCall
  
    setActiveChat((prev) => ({
      ...prev,
      isInCall,
      isIncomingCall: false // Add this to track call direction
    }))
  
    if (isInCall) {
      // Start call logic
      socket.emit("start_call", {
        callerId: currentUser.id,
        receiverId: activeChat.id
      })
    } else {
      // End call logic
      socket.emit("end_call", {
        userId: currentUser.id,
        otherUserId: activeChat.id
      })
    }
  }

  // Toggle sidebar for mobile view
  const toggleSidebar = () => {
    setShowSidebar((prev) => !prev)
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Mobile menu button */}
      {isMobileView && (
        <button
          className="absolute top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md"
          onClick={toggleSidebar}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-menu"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>
      )}

      {/* Chat sidebar */}
      <div
        className={`${showSidebar ? "flex" : "hidden"} ${isMobileView ? "absolute inset-0 z-40" : "w-1/3"} flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}
      >
        <ChatSidebar
          currentUser={currentUser}
          contacts={contacts}
          activeChat={activeChat}
          onSelectChat={handleSelectChat}
          isLoading={isLoading}
        />
      </div>

      {/* Chat window */}
      <div className={`${isMobileView ? (showSidebar ? "hidden" : "flex") : "flex"} flex-1 flex-col`}>
        {activeChat ? (
          <ChatWindow
            currentUser={currentUser}
            activeChat={activeChat}
            onSendMessage={handleSendMessage}
            onToggleCall={handleToggleCall}
            onBackClick={isMobileView ? toggleSidebar : undefined}
            onMessageChange={handleMessageChange}
            typingStatus={typingStatus}
            onTyping={handleTyping}
            socket={socket}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Welcome to Chat</h2>
              <p className="text-gray-500 dark:text-gray-400">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Chat;
