import { useState, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";

const AddGroceryModal = lazy(() => import("./AddGroceryModal"));
const AddTaskModal = lazy(() => import("./AddTaskModal"));
const MealsModal = lazy(() => import("./MealsModal"));
import { useIsMobile } from "../hooks/useMediaQuery";

export default function FooterNav({ current, onNavigate, onSaveGrocery, onSaveTask, onSaveMeals, groceryItems, meals }) {
  const isMobile = useIsMobile();
  const navItems = isMobile ? ["ALERTS"] : ["ALERTS", "HOME", "FAMILY"];
  const [activeModal, setActiveModal] = useState(null);

  const closeModal = () => setActiveModal(null);

  return (
    <>
      {/* Responsive height: 91px at 1920px, scales down for smaller screens */}
      <footer className="fixed bottom-0 left-0 w-full z-30 bg-[#F7E4C3] h-[70px] sm:h-[111px] md:h-[108px]">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-8 h-full">
          <div className="flex gap-4 sm:gap-16 text-[#5A3210] text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold font-condensed uppercase tracking-wide ml-[10px] sm:ml-[25px]">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => onNavigate(item)}
                className={`touch-target touch-feedback transition-opacity duration-200 px-4 py-2 ${
                  item === current ? "opacity-100" : "opacity-60"
                } font-condensed font-bold`}
                aria-label={`Navigate to ${item.toLowerCase()} page`}
                aria-current={item === current ? 'page' : undefined}
                role="tab"
              >
                {item}
              </button>
            ))}
          </div>

          <div className="relative z-10" style={{ right: isMobile ? '0px' : '5px', position: 'relative' }}>
            <div className={`flex ${isMobile ? 'gap-0' : 'gap-8'} bg-[#F7E4C3] rounded-tl-[74px] rounded-tr-[74px] px-3 sm:px-5 pt-4 sm:pt-7 pb-2 sm:pb-4 -translate-y-3 sm:-translate-y-6`} style={{transform: isMobile ? 'translateY(-12px) scale(0.8)' : 'translateY(-24px) scale(1.15)'}}>
              <FloatingButtonWithMenu onSelect={setActiveModal} />
              {!isMobile && <FloatingMicButton />}
            </div>
          </div>
        </div>
      </footer>

      <Suspense fallback={<div />}>
        <AddGroceryModal isOpen={activeModal === "grocery"} onClose={closeModal} onSave={onSaveGrocery} currentItems={groceryItems} />
        <AddTaskModal isOpen={activeModal === "task"} task={null} onClose={closeModal} onSave={onSaveTask} />
        <MealsModal isOpen={activeModal === "meals"} onClose={closeModal} onSave={onSaveMeals} initialData={meals} />
      </Suspense>
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
        className="w-20 h-20 rounded-full flex items-center justify-center text-white touch-feedback transition-transform duration-300 ease-in-out"
        style={{ backgroundColor: "#B75634" }}
        aria-label={open ? "Close add menu" : "Open add menu"}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <motion.div
          initial={false}
          animate={{ rotate: open ? 405 : 0 }}
          transition={{ duration: 0.3 }}
          className="w-10 h-10"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full text-black"
          >
            <path
              d="M12 5V19M5 12H19"
              stroke="currentColor"
              strokeWidth="1.2"
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
            animate={{ opacity: 1, y: -50, scale: 1.25, x: -75 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 left-0 w-56 bg-white rounded-xl shadow-lg p-6 text-left z-20"
            role="menu"
            aria-label="Add new item menu"
          >
            <div className="text-sm text-gray-500 mb-1 text-left pl-2">Create a new</div>
            <ul className="space-y-2 text-left">
              <li>
                <button
                  onClick={e => { e.stopPropagation(); handleClick("grocery"); }}
                  className="w-full text-left pl-2 py-3 rounded-lg hover:bg-gray-100 text-gray-800 font-medium touch-target touch-feedback"
                  role="menuitem"
                  aria-label="Add new grocery item"
                >
                  Grocery Item
                </button>
              </li>
              <li>
                <button
                  onClick={e => { e.stopPropagation(); handleClick("task"); }}
                  className="w-full text-left pl-2 py-3 rounded-lg hover:bg-gray-100 text-gray-800 font-medium touch-target touch-feedback"
                  role="menuitem"
                  aria-label="Add new task"
                >
                  To-Do
                </button>
              </li>
              <li>
                <button
                  onClick={e => { e.stopPropagation(); handleClick("meals"); }}
                  className="w-full text-left pl-2 py-3 rounded-lg hover:bg-gray-100 text-gray-800 font-medium touch-target touch-feedback"
                  role="menuitem"
                  aria-label="Add weekly meal plan"
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
      className="w-20 h-20 rounded-full flex items-center justify-center text-black touch-feedback transition-transform duration-100 ease-in-out"
      style={{ backgroundColor: "#EFB643" }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-10 h-10 text-black"
      >
        <path
          d="M12 15C13.6569 15 15 13.6569 15 12V6C15 4.34315 13.6569 3 12 3C10.3431 3 9 4.34315 9 6V12C9 13.6569 10.3431 15 12 15Z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19 10V12C19 15.3137 16.3137 18 13 18H11C7.68629 18 5 15.3137 5 12V10"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 18V22"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 22H16"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
