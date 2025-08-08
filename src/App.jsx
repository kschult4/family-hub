import { useState, useEffect } from "react";
import Header from "./components/Header";
import FooterNav from "./components/FooterNav";
import DashboardView from "./components/DashboardView";
import AppBackground from "./components/AppBackground";
import ShoppingList from "./components/ShoppingList";

export default function App() {
  const [currentTab, setCurrentTab] = useState("ALERTS");
  
  // Initialize state from localStorage
  const [groceryItems, setGroceryItems] = useState(() => {
    const saved = localStorage.getItem("groceryItems");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [meals, setMeals] = useState(() => {
    const saved = localStorage.getItem("meals");
    return saved ? JSON.parse(saved) : {};
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("groceryItems", JSON.stringify(groceryItems));
  }, [groceryItems]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("meals", JSON.stringify(meals));
  }, [meals]);

  // Handler to add a grocery item from modal
  const handleSaveGrocery = (newItem) => {
    setGroceryItems((prev) => [newItem, ...prev]);
  };

  // Handler to add a task from modal
  const handleSaveTask = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
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
          <DashboardView currentTab={currentTab} groceryItems={groceryItems} setGroceryItems={setGroceryItems} tasks={tasks} setTasks={setTasks} meals={meals} setMeals={setMeals} />
        </div>

        <FooterNav current={currentTab} onNavigate={setCurrentTab} onSaveGrocery={handleSaveGrocery} onSaveTask={handleSaveTask} onSaveMeals={handleSaveMeals} groceryItems={groceryItems} />
      </div>
    </AppBackground>
  );
}
