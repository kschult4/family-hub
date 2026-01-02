import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeader from "./SectionHeader";

export default function ShoppingList({ items = [], setItems, addGroceryItem, updateGroceryItem }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
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

    if (editItem) {
      // Use Firebase updateItem for individual item updates
      if (updateGroceryItem) {
        updateGroceryItem(editItem.id, { text: input });
      } else {
        // Fallback to full array update
        const updated = items.map((item) =>
          item.id === editItem.id ? { ...item, text: input } : item
        );
        setItems(updated);
      }
    } else {
      const newItem = {
        id: Date.now(),
        text: input,
        checked: false,
      };
      
      // Use Firebase push() for adding individual items
      if (addGroceryItem) {
        addGroceryItem(newItem);
      } else {
        // Fallback to full array update
        const updated = [newItem, ...items];
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
            className="touch-target touch-feedback text-gray-500 hover:text-red-500 text-sm font-medium transition-all duration-200 px-3 py-2"
            style={{ marginRight: isMobile ? '0px' : '50px' }}
          >
            Delete All
          </button>
        }
      />

      <div className={`bg-white border border-gray-200 rounded-3xl shadow-xl ${isMobile ? 'p-4' : 'p-8 h-[500px]'} flex flex-col`}>
        {items.filter((item) => !item.checked).length === 0 ? (
          <div className="flex-1"></div>
        ) : (
          <ul className={`${isMobile ? 'space-y-2' : 'space-y-3 overflow-y-auto pr-2 scrollbar-hide'}`}>
            <AnimatePresence>
              {items
                .sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0)) // Sort by addedAt timestamp, newest first
                .filter((item) => !item.checked)
                .map((item) => {
                return (
          <motion.li
            key={item.id}
            className={`flex items-center ${isMobile ? 'gap-4' : 'gap-[43px]'}`}
            initial={{ opacity: 0, scale: 0.8, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 40 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
                    <input
                      type="checkbox"
                      className={`accent-primary flex-shrink-0 ${isMobile ? 'mobile-checkbox' : 'desktop-checkbox'}`}
                      checked={item.checked}
                      onChange={() => handleCheck(item.id)}
                    />
                    <div
                      className={`bg-gray-50 rounded-xl ${isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-3 text-base'} text-gray-800 flex-1 flex items-center shadow-sm border border-gray-100 hover:shadow-md transition overflow-hidden`}
                    >
                      <span className="font-medium tracking-wide truncate whitespace-nowrap">
                        {toSentenceCase(item.text || "")}
                      </span>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </div>

      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 id="modal-title" className="text-2xl font-serif text-[#5A3210]">
                {editItem ? "Edit Item" : "Add New Item"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-light w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors touch-target touch-feedback"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <label htmlFor="item-input" className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
              <input
                id="item-input"
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:outline-none transition-colors text-base"
                placeholder="e.g., Bananas, Milk, Bread..."
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                aria-describedby="item-hint"
              />
              <div id="item-hint" className="sr-only">
                Enter a grocery item name and press Enter or click Add Item to save
              </div>
            </div>

            <div className="flex justify-between gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors touch-target touch-feedback"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-md touch-target touch-feedback"
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
