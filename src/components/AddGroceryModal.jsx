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
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Add a New Grocery Item</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-light"
            >
              ✕
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1">Item</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                placeholder="e.g. Bananas"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onFocus={() => setShowKeyboard(true)}
              />
              <div className="text-xs text-gray-500 mt-1">
                Keyboard: {showKeyboard ? 'ON' : 'OFF'}
              </div>
              <button 
                type="button"
                onClick={() => setShowKeyboard(!showKeyboard)}
                className="mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded"
              >
                Toggle Keyboard ({showKeyboard ? 'ON' : 'OFF'})
              </button>
            </div>


            <div className="flex justify-between mt-6">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={onClose}
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
      
      {showKeyboard && (
        <div style={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          background: 'red', 
          color: 'white', 
          padding: '20px', 
          textAlign: 'center',
          zIndex: 9999 
        }}>
          TEST KEYBOARD PLACEHOLDER - This should appear at bottom
        </div>
      )}
    </>
  );
}
