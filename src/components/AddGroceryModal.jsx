import React, { useState, useEffect, useRef } from "react";
import TouchKeyboard from "./TouchKeyboard";

// Utility for WCAG AA contrast check
function getContrast(hex1, hex2) {
  function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
    const num = parseInt(hex, 16);
    return [num >> 16, (num >> 8) & 255, num & 255];
  }
  function luminance([r, g, b]) {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  }
  const lum1 = luminance(hexToRgb(hex1));
  const lum2 = luminance(hexToRgb(hex2));
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

const SPECIAL_COLORS = ["#5398cb", "#6d3231", "#48af55", "#0b3d42", "#caccad"];

const BACKGROUND_PATTERNS = [
  "/family-hub/watermarks/Bowl.svg",
  "/family-hub/watermarks/Cheese.svg",
  "/family-hub/watermarks/Lemons.svg",
  "/family-hub/watermarks/Lettuce.svg",
  "/family-hub/watermarks/Strawberries.svg"
];

export default function AddGroceryModal({ isOpen, onClose, onSave, currentItems = [] }) {
  const [description, setDescription] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const inputRef = useRef(null);
  const keyboardRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Check if we're on a touch device (Pi) - multiple detection methods
      const isTouchDevice = 'ontouchstart' in window || 
                           navigator.maxTouchPoints > 0 ||
                           navigator.msMaxTouchPoints > 0 ||
                           window.TouchEvent !== undefined;
      
      // Always show keyboard on Linux (Raspberry Pi detection)
      const isLinux = navigator.platform.toLowerCase().includes('linux') || 
                     navigator.userAgent.toLowerCase().includes('linux');
      
      // Debug logging
      console.log('GroceryModal Touch device detection:', {
        ontouchstart: 'ontouchstart' in window,
        maxTouchPoints: navigator.maxTouchPoints,
        msMaxTouchPoints: navigator.msMaxTouchPoints,
        TouchEvent: window.TouchEvent !== undefined,
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        isLinux,
        isTouchDevice,
        shouldShowKeyboard: isTouchDevice || isLinux
      });
      
      if (isTouchDevice || isLinux) {
        console.log('GroceryModal: Showing TouchKeyboard');
        setShowKeyboard(true);
        inputRef.current?.blur(); // Don't show system keyboard
      } else {
        console.log('GroceryModal: Desktop mode - using regular keyboard');
        inputRef.current.focus();
      }
    }
  }, [isOpen]);
  
  const handleKeyboardChange = (input) => {
    setDescription(input);
  };

  const handleKeyboardKeyPress = (button) => {
    if (button === '{enter}') {
      handleSubmit({ preventDefault: () => {} });
    }
  };


  if (!isOpen) return null; // ✅ Prevent rendering if modal is closed

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = description.trim();
    if (!trimmed) return;

    // Apply special item logic
    const prev = currentItems;
    let lastSpecial = prev.length > 0 ? prev[0].special : false;
    let plainCount = 0;
    
    for (let i = 0; i < Math.min(5, prev.length); i++) {
      if (!prev[i].special) plainCount++;
      else break;
    }
    
    let shouldSpecial = false;
    if (lastSpecial) {
      // If last item was special, next must be regular
      shouldSpecial = false;
    } else if (plainCount >= 5) {
      // Force special after 5 consecutive regular items
      shouldSpecial = true;
    } else {
      // Random chance for special when we have 1-4 consecutive regular items
      shouldSpecial = Math.random() < 0.25; // 25% chance
    }

    let bgColor = null;
    let bgPattern = null;
    if (shouldSpecial) {
      bgColor = SPECIAL_COLORS[Math.floor(Math.random() * SPECIAL_COLORS.length)];
      bgPattern = BACKGROUND_PATTERNS[Math.floor(Math.random() * BACKGROUND_PATTERNS.length)];
      console.log('AddGroceryModal: Assigning pattern:', bgPattern, 'to special item');
    }

    const newItem = {
      id: Date.now(),
      name: trimmed,
      text: trimmed, // Add both name and text for compatibility
      addedAt: Date.now(),
      done: false,
      checked: false,
      special: shouldSpecial,
      bgColor,
      bgPattern,
    };

    onSave?.(newItem); // Optional chaining in case onSave is not passed
    onClose();
    setDescription(""); // Reset form
    setShowKeyboard(false);
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border" style={{ marginBottom: showKeyboard ? '300px' : '0' }}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold" style={{background: 'yellow', padding: '10px'}}>🔧 DEBUG MODE - Add Grocery Item</h2>
            <button
              onClick={() => {
                onClose();
                setShowKeyboard(false);
              }}
              className="text-gray-500 hover:text-gray-700 text-2xl font-light"
            >
              ✕
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1">Item</label>
              <input
                ref={inputRef}
                type="text"
                className="w-full border rounded p-2"
                placeholder="e.g. Bananas"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="text-xs text-gray-500 mt-1">
                Keyboard State: {JSON.stringify(showKeyboard)} | Type: {typeof showKeyboard}
              </div>
              <div className="flex gap-2 mt-2">
                <button 
                  type="button"
                  onClick={() => {
                    console.log('Manual toggle - Before:', showKeyboard, typeof showKeyboard);
                    const newState = !showKeyboard;
                    setShowKeyboard(newState);
                    console.log('Manual toggle - Setting to:', newState, typeof newState);
                  }}
                  className="px-2 py-1 bg-blue-500 text-white text-xs rounded"
                >
                  Toggle ({showKeyboard ? 'ON' : 'OFF'})
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    console.log('Force TRUE clicked');
                    setShowKeyboard(true);
                  }}
                  className="px-2 py-1 bg-green-500 text-white text-xs rounded"
                >
                  Force TRUE
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    console.log('Force FALSE clicked');
                    setShowKeyboard(false);
                  }}
                  className="px-2 py-1 bg-red-500 text-white text-xs rounded"
                >
                  Force FALSE
                </button>
              </div>
            </div>


            <div className="flex justify-between mt-6">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => {
                  onClose();
                  setShowKeyboard(false);
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Always visible debug panel */}
      <div style={{ 
        position: 'fixed', 
        top: '10px', 
        left: '10px', 
        background: 'black', 
        color: 'white', 
        padding: '10px', 
        fontSize: '12px',
        zIndex: 10001,
        fontFamily: 'monospace'
      }}>
        DEBUG PANEL<br/>
        showKeyboard: {String(showKeyboard)}<br/>
        Type: {typeof showKeyboard}<br/>
        isOpen: {String(isOpen)}<br/>
        Time: {new Date().toLocaleTimeString()}
      </div>
      
      {showKeyboard ? (
        <div style={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          background: 'white', 
          padding: '20px', 
          border: '2px solid green',
          zIndex: 9999
        }}>
          <div style={{ background: 'green', color: 'white', padding: '10px', textAlign: 'center', marginBottom: '10px' }}>
            INLINE KEYBOARD TEST
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '5px', marginBottom: '10px' }}>
            {['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'].map(key => (
              <button 
                key={key}
                onClick={() => {
                  console.log('Key pressed:', key);
                  setDescription(prev => prev + key);
                }}
                style={{ 
                  padding: '15px', 
                  backgroundColor: '#f0f0f0', 
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                {key}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => setDescription('')}
              style={{ 
                padding: '15px 30px', 
                backgroundColor: '#ff6b6b', 
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Clear
            </button>
            <button 
              onClick={() => setDescription(prev => prev.slice(0, -1))}
              style={{ 
                padding: '15px 30px', 
                backgroundColor: '#4ecdc4', 
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Backspace
            </button>
            <button 
              onClick={() => setDescription(prev => prev + ' ')}
              style={{ 
                padding: '15px 30px', 
                backgroundColor: '#45b7d1', 
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Space
            </button>
          </div>
        </div>
      ) : (
        <div style={{ position: 'fixed', bottom: '10px', left: '10px', background: 'red', color: 'white', padding: '5px', fontSize: '12px' }}>
          Grocery Keyboard OFF
        </div>
      )}
    </>
  );
}
