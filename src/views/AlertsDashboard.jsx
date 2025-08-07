import Calendar from "../components/Calendar";
import ShoppingList from "../components/ShoppingList";
import TaskList from "../components/TaskList";
import WeeklyMeals from "../components/WeeklyMeals";

export default function AlertsDashboard({ groceryItems, setGroceryItems, tasks, setTasks, meals, setMeals }) {
  return (
    <div className="p-4 flex flex-col gap-4">
      <Calendar />
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Half-width ShoppingList at the top left of the grid */}
        <ShoppingList items={groceryItems} setItems={setGroceryItems} />
        <TaskList tasks={tasks} setTasks={setTasks} />
      </section>
      <WeeklyMeals meals={meals} setMeals={setMeals} /> {/* ✅ Full-width below the grid */}
    </div>
  );
}
