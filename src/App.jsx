import { useState, useEffect } from "react";
import Header from "./components/Header";
import FooterNav from "./components/FooterNav";
import DashboardView from "./components/DashboardView";
import AppBackground from "./components/AppBackground";
import ShoppingList from "./components/ShoppingList";
import MotionCameraModal from "./components/home/MotionCameraModal";
import MotionTestButton from "./components/home/MotionTestButton";
import ErrorBoundary from "./components/ErrorBoundary";
import { useFirebaseSync } from "./hooks/useFirebaseSync";
import { useHomeAssistant } from "./hooks/useHomeAssistant";
import { useMotionDetection } from "./hooks/useMotionDetection";

export default function App() {
  const [currentTab, setCurrentTab] = useState("HOME");
  console.log('🔥 App currentTab state:', currentTab);
  
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
    console.log('App: handleSaveMeals called with data:', mealsData);
    console.log('App: current meals state before save:', meals);
    setMeals(mealsData);
    console.log('App: setMeals called with:', mealsData);
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <ErrorBoundary>
      <AppBackground>
        <div className="flex flex-col min-h-screen px-2 sm:px-4 md:px-8 text-text font-sans">
          {!isMobile && <Header />}

          <div className={`flex-grow flex flex-col gap-3 sm:gap-6 overflow-auto ${isMobile ? 'pb-[120px] pt-4' : 'pb-[160px]'}`}>
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
          </div>

          <FooterNav current={currentTab} onNavigate={setCurrentTab} onSaveGrocery={handleSaveGrocery} onSaveTask={handleSaveTask} onSaveMeals={handleSaveMeals} groceryItems={groceryItems} meals={meals} />
        </div>

        {/* Motion Detection Modal - appears across all dashboard views */}
        <MotionCameraModal
          camerasWithMotion={camerasWithMotion}
          onClose={clearAllMotion}
          isVisible={hasActiveMotion}
          autoCloseDelay={60000}
        />

        {/* Test Button for Motion Detection (Development) */}
        <MotionTestButton
          cameras={cameras}
          onTriggerMotion={triggerMotion}
        />
      </AppBackground>
    </ErrorBoundary>
  );
}
