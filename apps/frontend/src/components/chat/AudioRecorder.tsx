"use client"
import { useState, useRef, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";

const AudioRecorder = ({ onSendAudio }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  const startRecording = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Setup data handler
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      // Setup stop handler
      mediaRecorder.onstop = () => {
        console.log("Recording stopped successfully");
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/mp3" });
        onSendAudio(audioBlob);
        cleanup();
      };

      // Start recording with 1 second chunks
      mediaRecorder.start(1000);
      setIsRecording(true);
      
      // Start timer
      let seconds = 0;
      timerRef.current = setInterval(() => {
        seconds++;
        setRecordingTime(seconds);
      }, 1000);

    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Couldn't access microphone. Please check permissions.");
      cleanup();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      console.log("Stopping media recorder");
      mediaRecorderRef.current.stop();
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsRecording(false);
    setRecordingTime(0);
  };

  const cleanup = () => {
    // Stop all media tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Clear references
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="flex items-center">
      <button
        onClick={toggleRecording}
        className={`p-2 rounded-full ${
          isRecording ? "bg-red-500 text-white" : "bg-gray-200 dark:bg-gray-700"
        }`}
      >
        {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
      </button>
      {isRecording && (
        <span className="ml-2">Recording: {formatTime(recordingTime)}</span>
      )}
    </div>
  );
};

// Helper function to format time
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export default AudioRecorder;