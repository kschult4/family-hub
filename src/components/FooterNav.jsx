import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import AddGroceryModal from "./AddGroceryModal";
import AddTaskModal from "./AddTaskModal";
import MealsModal from "./MealsModal";

export default function FooterNav({ current, onNavigate }) {
  const navItems = ["ALERTS", "HOME", "FAMILY"];
  const [activeModal, setActiveModal] = useState(null);

  const closeModal = () => setActiveModal(null);

  return (
    <>
      <footer className="fixed bottom-0 left-0 w-full z-30 bg-[#F7E4C3] h-[88px]">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto px-8 h-full">
          {/* Nav Items */}
          <div className="flex gap-16 text-[#5A3210] text-xl sm:text-2xl font-semibold uppercase tracking-wide">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => onNavigate(item)}
                className={`transition-opacity duration-200 ${
                  item === current ? "opacity-100" : "opacity-60"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* FAB Container */}
          <div className="relative z-10">
            <div className="flex gap-4 bg-[#F7E4C3] rounded-tl-[64px] rounded-tr-[64px] px-4 pt-6 pb-3 -translate-y-6">
              <FloatingButtonWithMenu onSelect={setActiveModal} />
              <FloatingMicButton />
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AddGroceryModal isOpen={activeModal === "grocery"} onClose={closeModal} />
      <AddTaskModal isOpen={activeModal === "task"} task={null} onClose={closeModal} />
      <MealsModal isOpen={activeModal === "meals"} onClose={closeModal} />
    </>
  );
}

function FloatingButtonWithMenu({ onSelect }) {
  const [open, setOpen] = useState(false);

  const handleClick = (type) => {
    setOpen(false);
    onSelect(type);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-16 h-16 rounded-full flex items-center justify-center text-white transition-transform duration-300 ease-in-out active:scale-95"
        style={{ backgroundColor: "#B75634" }}
      >
        <motion.div
          initial={false}
          animate={{ rotate: open ? 405 : 0 }}
          transition={{ duration: 0.3 }}
          className="w-8 h-8"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full text-white"
          >
            <path
              d="M12 5V19M5 12H19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 left-0 w-64 bg-white rounded-xl shadow-lg p-4 text-left z-20"
          >
            <div className="text-sm text-gray-500 mb-3">Create a new</div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleClick("grocery")}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-800 font-medium"
                >
                  Grocery Item
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleClick("task")}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-800 font-medium"
                >
                  To-Do
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleClick("meals")}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-800 font-medium"
                >
                  Weekly Meal Plan
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FloatingMicButton() {
  return (
    <button
      onClick={() => {}}
      className="w-16 h-16 rounded-full flex items-center justify-center text-black transition-transform duration-100 ease-in-out active:scale-95"
      style={{ backgroundColor: "#EFB643" }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 text-black"
      >
        <path
          d="M12 15C13.6569 15 15 13.6569 15 12V6C15 4.34315 13.6569 3 12 3C10.3431 3 9 4.34315 9 6V12C9 13.6569 10.3431 15 12 15Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19 10V12C19 15.3137 16.3137 18 13 18H11C7.68629 18 5 15.3137 5 12V10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 18V22"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 22H16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
