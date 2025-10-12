import { useState, useEffect, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";

const AddGroceryModal = lazy(() => import("./AddGroceryModal"));
const AddTaskModal = lazy(() => import("./AddTaskModal"));
const MealsModal = lazy(() => import("./MealsModal"));
const VoiceControlModal = lazy(() => import("./VoiceControlModal"));
import { useIsMobile } from "../hooks/useMediaQuery";
import { useVoiceRecognition } from "../hooks/useVoiceRecognition";
import { useVoiceCommands } from "../hooks/useVoiceCommands";

export default function FooterNav({ current, onNavigate, onSaveGrocery, onSaveTask, onSaveMeals, groceryItems, meals }) {
  const isMobile = useIsMobile();
  const navItems = ["ALERTS", "FAMILY"];
  const [activeModal, setActiveModal] = useState(null);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [processingCommand, setProcessingCommand] = useState(false);

  const {
    isListening,
    isSupported,
    transcript,
    confidence,
    error,
    startListening,
    stopListening,
    resetTranscript
  } = useVoiceRecognition();

  const { parseCommand, executeCommand } = useVoiceCommands();

  const closeModal = () => setActiveModal(null);

  const handleVoiceCommand = async () => {
    if (!isSupported) {
      console.warn('Voice recognition not supported');
      return;
    }

    if (isListening) {
      stopListening();
      setShowVoiceModal(false);
      return;
    }

    setShowVoiceModal(true);
    resetTranscript();
    await startListening();
  };

  const closeVoiceModal = () => {
    stopListening();
    setShowVoiceModal(false);
    setProcessingCommand(false);
  };

  const processVoiceCommand = async () => {
    if (!transcript || confidence < 0.5) {
      console.log('🚫 Voice command rejected - low confidence or no transcript');
      return;
    }

    console.log('🎯 Processing voice command:', transcript, 'confidence:', confidence);
    setProcessingCommand(true);

    try {
      const command = parseCommand(transcript, confidence);
      console.log('📋 Parsed command:', command);
      
      if (command && command.type !== 'unknown') {
        console.log('🔧 Executing command with callbacks:', {
          onAddGrocery: !!onSaveGrocery,
          onAddTask: !!onSaveTask
        });
        
        const result = await executeCommand(command, {
          onAddGrocery: onSaveGrocery,
          onAddTask: onSaveTask
        });

        console.log('🎉 Command execution result:', result);
        
        if (result.success) {
          console.log('✅ Voice command executed successfully:', result.message);
        } else {
          console.warn('⚠️ Voice command failed:', result.message);
        }
      } else {
        console.log('❓ Unknown command type:', command);
      }
    } catch (error) {
      console.error('❌ Error processing voice command:', error);
    } finally {
      setProcessingCommand(false);
      setTimeout(() => {
        closeVoiceModal();
      }, 1500); // Show result for a moment
    }
  };

  // Auto-process voice commands when transcript is received
  useEffect(() => {
    if (transcript && confidence > 0.5 && !processingCommand) {
      // Small delay to let user see the transcript
      setTimeout(() => {
        processVoiceCommand();
      }, 800);
    }
  }, [transcript, confidence, processingCommand]);

  return (
    <>
      {/* Responsive height: 91px at 1920px, scales down for smaller screens */}
      <footer className="fixed bottom-0 left-0 w-full z-30 bg-[#F7E4C3] h-[70px] sm:h-[111px] md:h-[108px]">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-8 h-full">
          <div className="flex gap-4 sm:gap-16 text-[#5A3210] text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold font-condensed uppercase tracking-wide ml-[10px] sm:ml-[25px]">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => onNavigate(item)}
                className={`touch-target touch-feedback transition-opacity duration-200 px-4 py-2 ${
                  item === current ? "opacity-100" : "opacity-60"
                } font-condensed font-bold`}
                aria-label={`Navigate to ${item.toLowerCase()} page`}
                aria-current={item === current ? 'page' : undefined}
                role="tab"
              >
                {item}
              </button>
            ))}
          </div>

          <div className="relative z-10" style={{ right: isMobile ? '0px' : '5px', position: 'relative' }}>
            <div className={`flex ${isMobile ? 'gap-0' : 'gap-8'} bg-[#F7E4C3] rounded-tl-[74px] rounded-tr-[74px] px-3 sm:px-5 pt-4 sm:pt-7 pb-2 sm:pb-4 -translate-y-3 sm:-translate-y-6`} style={{transform: isMobile ? 'translateY(-12px) scale(0.8)' : 'translateY(-24px) scale(1.15)'}}>
              <FloatingButtonWithMenu onSelect={setActiveModal} />
              {!isMobile && <FloatingMicButton onVoiceCommand={handleVoiceCommand} isListening={isListening} isSupported={isSupported} />}
            </div>
          </div>
        </div>
      </footer>

      <Suspense fallback={<div />}>
        <AddGroceryModal isOpen={activeModal === "grocery"} onClose={closeModal} onSave={onSaveGrocery} currentItems={groceryItems} />
        <AddTaskModal isOpen={activeModal === "task"} task={null} onClose={closeModal} onSave={onSaveTask} />
        <MealsModal isOpen={activeModal === "meals"} onClose={closeModal} onSave={onSaveMeals} initialData={meals} />
        <VoiceControlModal 
          isVisible={showVoiceModal}
          isListening={isListening}
          transcript={transcript}
          confidence={confidence}
          error={error}
          processingCommand={processingCommand}
          onClose={closeVoiceModal}
        />
      </Suspense>
    </>
  );
}

function FloatingButtonWithMenu({ onSelect }) {
  const [open, setOpen] = useState(false);

  const handleClick = (type) => {
    setOpen(false);
    onSelect(type);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-20 h-20 rounded-full flex items-center justify-center text-white touch-feedback transition-transform duration-300 ease-in-out"
        style={{ backgroundColor: "#B75634" }}
        aria-label={open ? "Close add menu" : "Open add menu"}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <motion.div
          initial={false}
          animate={{ rotate: open ? 405 : 0 }}
          transition={{ duration: 0.3 }}
          className="w-10 h-10"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full text-black"
          >
            <path
              d="M12 5V19M5 12H19"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: -50, scale: 1.25, x: -75 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 left-0 w-56 bg-white rounded-xl shadow-lg p-6 text-left z-20"
            role="menu"
            aria-label="Add new item menu"
          >
            <div className="text-sm text-gray-500 mb-1 text-left pl-2">Create a new</div>
            <ul className="space-y-2 text-left">
              <li>
                <button
                  onClick={e => { e.stopPropagation(); handleClick("grocery"); }}
                  className="w-full text-left pl-2 py-3 rounded-lg hover:bg-gray-100 text-gray-800 font-medium touch-target touch-feedback"
                  role="menuitem"
                  aria-label="Add new grocery item"
                >
                  Grocery Item
                </button>
              </li>
              <li>
                <button
                  onClick={e => { e.stopPropagation(); handleClick("task"); }}
                  className="w-full text-left pl-2 py-3 rounded-lg hover:bg-gray-100 text-gray-800 font-medium touch-target touch-feedback"
                  role="menuitem"
                  aria-label="Add new task"
                >
                  To-Do
                </button>
              </li>
              <li>
                <button
                  onClick={e => { e.stopPropagation(); handleClick("meals"); }}
                  className="w-full text-left pl-2 py-3 rounded-lg hover:bg-gray-100 text-gray-800 font-medium touch-target touch-feedback"
                  role="menuitem"
                  aria-label="Add weekly meal plan"
                >
                  Weekly Meal Plan
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FloatingMicButton({ onVoiceCommand, isListening, isSupported }) {
  const getButtonStyle = () => {
    if (!isSupported) {
      return { backgroundColor: "#CCCCCC" }; // Disabled state
    }
    if (isListening) {
      return { backgroundColor: "#E53E3E" }; // Red when listening
    }
    return { backgroundColor: "#EFB643" }; // Default yellow
  };

  const getButtonClass = () => {
    let baseClass = "w-20 h-20 rounded-full flex items-center justify-center text-black touch-feedback transition-all duration-200 ease-in-out relative z-10";
    
    if (!isSupported) {
      baseClass += " cursor-not-allowed opacity-50";
    } else if (isListening) {
      baseClass += " scale-105";
    } else {
      baseClass += " hover:scale-105";
    }
    
    return baseClass;
  };

  return (
    <div className="relative">
      {/* Pulsing Ring Animation */}
      {isListening && (
        <>
          <div className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-75" style={{ animationDuration: '1s' }}></div>
          <div className="absolute inset-0 rounded-full animate-ping bg-red-300 opacity-50" style={{ animationDuration: '1.5s', animationDelay: '0.2s' }}></div>
          <div className="absolute inset-0 rounded-full animate-ping bg-red-200 opacity-25" style={{ animationDuration: '2s', animationDelay: '0.4s' }}></div>
        </>
      )}
      
      <button
        onClick={onVoiceCommand}
        disabled={!isSupported}
        className={getButtonClass()}
        style={getButtonStyle()}
        aria-label={
          !isSupported ? "Voice control not supported" :
          isListening ? "Stop voice recognition" : 
          "Start voice recognition"
        }
        title={
          !isSupported ? "Voice control not supported in this browser" :
          isListening ? "Click to stop listening" : 
          "Click to start voice control"
        }
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-10 h-10 text-black transition-transform duration-200 ${isListening ? 'scale-110' : ''}`}
        >
          <path
            d="M12 15C13.6569 15 15 13.6569 15 12V6C15 4.34315 13.6569 3 12 3C10.3431 3 9 4.34315 9 6V12C9 13.6569 10.3431 15 12 15Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19 10V12C19 15.3137 16.3137 18 13 18H11C7.68629 18 5 15.3137 5 12V10"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 18V22"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 22H16"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
