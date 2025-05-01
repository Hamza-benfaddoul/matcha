"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, MicOff, Volume2, VolumeX, PhoneOff } from "lucide-react"

const AudioCallPanel = ({ contact, onEndCall, socket, currentUser }) => {
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(true)
  const [callDuration, setCallDuration] = useState(0)
  const [callStatus, setCallStatus] = useState('calling') // 'calling', 'ringing', 'active', 'ended'
  
  const localAudioRef = useRef(null)
  const remoteAudioRef = useRef(null)
  const localStreamRef = useRef(null)
  const pcRef = useRef(null)
  const isCallerRef = useRef(true) // Track if we initiated the call

  // Initialize media and call
  useEffect(() => {
    const initCall = async () => {
      try {
        // Get local audio stream
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        localStreamRef.current = stream
        localAudioRef.current.srcObject = stream
        
        // Create peer connection
        pcRef.current = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        })
        
        // Add local tracks to connection
        stream.getTracks().forEach(track => {
          pcRef.current.addTrack(track, stream)
        })
        
        // Set up ICE candidate handler
        pcRef.current.onicecandidate = (e) => {
          if (e.candidate) {
            socket.emit('webrtc_ice_candidate', {
              to: contact.id,
              candidate: e.candidate
            })
          }
        }
        
        // Set up remote stream handler
        pcRef.current.ontrack = (e) => {
          if (e.streams[0]) {
            remoteAudioRef.current.srcObject = e.streams[0]
          }
        }
        
        // If we're the caller, create offer
        if (isCallerRef.current) {
          const offer = await pcRef.current.createOffer()
          await pcRef.current.setLocalDescription(offer)
          
          socket.emit('webrtc_offer', {
            to: contact.id,
            offer
          })
          
          // Also emit start_call event to notify recipient
          socket.emit('start_call', {
            callerId: currentUser.id,
            receiverId: contact.id
          })
        }
        
      } catch (err) {
        console.error('Error initializing call:', err)
        endCall()
      }
    }
    
    // Determine if we're the caller or receiver
    isCallerRef.current = !contact.isIncomingCall
    
    if (contact.isIncomingCall) {
      setCallStatus('ringing')
    } else {
      initCall()
    }
    
    return () => {
      endCall()
    }
  }, [contact.id, contact.isIncomingCall, socket, currentUser.id])

  // Handle incoming WebRTC signals
  useEffect(() => {
    if (!socket) return
    
    const handleOffer = async ({ from, offer }) => {
      if (from !== contact.id) return
      
      try {
        if (!pcRef.current) {
          throw new Error('PeerConnection not initialized')
        }
        
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(offer))
        
        const answer = await pcRef.current.createAnswer()
        await pcRef.current.setLocalDescription(answer)
        
        socket.emit('webrtc_answer', {
          to: from,
          answer
        })
        
        setCallStatus('active')
      } catch (err) {
        console.error('Error handling offer:', err)
        endCall()
      }
    }
    
    const handleAnswer = async ({ from, answer }) => {
      if (from !== contact.id) return
      
      try {
        if (!pcRef.current) {
          throw new Error('PeerConnection not initialized')
        }
        
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer))
        setCallStatus('active')
      } catch (err) {
        console.error('Error handling answer:', err)
        endCall()
      }
    }
    
    const handleICECandidate = ({ from, candidate }) => {
      if (from !== contact.id || !pcRef.current) return
      
      try {
        if (candidate) {
          pcRef.current.addIceCandidate(new RTCIceCandidate(candidate))
        }
      } catch (err) {
        console.error('Error adding ICE candidate:', err)
      }
    }
    
    const handleIncomingCall = ({ callerId, callerName }) => {
      if (callerId !== contact.id) return
      setCallStatus('ringing')
    }
    
    const handleCallAccepted = () => {
      setCallStatus('active')
    }
    
    const handleCallRejected = () => {
      setCallStatus('ended')
      setTimeout(() => onEndCall(), 2000)
    }
    
    const handleCallEnded = () => {
      setCallStatus('ended')
      setTimeout(() => onEndCall(), 2000)
    }
    
    socket.on('webrtc_offer', handleOffer)
    socket.on('webrtc_answer', handleAnswer)
    socket.on('webrtc_ice_candidate', handleICECandidate)
    socket.on('incoming_call', handleIncomingCall)
    socket.on('call_accepted', handleCallAccepted)
    socket.on('call_rejected', handleCallRejected)
    socket.on('call_ended', handleCallEnded)
    
    return () => {
      socket.off('webrtc_offer', handleOffer)
      socket.off('webrtc_answer', handleAnswer)
      socket.off('webrtc_ice_candidate', handleICECandidate)
      socket.off('incoming_call', handleIncomingCall)
      socket.off('call_accepted', handleCallAccepted)
      socket.off('call_rejected', handleCallRejected)
      socket.off('call_ended', handleCallEnded)
    }
  }, [socket, contact.id, onEndCall])

  // Call duration timer
  useEffect(() => {
    let interval
    if (callStatus === 'active') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [callStatus])

  const endCall = () => {
    if (pcRef.current) {
      pcRef.current.close()
      pcRef.current = null
    }
    
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop())
      localStreamRef.current = null
    }
    
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null
    }
    
    // Notify the other user if we're ending an active call
    if (callStatus === 'active' && contact.id) {
      socket.emit('end_call', {
        userId: currentUser.id,
        otherUserId: contact.id
      })
    }
  }

  const acceptCall = () => {
    socket.emit('call_accepted', {
      callerId: contact.id,
      receiverId: currentUser.id
    })
    setCallStatus('active')
  }

  const rejectCall = () => {
    socket.emit('call_rejected', {
      callerId: contact.id
    })
    setCallStatus('ended')
    setTimeout(() => onEndCall(), 2000)
  }

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !isMuted
      })
    }
    setIsMuted(!isMuted)
  }

  const toggleSpeaker = () => {
    if (remoteAudioRef.current) {
      remoteAudioRef.current.muted = isSpeakerOn
    }
    setIsSpeakerOn(!isSpeakerOn)
  }

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 flex flex-col items-center">
      {/* Hidden audio elements */}
      <audio ref={localAudioRef} muted playsInline />
      <audio ref={remoteAudioRef} autoPlay playsInline />
      
      <div className="mb-4">
        <img
          src={contact.profile_picture.startsWith("/")
                ? `/api${contact.profile_picture}`
                : contact.profile_picture
            }
          alt={`${contact.firstname} ${contact.lastname}`}
          className="w-20 h-20 rounded-full object-cover"
        />
      </div>
      <h3 className="text-lg font-semibold mb-1">{`${contact.firstname} ${contact.lastname}`}</h3>
      
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        {callStatus === 'calling' ? 'Calling...' : 
         callStatus === 'ringing' ? 'Ringing...' : 
         callStatus === 'ended' ? 'Call ended' :
         formatDuration(callDuration)}
      </p>
      
      {callStatus === 'ringing' ? (
        <div className="flex space-x-4">
          <button 
            className="p-3 rounded-full bg-green-500 text-white"
            onClick={acceptCall}
          >
            Accept
          </button>
          <button 
            className="p-3 rounded-full bg-red-500 text-white"
            onClick={rejectCall}
          >
            Reject
          </button>
        </div>
      ) : (
        <div className="flex space-x-4">
          <button
            className={`p-3 rounded-full ${isMuted ? "bg-red-500 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
            onClick={toggleMute}
          >
            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
          <button 
            className="p-3 rounded-full bg-red-500 text-white" 
            onClick={() => {
              endCall()
              onEndCall()
            }}
          >
            <PhoneOff size={24} />
          </button>
          <button
            className={`p-3 rounded-full ${isSpeakerOn ? "bg-gray-200 dark:bg-gray-700" : "bg-red-500 text-white"}`}
            onClick={toggleSpeaker}
          >
            {isSpeakerOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>
        </div>
      )}
    </div>
  )
}

export default AudioCallPanel