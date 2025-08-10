import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeader from "./SectionHeader";

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

// Individual adjustments for each background pattern
const PATTERN_ADJUSTMENTS = {
  "/family-hub/watermarks/Bowl.svg": {
    size: "213px 106px",
    position: "calc(100% + 25px) calc(50% - 5px)",
    opacity: 0.6
  },
  "/family-hub/watermarks/Cheese.svg": {
    size: "238px 119px", 
    position: "calc(100% + 35px) center",
    opacity: 0.6
  },
  "/family-hub/watermarks/Lemons.svg": {
    size: "250px 125px",
    position: "calc(100% + 25px) center", 
    opacity: 0.6
  },
  "/family-hub/watermarks/Lettuce.svg": {
    size: "280px 140px",
    position: "calc(100% + 55px) calc(50% - 10px)",
    opacity: 0.6,
    transform: "rotate(15deg)"
  },
  "/family-hub/watermarks/Strawberries.svg": {
    size: "250px 125px",
    position: "calc(100% + 25px) center",
    opacity: 0.6
  }
};

// Component to handle text overflow detection
function OverflowFadeText({ text, isSpecial, bgColor, bgPattern, className, textColor }) {
  const textRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        const element = textRef.current;
        setIsOverflowing(element.scrollWidth > element.clientWidth);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [text]);

  return (
    <span 
      ref={textRef}
      className={`${className} whitespace-nowrap overflow-hidden relative`}
    >
      {text}
      {isOverflowing && (
        <div 
          className="absolute top-0 right-0 w-8 h-full pointer-events-none"
          style={{
            background: isSpecial 
              ? `linear-gradient(to right, transparent 0%, ${bgColor || '#ffffff'} 100%)`
              : 'linear-gradient(to right, transparent 0%, rgb(249, 250, 251) 100%)',
            backgroundImage: isSpecial && bgPattern ? `url('${bgPattern}')` : undefined,
            backgroundRepeat: 'no-repeat',
            backgroundSize: isSpecial && bgPattern ? PATTERN_ADJUSTMENTS[bgPattern]?.size?.replace('250px', '125px').replace('125px', '62px') || '125px 62px' : '125px 62px',
            backgroundPosition: isSpecial && bgPattern ? PATTERN_ADJUSTMENTS[bgPattern]?.position || 'calc(100% + 25px) center' : 'calc(100% + 25px) center',
            backgroundBlendMode: 'normal',
            opacity: isSpecial && bgPattern ? (PATTERN_ADJUSTMENTS[bgPattern]?.opacity || 0.6) : 1,
            filter: isSpecial && bgPattern && textColor ? (textColor === "#000000" ? 'brightness(0) invert(0)' : 'brightness(0) invert(1)') : 'none',
          }}
        />
      )}
    </span>
  );
}

export default function ShoppingList({ items = [], setItems, addGroceryItem, updateGroceryItem }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  // Debug logging
  console.log('ShoppingList render - items:', items);
  console.log('ShoppingList render - unchecked items:', items.filter(item => !item.checked));
  
  // Utility to convert a string to sentence case
  function toSentenceCase(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  // Ensure items is always an array
  items = items || [];
  
  useEffect(() => {
    if (showModal && inputRef.current) {
      // Small timeout to ensure modal is fully rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [showModal]);
  

  function handleSave() {
    if (!input.trim()) return;
    console.log('handleSave called. editItem:', editItem, 'input:', input);

    if (editItem) {
      // Use Firebase updateItem for individual item updates
      if (updateGroceryItem) {
        updateGroceryItem(editItem.id, { text: input });
      } else {
        // Fallback to full array update
        const updated = items.map((item) =>
          item.id === editItem.id ? { ...item, text: input } : item
        );
        console.log('Updated items after edit:', updated);
        setItems(updated);
      }
    } else {
      // Random chance for special styling (75% for testing watermarks) - disabled on mobile
      let shouldSpecial = !isMobile && Math.random() < 0.75;
      console.log('Random special decision:', shouldSpecial, 'isMobile:', isMobile);

      let bgColor = null;
      let bgPattern = null;
      if (shouldSpecial) {
        bgColor = SPECIAL_COLORS[Math.floor(Math.random() * SPECIAL_COLORS.length)];
        
        // Debug: show current items structure
        console.log('Current items array:', items.slice(0, 5).map(item => ({
          text: item.text,
          special: item.special,
          pattern: item.bgPattern
        })));
        
        // Avoid using the same pattern as the most recent special item
        let lastSpecialPattern = null;
        for (let i = 0; i < Math.min(10, items.length); i++) { // Check up to 10 recent items
          if (items[i].special && items[i].bgPattern) {
            lastSpecialPattern = items[i].bgPattern;
            console.log('Found last special pattern at index', i, ':', lastSpecialPattern);
            break;
          }
        }
        
        let availablePatterns = BACKGROUND_PATTERNS.filter(pattern => pattern !== lastSpecialPattern);
        if (availablePatterns.length === 0) {
          availablePatterns = BACKGROUND_PATTERNS; // fallback if somehow all patterns are filtered
        }
        
        bgPattern = availablePatterns[Math.floor(Math.random() * availablePatterns.length)];
        console.log('Assigning pattern:', bgPattern, 'to special item (avoiding:', lastSpecialPattern, ')');
        console.log('Available patterns were:', availablePatterns);
        console.log('All patterns:', BACKGROUND_PATTERNS);
      }

      const newItem = {
        id: Date.now(),
        text: input,
        checked: false,
        special: shouldSpecial,
        bgColor,
        bgPattern,
      };
      console.log('Adding new item with pattern:', newItem);
      
      // Use Firebase push() for adding individual items
      if (addGroceryItem) {
        addGroceryItem(newItem);
      } else {
        // Fallback to full array update
        const updated = [newItem, ...items];
        console.log('Updated items after add:', updated);
        setItems(updated);
      }
    }

    setShowModal(false);
    setInput("");
    setEditItem(null);
  }

  function handleCheck(id) {
    // Use Firebase updateItem for individual item updates
    if (updateGroceryItem) {
      const item = items.find(item => item.id === id);
      if (item) {
        updateGroceryItem(id, { checked: !item.checked });
      }
    } else {
      // Fallback to full array update
      const updated = items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      );
      setItems(updated);
    }
  }


  return (
    <div className="h-full">
      <SectionHeader
        title="Shopping List"
        className="mb-4"
        rightSlot={
          <button
            onClick={() => {
              // Use Firebase set() to clear all items or fallback to local state
              setItems([]);
            }}
            className="text-gray-500 hover:text-red-500 text-sm font-medium transition-all duration-200 active:scale-95"
            style={{ marginRight: isMobile ? '0px' : '50px' }}
          >
            Delete All
          </button>
        }
      />

      <div className={`bg-white border border-gray-200 rounded-3xl shadow-xl ${isMobile ? 'p-4 h-[400px]' : 'p-8 h-[500px]'} flex flex-col`}>
        {items.filter((item) => !item.checked).length === 0 ? (
          <div className="flex-1"></div>
        ) : (
          <ul className={`${isMobile ? 'space-y-2' : 'space-y-3'} overflow-y-auto pr-2 scrollbar-hide`}>
            <AnimatePresence>
              {items
                .filter((item) => !item.checked)
                .map((item) => {
                let styleProps = {};
                let textColor = "#ffffff";
                let fontSize = isMobile ? "1rem" : "1.5rem";
                let height = isMobile ? "3rem" : "4.5rem";
                if (item.special && !isMobile) {
                  height = "7.875rem";
                  fontSize = "1.75rem";
                  if (item.bgColor) {
                    const contrast = getContrast(item.bgColor, textColor);
                    if (contrast < 4.5) textColor = "#000000";
                  }
                  // Debug: log the pattern info
                  console.log('Special item - bgColor:', item.bgColor, 'bgPattern:', item.bgPattern, 'textColor:', textColor);
                  
                  styleProps = {
                    background: item.bgColor,
                    backgroundImage: 'none',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '250px 125px',
                    backgroundPosition: 'calc(100% + 25px) center',
                    backgroundBlendMode: 'normal',
                    position: 'relative',
                    color: textColor,
                    fontSize,
                    height,
                    borderRadius: "1rem",
                    display: "flex",
                    alignItems: "center",
                    boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)",
                    border: "2px solid #e5e7eb",
                    padding: "0 1.5rem",
                    fontWeight: 700,
                  };
                }
                return (
          <motion.li
            key={item.id}
            className="flex items-center gap-[43px]"
            initial={{ opacity: 0, scale: 0.8, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 40 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
                    <input
                      type="checkbox"
                      className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} accent-primary flex-shrink-0`}
                      checked={item.checked}
                      onChange={() => handleCheck(item.id)}
                    />
                    <div
                      className={item.special && !isMobile
                        ? "flex-1 flex items-center justify-between overflow-hidden relative"
                        : `bg-gray-50 rounded-xl ${isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-3 text-base'} text-gray-800 flex-1 flex items-center shadow-sm border border-gray-100 hover:shadow-md transition overflow-hidden`}
                      style={item.special && !isMobile ? styleProps : {}}
                    >
                      {item.special && !isMobile && item.bgPattern && (
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            backgroundImage: `url('${item.bgPattern}')`,
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: PATTERN_ADJUSTMENTS[item.bgPattern]?.size || '250px 125px',
                            backgroundPosition: PATTERN_ADJUSTMENTS[item.bgPattern]?.position || 'calc(100% + 25px) center',
                            opacity: PATTERN_ADJUSTMENTS[item.bgPattern]?.opacity || 0.6,
                            transform: PATTERN_ADJUSTMENTS[item.bgPattern]?.transform || 'none',
                            filter: textColor === "#000000" ? 'brightness(0) invert(0)' : 'brightness(0) invert(1)',
                          }}
                        />
                      )}
                      <OverflowFadeText
                        text={toSentenceCase(item.text || "")}
                        isSpecial={item.special && !isMobile}
                        bgColor={item.bgColor}
                        bgPattern={item.bgPattern}
                        textColor={textColor}
                        className={item.special && !isMobile ? "tracking-wide" : "font-medium tracking-wide"}
                      />
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif text-[#5A3210]">
                {editItem ? "Edit Item" : "Add New Item"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-light w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:outline-none transition-colors text-base"
                placeholder="e.g., Bananas, Milk, Bread..."
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              />
            </div>

            <div className="flex justify-between gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-md"
              >
                {editItem ? "Update" : "Add Item"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
