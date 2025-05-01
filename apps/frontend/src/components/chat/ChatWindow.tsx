"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Mic, MicOff, Phone, PhoneOff, ArrowLeft } from "lucide-react"
import MessageBubble from "./MessageBubble"
import AudioCallPanel from "./AudioCallPanel"


const ChatWindow = ({ currentUser, activeChat, onSendMessage, onToggleCall, onBackClick, onMessageChange, typingStatus, onTyping, socket  }) => {
  const [message, setMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordingInterval, setRecordingInterval] = useState(null)
  const messagesEndRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [activeChat?.messages])

  // Clean up recording when component unmounts
  useEffect(() => {
    return () => {
      if (recordingInterval) {
        clearInterval(recordingInterval)
      }
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop()
      }
    }
  }, [recordingInterval])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message.trim())
      setMessage("")
      onTyping(false) // Stop typing indication when message is sent
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/mp3" })
        const audioUrl = URL.createObjectURL(audioBlob)
        onSendMessage(audioUrl, "audio")

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)

      // Start timer
      let seconds = 0
      const interval = setInterval(() => {
        seconds++
        setRecordingTime(seconds)
      }, 1000)

      setRecordingInterval(interval)
    } catch (err) {
      console.error("Error accessing microphone:", err)
      alert("Could not access microphone. Please check your permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      clearInterval(recordingInterval)
      setRecordingInterval(null)
      setIsRecording(false)
      setRecordingTime(0)
    }
  }

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const typingTimeoutRef = useRef(null);

  const handleTypingDebounced = (isTyping) => {
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      onTyping(isTyping);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center">
        {onBackClick && (
          <button className="mr-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" onClick={onBackClick}>
            <ArrowLeft size={20} />
          </button>
        )}
        <img
          src={activeChat.profile_picture.startsWith("/")
            ? `/api${activeChat.profile_picture}`
            : activeChat.profile_picture
        }
          alt={`${activeChat.firstname} ${activeChat.lastname}`}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="ml-3 flex-1">
          <h3 className="font-semibold">{`${activeChat.firstname} ${activeChat.lastname}`}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{activeChat.isOnline ? "Online" : "Offline"}</p>
        </div>
        <button
          className={`p-2 rounded-full ${
            activeChat.isInCall
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
          onClick={onToggleCall}
        >
          {activeChat.isInCall ? <PhoneOff size={20} /> : <Phone size={20} />}
        </button>
      </div>

      {/* Audio call panel */}
      {/* {activeChat.isInCall && <AudioCallPanel contact={activeChat} onEndCall={onToggleCall} />} */}
      {activeChat.isInCall && (
        <AudioCallPanel 
          contact={activeChat} 
          onEndCall={onToggleCall}
          socket={socket}
          currentUser={currentUser}
        />
      )}
      
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {activeChat.messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.senderId === currentUser.id}
            contactName={`${activeChat.firstname} ${activeChat.lastname}`}
          />
        ))}
        {typingStatus[activeChat.id] && (
            <div className="flex items-start mb-4">
              <img
                src={activeChat.profile_picture.startsWith("/")
                  ? `/api${activeChat.profile_picture}`
                  : activeChat.profile_picture
                }
                alt={`${activeChat.firstname} ${activeChat.lastname}`}
                className="w-8 h-8 rounded-full object-cover mr-2"
              />
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-w-xs">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
        )}

        <div ref={messagesEndRef} />
        </div>

      {/* Message input */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        {isRecording ? (
          <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-3"></div>
              <span>Recording... {formatTime(recordingTime)}</span>
            </div>
            <button className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600" onClick={stopRecording}>
              <MicOff size={20} />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="flex items-center">
            <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  handleTypingDebounced(e.target.value.length > 0);
                  // Notify when user starts typing
                  if (e.target.value.length > 0) {
                    onTyping(true);
                  } else {
                    onTyping(false);
                  }
                }}
                onFocus={() => onTyping(true)}
                onBlur={() => onTyping(false)}
              />
            {/* <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={message}
              onChange={(e) => setMessage(e.target.value) }
            /> */}
            <button
              type="button"
              className="ml-2 p-2 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
              onClick={toggleRecording}
            >
              <Mic size={20} />
            </button>
            <button
              type="submit"
              className="ml-2 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!message.trim()}
            >
              <Send size={20} />
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default ChatWindow
