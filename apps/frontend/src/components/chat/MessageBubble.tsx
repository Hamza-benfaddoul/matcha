const MessageBubble = ({ message, isOwn, contactName }) => {
    const formatTime = (isoString) => {
      const date = new Date(isoString)
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  
    return (
      <div className={`mb-4 flex ${isOwn ? "justify-end" : "justify-start"}`}>
        <div
          className={`max-w-[75%] rounded-lg p-3 ${
            isOwn ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          }`}
        >
          {message.type === "text" ? (
            <p>{message.content}</p>
          ) : message.type === "audio" ? (
            <div className="audio-message">
              <audio src={`/api${message.content}`} controls className="max-w-full" />
            </div>
          ) : null}
          <div className={`text-xs mt-1 ${isOwn ? "text-blue-100" : "text-gray-500 dark:text-gray-400"}`}>
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    )
  }
  
  export default MessageBubble
  