import React, { useState } from "react";

export default function AddGroceryModal({ isOpen, onClose, onSave }) {
  const [description, setDescription] = useState("");

  if (!isOpen) return null; // ✅ Prevent rendering if modal is closed

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = description.trim();
    if (!trimmed) return;

    const newItem = {
      id: Date.now(),
      name: trimmed,
      addedAt: Date.now(),
      done: false,
    };

    onSave?.(newItem); // Optional chaining in case onSave is not passed
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-card rounded-xl shadow-modal p-6 w-full max-w-md">
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
            />
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
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
