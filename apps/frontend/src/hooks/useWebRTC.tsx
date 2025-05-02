import { useState, useEffect, useRef } from 'react';

export const useWebRTC = (socket, localStreamRef, remoteStreamRef) => {
  const [isCalling, setIsCalling] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [callStatus, setCallStatus] = useState('idle');
  const [currentCall, setCurrentCall] = useState(null);
  const pcRef = useRef(null);

  // Initialize peer connection
  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        // You may want to add your own TURN server here for production
      ]
    });

    pc.onicecandidate = (e) => {
      if (e.candidate && currentCall) {
        socket.emit('webrtc_ice_candidate', {
          to: currentCall.userId,
          candidate: e.candidate
        });
      }
    };

    pc.ontrack = (e) => {
      if (e.streams && e.streams[0]) {
        remoteStreamRef.current.srcObject = e.streams[0];
      }
    };

    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState);
      if (pc.connectionState === 'disconnected') {
        endCall();
      }
    };

    return pc;
  };

  // Start a call
  const startCall = async (userId) => {
    try {
      setIsCalling(true);
      setCurrentCall({ userId, isCaller: true });
      pcRef.current = createPeerConnection();

      // Add local stream to connection
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          pcRef.current.addTrack(track, localStreamRef.current);
        });
      }

      // Create offer
      const offer = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(offer);

      // Send offer to other user
      socket.emit('start_call', { callerId: socket.userId, receiverId: userId });
      socket.emit('webrtc_offer', { to: userId, offer });

      setCallStatus('waiting');
    } catch (err) {
      console.error('Error starting call:', err);
      endCall();
    }
  };

  // Accept incoming call
  const acceptCall = async (callerId, offer) => {
    try {
      pcRef.current = createPeerConnection();
      setIsInCall(true);
      setCurrentCall({ userId: callerId, isCaller: false });

      // Add local stream to connection
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          pcRef.current.addTrack(track, localStreamRef.current);
        });
      }

      // Set remote description
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(offer));

      // Create answer
      const answer = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(answer);

      // Send answer to caller
      socket.emit('call_accepted', { callerId, receiverId: socket.userId });
      socket.emit('webrtc_answer', { to: callerId, answer });

      setCallStatus('active');
    } catch (err) {
      console.error('Error accepting call:', err);
      endCall();
    }
  };

  // End the call
  const endCall = () => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    
    if (currentCall) {
      socket.emit('end_call', { 
        userId: socket.userId, 
        otherUserId: currentCall.userId 
      });
    }

    setIsCalling(false);
    setIsInCall(false);
    setCallStatus('idle');
    setCurrentCall(null);
    
    // Clean up streams
    if (remoteStreamRef.current) {
      remoteStreamRef.current.srcObject = null;
    }
  };

  // Handle incoming ICE candidate
  const handleICECandidate = (candidate) => {
    if (pcRef.current && candidate) {
      pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  return {
    isCalling,
    isInCall,
    callStatus,
    currentCall,
    startCall,
    acceptCall,
    endCall,
    handleICECandidate
  };
};