import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, AlertCircle, CheckCircle } from 'lucide-react';

export default function VoiceControlModal({ 
  isVisible, 
  isListening, 
  transcript, 
  error, 
  confidence,
  onClose,
  processingCommand 
}) {
  const getStatusIcon = () => {
    if (error) {
      return <AlertCircle className="w-12 h-12 text-red-500" />;
    }
    if (processingCommand) {
      return <Volume2 className="w-12 h-12 text-blue-500 animate-pulse" />;
    }
    if (transcript && confidence > 0.7) {
      return <CheckCircle className="w-12 h-12 text-green-500" />;
    }
    if (isListening) {
      return <Mic className="w-12 h-12 text-blue-500 animate-pulse" />;
    }
    return <MicOff className="w-12 h-12 text-gray-500" />;
  };

  const getStatusText = () => {
    if (error) {
      return 'Voice recognition error';
    }
    if (processingCommand) {
      return 'Processing command...';
    }
    if (transcript && confidence > 0.7) {
      return 'Command recognized';
    }
    if (isListening) {
      return 'Listening...';
    }
    return 'Ready to listen';
  };

  const getTranscriptText = () => {
    if (error) {
      return `Error: ${error}`;
    }
    if (transcript) {
      return `"${transcript}"`;
    }
    if (isListening) {
      return 'Speak now...';
    }
    return 'Click the microphone to start';
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl p-8 w-96 max-w-sm mx-4 text-center"
          >
            {/* Status Icon */}
            <div className="flex justify-center mb-4">
              {getStatusIcon()}
            </div>

            {/* Status Text */}
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {getStatusText()}
            </h3>

            {/* Transcript Display */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 min-h-[60px] flex items-center justify-center">
              <p className={`text-sm ${transcript ? 'text-gray-800' : 'text-gray-500'} italic`}>
                {getTranscriptText()}
              </p>
            </div>

            {/* Confidence Bar */}
            {transcript && confidence > 0 && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Confidence</span>
                  <span>{Math.round(confidence * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${confidence * 100}%` }}
                    className={`h-2 rounded-full ${
                      confidence > 0.7 ? 'bg-green-500' : 
                      confidence > 0.5 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {processingCommand ? 'Processing...' : 'Cancel'}
              </button>
            </div>

            {/* Help Text */}
            <div className="text-xs text-gray-500 mt-4 space-y-1">
              <p className="font-medium">Shopping List Examples:</p>
              <p>"Add milk to my shopping list" • "Put bread on grocery list" • "Shopping apples"</p>
              <p className="font-medium mt-2">Task Examples:</p>
              <p>"Add task clean kitchen" • "Add call dentist to my tasks" • "Todo fix sink"</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}