import { useState, useEffect, lazy, Suspense } from "react";
import Header from "./components/Header";
import FooterNav from "./components/FooterNav";
import AppBackground from "./components/AppBackground";
import ErrorBoundary from "./components/ErrorBoundary";

// Lazy load heavy components for better code splitting
const DashboardView = lazy(() => import("./components/DashboardView"));
const ShoppingList = lazy(() => import("./components/ShoppingList"));
const MotionCameraModal = lazy(() => import("./components/home/MotionCameraModal"));
import { useFirebaseSync } from "./hooks/useFirebaseSync";
import { useHomeAssistant } from "./hooks/useHomeAssistant";
import { useMotionDetection } from "./hooks/useMotionDetection";

export default function App() {
  const [currentTab, setCurrentTab] = useState("HOME");
  
  // Home Assistant integration for camera motion detection
  const { devices } = useHomeAssistant();
  const cameras = devices?.filter(d => d.entity_id.startsWith('camera.')) || [];
  const { camerasWithMotion, clearAllMotion, triggerMotion, hasActiveMotion } = useMotionDetection(cameras);
  
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

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <ErrorBoundary>
      <AppBackground>
        <div className="flex flex-col min-h-screen px-2 sm:px-4 md:px-8 text-text font-sans">
          {!isMobile && <Header />}

          <div className={`flex-grow flex flex-col gap-3 sm:gap-6 overflow-auto ${isMobile ? 'pb-[120px] pt-4' : 'pb-[160px]'}`}>
            <Suspense fallback={
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
          </div>

          <FooterNav current={currentTab} onNavigate={setCurrentTab} onSaveGrocery={handleSaveGrocery} onSaveTask={handleSaveTask} onSaveMeals={handleSaveMeals} groceryItems={groceryItems} meals={meals} />
        </div>

        {/* Motion Detection Modal - appears across all dashboard views */}
        <Suspense fallback={null}>
          <MotionCameraModal
            camerasWithMotion={camerasWithMotion}
            onClose={clearAllMotion}
            isVisible={hasActiveMotion}
            autoCloseDelay={60000}
          />
        </Suspense>

      </AppBackground>
    </ErrorBoundary>
  );
}
