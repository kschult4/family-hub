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
    
    if (SpeechRecognition) {
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
        setError(event.error);
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
      // Request microphone permissions silently (for future computer vision)
      // Don't block on video permission failure - just need audio
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: true, 
          video: true // Request video for future computer vision features
        });
        mediaStreamRef.current = stream;
      } catch (videoErr) {
        // If video fails, try audio only
        console.log('📹 Video permission not granted, using audio only');
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaStreamRef.current = audioStream;
        } catch (audioErr) {
          console.error('❌ Audio permission denied:', audioErr);
          setError('Microphone access required for voice control');
          return;
        }
      }
      
      // Start voice recognition
      recognitionRef.current.start();
      
    } catch (err) {
      console.error('❌ Failed to access microphone:', err);
      setError('Microphone access required');
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