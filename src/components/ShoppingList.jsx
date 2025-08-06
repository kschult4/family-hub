import { useState, useEffect } from "react";
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

export default function ShoppingList({ items = [], setItems }) {
  // Debug: log items prop on every render
  console.log('ShoppingList items:', items);
  // Utility to convert a string to sentence case
  function toSentenceCase(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [input, setInput] = useState("");

  // Ensure items is always an array
  items = items || [];
  
  function handleAddClick() {
    setInput("");
    setEditItem(null);
    setShowModal(true);
  }

  function handleSave() {
    if (!input.trim()) return;
    console.log('handleSave called. editItem:', editItem, 'input:', input);

    if (editItem) {
      setItems((prev) => {
        const updated = prev.map((item) =>
          item.id === editItem.id ? { ...item, text: input } : item
        );
        console.log('Updated items after edit:', updated);
        return updated;
      });
    } else {
      let prev = items;
      let lastSpecial = prev.length > 0 ? prev[0].special : false;
      let plainCount = 0;
      for (let i = 0; i < Math.min(5, prev.length); i++) {
        if (!prev[i].special) plainCount++;
        else break;
      }
      let shouldSpecial = false;
      if (!lastSpecial && plainCount >= 5) {
        shouldSpecial = true;
      } else if (!lastSpecial && plainCount < 5) {
        shouldSpecial = false;
      } else if (lastSpecial) {
        shouldSpecial = false;
      }

      if (lastSpecial && plainCount >= 5) {
        shouldSpecial = false;
      }

      let bgColor = null;
      if (shouldSpecial) {
        bgColor = SPECIAL_COLORS[Math.floor(Math.random() * SPECIAL_COLORS.length)];
      }

      const newItem = {
        id: Date.now(),
        text: input,
        checked: false,
        special: shouldSpecial,
        bgColor,
      };
      console.log('Adding new item:', newItem);
      setItems((prev) => {
        const updated = [newItem, ...prev];
        console.log('Updated items after add:', updated);
        return updated;
      });
    }

    setShowModal(false);
    setInput("");
    setEditItem(null);
  }

  function handleCheck(id) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  }

  function handleDelete(id) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <div className="h-full">
      <SectionHeader
        title="Shopping List"
        className="mb-4"
        rightSlot={
          <button
            className="text-white bg-primary rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold shadow-lg hover:bg-indigo-600 transition"
            onClick={handleAddClick}
            aria-label="Add item"
          >
            +
          </button>
        }
      />

      <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-8 h-[500px] flex flex-col">
        <ul className="space-y-3 overflow-y-auto scroll-hide pr-2">
          <AnimatePresence>
            {items
              .filter((item) => !item.checked)
              .map((item) => {
                console.log('Rendering item:', item);
                let styleProps = {};
                let textColor = "#ffffff";
                let fontSize = "1.5rem";
                let height = "4.5rem";
                if (item.special) {
                  height = "7.875rem";
                  fontSize = "2.25rem";
                  if (item.bgColor) {
                    const contrast = getContrast(item.bgColor, textColor);
                    if (contrast < 4.5) textColor = "#000000";
                  }
                  styleProps = {
                    background: item.bgColor,
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
                      className="w-5 h-5 accent-primary flex-shrink-0"
                      checked={item.checked}
                      onChange={() => handleCheck(item.id)}
                    />
                    <div
                      className={item.special
                        ? "flex-1 flex items-center justify-between"
                        : "bg-gray-50 rounded-xl px-4 py-3 text-base text-gray-800 flex-1 flex items-center shadow-sm border border-gray-100 hover:shadow-md transition"}
                      style={item.special ? styleProps : {}}
                    >
                      <span className={item.special ? "tracking-wide" : "font-medium tracking-wide"}>{toSentenceCase(item.text || item.name || "")}</span>
                    </div>
                  </motion.li>
                );
              })}
          </AnimatePresence>
        </ul>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">
                {editItem ? "Edit Item" : "Add Item"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-light"
              >
                ✕
              </button>
            </div>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full border rounded p-2 mb-4"
              placeholder="Item name..."
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
