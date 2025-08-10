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
      // Never show custom keyboard on mobile devices or web browsers
      // Only show on specific Raspberry Pi setup
      const isRaspberryPi = navigator.userAgent.includes('Linux') && 
                           navigator.userAgent.includes('armv') &&
                           window.innerWidth >= 1024; // Large screen
      
      if (isRaspberryPi) {
        setShowKeyboard(true);
        inputRef.current?.blur(); // Don't show system keyboard
      } else {
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
      text: trimmed,
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
            <h2 className="text-lg font-bold">Add a New Grocery Item</h2>
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
      
      
      {showKeyboard ? (
        <div style={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          background: '#f5f5f5', 
          padding: '12px', 
          borderTop: '1px solid #d1d5db',
          zIndex: 9999
        }}>
          
          {/* Top row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '2px', marginBottom: '2px' }}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map(key => (
              <button 
                key={key}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setDescription(prev => prev + key)}
                style={{ 
                  padding: '14px 8px', 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  color: '#374151',
                  fontSize: '16px',
                  fontWeight: 'normal',
                  touchAction: 'manipulation',
                  userSelect: 'none',
                  cursor: 'pointer'
                }}
              >
                {key}
              </button>
            ))}
          </div>
          
          {/* QWERTY row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '2px', marginBottom: '2px' }}>
            {['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'].map(key => (
              <button 
                key={key}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setDescription(prev => prev + key)}
                style={{ 
                  padding: '14px 8px', 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  color: '#374151',
                  fontSize: '16px',
                  fontWeight: 'normal',
                  touchAction: 'manipulation',
                  userSelect: 'none',
                  cursor: 'pointer'
                }}
              >
                {key.toUpperCase()}
              </button>
            ))}
          </div>
          
          {/* ASDF row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: '2px', marginBottom: '2px' }}>
            {['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'].map(key => (
              <button 
                key={key}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setDescription(prev => prev + key)}
                style={{ 
                  padding: '14px 8px', 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  color: '#374151',
                  fontSize: '16px',
                  fontWeight: 'normal',
                  touchAction: 'manipulation',
                  userSelect: 'none',
                  cursor: 'pointer'
                }}
              >
                {key.toUpperCase()}
              </button>
            ))}
          </div>
          
          {/* ZXCV row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '8px' }}>
            {['z', 'x', 'c', 'v', 'b', 'n', 'm'].map(key => (
              <button 
                key={key}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setDescription(prev => prev + key)}
                style={{ 
                  padding: '14px 8px', 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  color: '#374151',
                  fontSize: '16px',
                  fontWeight: 'normal',
                  touchAction: 'manipulation',
                  userSelect: 'none',
                  cursor: 'pointer'
                }}
              >
                {key.toUpperCase()}
              </button>
            ))}
          </div>
          
          {/* Action buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '2px' }}>
            <button 
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setDescription(prev => prev + ' ')}
              style={{ 
                padding: '12px', 
                backgroundColor: '#ffffff',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                color: '#374151',
                fontSize: '14px',
                fontWeight: 'normal',
                touchAction: 'manipulation',
                cursor: 'pointer'
              }}
            >
              space
            </button>
            <button 
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setDescription(prev => prev.slice(0, -1))}
              style={{ 
                padding: '12px', 
                backgroundColor: '#ffffff',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                color: '#374151',
                fontSize: '14px',
                fontWeight: 'normal',
                touchAction: 'manipulation',
                cursor: 'pointer'
              }}
            >
              ⌫
            </button>
            <button 
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setDescription('')}
              style={{ 
                padding: '12px', 
                backgroundColor: '#ffffff',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                color: '#374151',
                fontSize: '14px',
                fontWeight: 'normal',
                touchAction: 'manipulation',
                cursor: 'pointer'
              }}
            >
              clear
            </button>
            <button 
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowKeyboard(false)}
              style={{ 
                padding: '12px', 
                backgroundColor: '#ffffff',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                color: '#374151',
                fontSize: '14px',
                fontWeight: 'normal',
                touchAction: 'manipulation',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
