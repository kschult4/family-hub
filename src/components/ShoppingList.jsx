import { useState, useEffect } from "react";
import SectionHeader from "./SectionHeader";

export default function ShoppingList() {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem("groceryItems");
    return stored ? JSON.parse(stored) : [];
  });

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    localStorage.setItem("groceryItems", JSON.stringify(items));
  }, [items]);

  function handleAddClick() {
    setInput("");
    setEditItem(null);
    setShowModal(true);
  }

  function handleSave() {
    if (!input.trim()) return;

    if (editItem) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editItem.id ? { ...item, text: input } : item
        )
      );
    } else {
      const newItem = {
        id: Date.now(),
        text: input,
        checked: false,
      };
      setItems((prev) => [newItem, ...prev]);
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
            className="text-white bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold"
            onClick={handleAddClick}
          >
            +
          </button>
        }
      />

      <div className="bg-white rounded-2xl shadow-md p-6 h-[500px] flex flex-col">
  <ul className="space-y-2 overflow-y-auto scroll-hide pr-2">

          {items
            .filter((item) => !item.checked)
            .map((item) => (
              <li
                key={item.id}
                className="bg-white rounded-lg px-3 py-2 text-sm text-text flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={item.checked}
                    onChange={() => handleCheck(item.id)}
                  />
                  <span>{item.text}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditItem(item);
                      setInput(item.text);
                      setShowModal(true);
                    }}
                  >
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(item.id)}>🗑️</button>
                </div>
              </li>
            ))}
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
