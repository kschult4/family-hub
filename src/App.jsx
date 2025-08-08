import { useState, useEffect } from "react";
import Header from "./components/Header";
import FooterNav from "./components/FooterNav";
import DashboardView from "./components/DashboardView";
import AppBackground from "./components/AppBackground";
import ShoppingList from "./components/ShoppingList";
import { useFirebaseSync } from "./hooks/useFirebaseSync";

export default function App() {
  const [currentTab, setCurrentTab] = useState("ALERTS");
  
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
    console.log('App: saving meals data:', mealsData);
    setMeals(mealsData);
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <AppBackground>
      <div className="flex flex-col min-h-screen px-2 sm:px-4 md:px-8 text-text font-sans">
        {!isMobile && <Header />}

        <div className={`flex-grow flex flex-col gap-3 sm:gap-6 overflow-auto ${isMobile ? 'pb-[80px] pt-4' : 'pb-[96px]'}`}>
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

        <FooterNav current={currentTab} onNavigate={setCurrentTab} onSaveGrocery={handleSaveGrocery} onSaveTask={handleSaveTask} onSaveMeals={handleSaveMeals} groceryItems={groceryItems} />
      </div>
    </AppBackground>
  );
}
