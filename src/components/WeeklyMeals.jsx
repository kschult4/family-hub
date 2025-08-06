import { useState } from "react";
import MealsModal from "./MealsModal";
import SectionHeader from "./SectionHeader";

const defaultMeals = {
  Monday: "Lemon Herb Chicken with Rice",
  Tuesday: "Spaghetti Bolognese",
  Wednesday: "Grilled Salmon & Quinoa",
  Thursday: "Tacos with Black Beans",
  Friday: "Homemade Pizza Night",
  Saturday: "Burgers & Sweet Potato Fries",
  Sunday: "Roast Chicken & Veggies",
};

export default function WeeklyMeals() {
  const [meals, setMeals] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("weeklyMeals") || "null");
    return stored && Object.keys(stored).length === 7 ? stored : defaultMeals;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (newMeals) => {
    localStorage.setItem("weeklyMeals", JSON.stringify(newMeals));
    setMeals(newMeals);
    setIsModalOpen(false);
  };

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <section className="text-text mt-8">
      <SectionHeader
        title="This Week’s Meals"
        className="mb-4"
        rightSlot={
          <div className="flex gap-2">
            <button onClick={() => setIsModalOpen(true)} aria-label="Edit meals">
              ✏️
            </button>
            <button onClick={() => setIsModalOpen(true)} aria-label="Delete meals">
              🗑️
            </button>
          </div>
        }
      />

      <div className="bg-white rounded-2xl shadow-md p-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
          <ul className="flex flex-col gap-4">
            {days.slice(0, 4).map((day) => (
              <li key={day}>
                <div className="text-xs font-bold uppercase tracking-wide text-[#5A3210] mb-1">
                  {day}
                </div>
                <div className="text-lg font-normal text-gray-700 leading-snug">
                  {meals[day]}
                </div>
              </li>
            ))}
          </ul>
          <ul className="flex flex-col gap-4">
            {days.slice(4).map((day) => (
              <li key={day}>
                <div className="text-xs font-bold uppercase tracking-wide text-[#5A3210] mb-1">
                  {day}
                </div>
                <div className="text-lg font-normal text-gray-700 leading-snug">
                  {meals[day]}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isModalOpen && (
        <MealsModal
          initialData={meals}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </section>
  );
}
