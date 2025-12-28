import { useState, useEffect, lazy, Suspense } from "react";
import Header from "./components/Header";
import FooterNav from "./components/FooterNav";
import AppBackground from "./components/AppBackground";
import ErrorBoundary from "./components/ErrorBoundary";

// Lazy load heavy components for better code splitting
const DashboardView = lazy(() => import("./components/DashboardView"));
const AddGroceryModal = lazy(() => import("./components/AddGroceryModal"));
const AddTaskModal = lazy(() => import("./components/AddTaskModal"));
const MealsModal = lazy(() => import("./components/MealsModal"));
import { useFirebaseSync } from "./hooks/useFirebaseSync";
import { useIsMobile } from "./hooks/useMediaQuery";

const BACKGROUND_PATTERNS = [
  "/watermarks/Bowl.svg",
  "/watermarks/Cheese.svg",
  "/watermarks/Lemons.svg",
  "/watermarks/Lettuce.svg",
  "/watermarks/Strawberries.svg"
];

export default function App() {
  const [currentTab, setCurrentTab] = useState("ALERTS");
  const isMobile = useIsMobile();

  // Use Firebase for real-time synchronization
  const {
    data: groceryItems,
    updateData: setGroceryItems,
    addItem: addGroceryItem,
    updateItem: updateGroceryItem,
    removeItem: removeGroceryItem,
    loading: groceryLoading
  } = useFirebaseSync('groceryItems', []);
  
  const {
    data: tasks,
    updateData: setTasks,
    addItem: addTask,
    updateItem: updateTask,
    removeItem: removeTask,
    loading: tasksLoading
  } = useFirebaseSync('tasks', []);
  
  const {
    data: meals,
    updateData: setMeals,
    loading: mealsLoading
  } = useFirebaseSync('meals', {});

  // Handler to add a grocery item from modal
  const handleSaveGrocery = (newItem) => {
    if (addGroceryItem) {
      addGroceryItem(newItem);
    } else {
      // Fallback for when Firebase isn't available
      setGroceryItems([newItem, ...groceryItems]);
    }
  };

  // Handler to add a task from modal
  const handleSaveTask = (newTask) => {
    if (addTask) {
      addTask(newTask);
    } else {
      // Fallback for when Firebase isn't available
      setTasks([newTask, ...tasks]);
    }
  };

  // Handler to save meals from modal
  const handleSaveMeals = (mealsData) => {
    setMeals(mealsData);
  };

  // Migration effect: Fix special items missing bgPattern (legacy data)
  useEffect(() => {
    if (groceryLoading || !groceryItems || groceryItems.length === 0) return;

    const itemsNeedingFix = groceryItems.filter(item =>
      item.special && item.bgColor && !item.bgPattern
    );

    if (itemsNeedingFix.length > 0) {
      // Fix each item by assigning a random bgPattern
      itemsNeedingFix.forEach(item => {
        const bgPattern = BACKGROUND_PATTERNS[Math.floor(Math.random() * BACKGROUND_PATTERNS.length)];
        if (updateGroceryItem) {
          updateGroceryItem(item.id, { bgPattern });
        }
      });
    }
  }, [groceryItems, groceryLoading, updateGroceryItem]);

  // Migration effect: Add addedAt timestamp to tasks missing it (run once on mount)
  useEffect(() => {
    if (tasksLoading || !tasks || tasks.length === 0) return;

    const tasksNeedingFix = tasks.filter(task =>
      task && task.id && task.description && !task.addedAt
    );

    if (tasksNeedingFix.length > 0) {
      // Add addedAt timestamp to each task (using current time as fallback)
      tasksNeedingFix.forEach((task, index) => {
        // Stagger timestamps slightly to maintain some ordering
        const addedAt = Date.now() - (tasksNeedingFix.length - index) * 1000;
        if (updateTask) {
          updateTask(task.id, { addedAt });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasksLoading]); // Only run when loading changes, not when tasks change



  return (
    <ErrorBoundary>
      <AppBackground>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <div className="flex flex-col min-h-screen px-2 sm:px-4 md:px-8 text-text font-sans">
          {!isMobile && <Header />}

          <main id="main-content" className={`flex-grow flex flex-col gap-3 sm:gap-6 overflow-auto ${isMobile ? 'pb-[120px] pt-4' : 'pb-[160px]'}`}>
            <Suspense fallback={
              <div className="flex items-center justify-center h-64" role="status" aria-label="Loading">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="sr-only">Loading...</span>
              </div>
            }>
              <DashboardView 
                currentTab={currentTab} 
                groceryItems={groceryItems} 
                setGroceryItems={setGroceryItems}
                addGroceryItem={addGroceryItem}
                updateGroceryItem={updateGroceryItem}
                removeGroceryItem={removeGroceryItem}
                tasks={tasks} 
                setTasks={setTasks}
                addTask={addTask}
                updateTask={updateTask}
                removeTask={removeTask}
                meals={meals} 
                setMeals={setMeals} 
              />
            </Suspense>
          </main>

          <FooterNav
            current={currentTab}
            onNavigate={setCurrentTab}
            onSaveGrocery={handleSaveGrocery}
            onSaveTask={handleSaveTask}
            onSaveMeals={handleSaveMeals}
            groceryItems={groceryItems}
            meals={meals}
          />
        </div>

      </AppBackground>
    </ErrorBoundary>
  );
}
