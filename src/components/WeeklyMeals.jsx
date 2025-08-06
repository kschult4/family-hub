import SectionHeader from "./SectionHeader";
import AnimatedMealCarousel from "./AnimatedMealCarousel";

export default function WeeklyMeals() {
  return (
    <div className="w-full mb-8">
      <SectionHeader title="Weekly Meal Plan" className="mb-6" />
      <AnimatedMealCarousel />
    </div>
  );
}
