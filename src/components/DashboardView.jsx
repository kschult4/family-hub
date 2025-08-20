import { AnimatePresence, motion } from "framer-motion";
import AlertsDashboard from "../views/AlertsDashboard";
import HomeDashboard from "../views/HomeDashboard";

function FamilyDashboard() {
  return <div className="text-center p-10 text-xl">❌ WRONG COMPONENT: Family Dashboard (this should not show for HOME tab)</div>;
}

const views = {
  ALERTS: AlertsDashboard,
  HOME: HomeDashboard,
  FAMILY: FamilyDashboard,
};

export default function DashboardView({ 
  currentTab, 
  groceryItems, 
  setGroceryItems, 
  addGroceryItem, 
  updateGroceryItem, 
  removeGroceryItem,
  tasks, 
  setTasks, 
  addTask, 
  updateTask, 
  removeTask,
  meals, 
  setMeals 
}) {
  const ViewComponent = views[currentTab];

  if (!ViewComponent) {
    return <div className="text-center p-10 text-xl">No component found for {currentTab}</div>;
  }

  return (
    <div className="relative w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <ViewComponent 
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
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
