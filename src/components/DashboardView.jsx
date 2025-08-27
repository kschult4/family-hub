import { AnimatePresence, motion } from "framer-motion";
import { lazy, Suspense } from "react";

// Lazy load dashboard views for better code splitting
const AlertsDashboard = lazy(() => import("../views/AlertsDashboard"));
const NetworkAwareHomeDashboard = lazy(() => import("../components/NetworkAwareHomeDashboard"));
const FamilyView = lazy(() => import("../views/FamilyView"));

const views = {
  ALERTS: AlertsDashboard,
  HOME: NetworkAwareHomeDashboard,
  FAMILY: FamilyView,
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
          <Suspense fallback={
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          }>
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
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
