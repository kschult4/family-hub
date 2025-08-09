import React, { useState, useEffect, useRef } from "react";
import TouchKeyboard from "./TouchKeyboard";

export default function AddTaskModal({ isOpen, task, onClose, onSave, onDelete }) {
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("");
  const [recurring, setRecurring] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const inputRef = useRef(null);
  const keyboardRef = useRef(null);

  useEffect(() => {
    if (task) {
      setDescription(task.description || "");
      setFrequency(task.frequency || "");
      setRecurring(task.recurring ? "true" : "false");
    }
  }, [task]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Check if we're on a touch device (Pi) - multiple detection methods
      const isTouchDevice = 'ontouchstart' in window || 
                           navigator.maxTouchPoints > 0 ||
                           navigator.msMaxTouchPoints > 0 ||
                           window.TouchEvent !== undefined;
      
      // Debug logging
      console.log('Touch device detection:', {
        ontouchstart: 'ontouchstart' in window,
        maxTouchPoints: navigator.maxTouchPoints,
        msMaxTouchPoints: navigator.msMaxTouchPoints,
        TouchEvent: window.TouchEvent !== undefined,
        userAgent: navigator.userAgent,
        isTouchDevice
      });
      
      // Always show keyboard on Linux (Raspberry Pi detection)
      const isLinux = navigator.platform.toLowerCase().includes('linux') || 
                     navigator.userAgent.toLowerCase().includes('linux');
      
      if (isTouchDevice || isLinux) {
        console.log('Showing TouchKeyboard');
        setShowKeyboard(true);
        inputRef.current?.blur(); // Don't show system keyboard
      } else {
        console.log('Desktop mode - using regular keyboard');
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

  // ✅ Don't render if not open (but allow rendering if task exists for editing)
  if (!isOpen && !task) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!description || !frequency || !recurring) return;

    const newTask = {
      id: task ? task.id : Date.now(),
      description,
      frequency,
      recurring: recurring === "true",
      done: task ? task.done : false,
      lastCompleted: task ? task.lastCompleted : null,
    };

    onSave?.(newTask);
    onClose();
    setShowKeyboard(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-card rounded-xl shadow-modal p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">
            {task ? "Edit Task" : "Add a New To-Do"}
          </h2>
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
            <label className="block text-sm font-medium mb-1">Description</label>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                className="flex-1 border rounded p-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onFocus={() => setShowKeyboard(true)}
                readOnly={showKeyboard}
              />
              <button
                type="button"
                onClick={() => setShowKeyboard(!showKeyboard)}
                className="px-3 py-2 bg-blue-500 text-white rounded text-sm"
              >
                ⌨️
              </button>
            </div>
          </div>

          {showKeyboard && (
            <TouchKeyboard
              onChange={handleKeyboardChange}
              onKeyPress={handleKeyboardKeyPress}
              keyboardRef={keyboardRef}
            />
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Frequency</label>
            <select
              className="w-full border rounded p-2"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Recurring</label>
            <select
              className="w-full border rounded p-2"
              value={recurring}
              onChange={(e) => setRecurring(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div className="flex justify-between mt-6">
            <div className="flex gap-2">
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
              {task && onDelete && (
                <button
                  type="button"
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => {
                    onDelete(task);
                    onClose();
                    setShowKeyboard(false);
                  }}
                >
                  Delete
                </button>
              )}
            </div>
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
  );
}
