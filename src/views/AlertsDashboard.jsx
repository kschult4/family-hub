import Calendar from "../components/Calendar";
import ShoppingList from "../components/ShoppingList";
import TaskList from "../components/TaskList";
import WeeklyMeals from "../components/WeeklyMeals";

export default function AlertsDashboard() {
  return (
    <div className="p-4 flex flex-col gap-4">
      <Calendar />
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ShoppingList />
        <TaskList />
      </section>
      <WeeklyMeals /> {/* ✅ Full-width below the grid */}
    </div>
  );
}
