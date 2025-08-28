import { useState, useEffect, useCallback, useRef } from 'react';

export function useVoiceRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [confidence, setConfidence] = useState(0);
  
  const recognitionRef = useRef(null);
  const mediaStreamRef = useRef(null);

  useEffect(() => {
    // Check for Web Speech API support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition && 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
      setIsSupported(true);
      
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;
      
      recognition.onstart = () => {
        console.log('🎤 Voice recognition started');
        setIsListening(true);
        setError(null);
        setTranscript('');
      };
      
      recognition.onresult = (event) => {
        const result = event.results[0];
        const transcriptText = result[0].transcript;
        const confidenceLevel = result[0].confidence;
        
        console.log('🗣️ Voice transcript:', transcriptText, 'confidence:', confidenceLevel);
        setTranscript(transcriptText);
        setConfidence(confidenceLevel);
      };
      
      recognition.onerror = (event) => {
        console.error('❌ Voice recognition error:', event.error);
        let errorMessage;
        switch(event.error) {
          case 'not-allowed':
            errorMessage = 'Microphone access denied. Please enable microphone permissions.';
            break;
          case 'no-speech':
            errorMessage = 'No speech detected. Please try again.';
            break;
          case 'network':
            errorMessage = 'Network error. Please check your connection.';
            break;
          case 'aborted':
            errorMessage = 'Voice recognition was stopped.';
            break;
          default:
            errorMessage = `Voice recognition error: ${event.error}`;
        }
        setError(errorMessage);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        console.log('🔇 Voice recognition ended');
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    } else {
      console.warn('⚠️ Web Speech API not supported in this browser');
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startListening = useCallback(async () => {
    if (!isSupported || !recognitionRef.current) {
      setError('Voice recognition not supported');
      return;
    }

    try {
      // Check if we're on HTTPS (required for Web Speech API in production)
      if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        setError('Voice control requires HTTPS connection');
        return;
      }

      // Request audio permission only (simplified for reliability)
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = audioStream;
        console.log('🎤 Audio permission granted');
      } catch (audioErr) {
        console.error('❌ Audio permission denied:', audioErr);
        setError('Microphone access required for voice control');
        return;
      }
      
      // Start voice recognition
      recognitionRef.current.start();
      
    } catch (err) {
      console.error('❌ Failed to start voice recognition:', err);
      setError('Failed to start voice recognition');
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setConfidence(0);
    setError(null);
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    confidence,
    error,
    startListening,
    stopListening,
    resetTranscript
  };
}