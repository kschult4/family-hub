import React, { useState, useEffect } from "react";

export default function AddTaskModal({ isOpen, task, onClose, onSave }) {
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("");
  const [recurring, setRecurring] = useState("");

  // ✅ Don't render if not open
  if (!isOpen) return null;

  useEffect(() => {
    if (task) {
      setDescription(task.description || "");
      setFrequency(task.frequency || "");
      setRecurring(task.recurring ? "true" : "false");
    }
  }, [task]);

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
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-card rounded-xl shadow-modal p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">
            {task ? "Edit Task" : "Add a New To-Do"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-light"
          >
            ✕
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

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
  );
}
