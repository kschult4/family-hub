import { useState } from "react";

const daysOfWeek = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

export default function MealsModal({ isOpen, initialData, onClose, onSave }) {
  const [formData, setFormData] = useState(initialData || {});

  if (!isOpen) return null; // ✅ Don't render if not open

  const handleChange = (day, value) => {
    setFormData({ ...formData, [day]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave?.(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="bg-card rounded-xl shadow-modal p-6 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Edit Weekly Meals</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-light"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto scrollbar-hide">
          {daysOfWeek.map((day) => (
            <div key={day}>
              <label className="block text-sm font-medium text-gray-700">
                {day}
              </label>
              <input
                type="text"
                value={formData[day] || ""}
                onChange={(e) => handleChange(day, e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 mt-1 text-sm"
              />
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded text-sm bg-gray-100 hover:bg-gray-200"
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
  );
}
