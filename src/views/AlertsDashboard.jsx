import Calendar from "../components/Calendar";
import ShoppingList from "../components/ShoppingList";
import TaskList from "../components/TaskList";
import WeeklyMeals from "../components/WeeklyMeals";

export default function AlertsDashboard({ groceryItems, setGroceryItems, tasks, setTasks, meals, setMeals }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  return (
    <div className={`p-2 sm:p-4 flex flex-col ${isMobile ? 'gap-3' : 'gap-4'}`}>
      {!isMobile && <Calendar />}
      <section className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2'} gap-3 sm:gap-4`}>
        <ShoppingList items={groceryItems} setItems={setGroceryItems} />
        <TaskList tasks={tasks} setTasks={setTasks} />
      </section>
      {!isMobile && <WeeklyMeals meals={meals} setMeals={setMeals} />}
    </div>
  );
}
