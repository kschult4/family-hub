import { useState } from "react";
import Header from "./components/Header";
import FooterNav from "./components/FooterNav";
import DashboardView from "./components/DashboardView";
import AppBackground from "./components/AppBackground";
import ShoppingList from "./components/ShoppingList";

export default function App() {
  const [currentTab, setCurrentTab] = useState("ALERTS");
  const [groceryItems, setGroceryItems] = useState([]);

  // Handler to add a grocery item from modal
  const handleSaveGrocery = (newItem) => {
    setGroceryItems((prev) => [newItem, ...prev]);
  };

  return (
    <AppBackground>
      <div className="flex flex-col min-h-screen px-4 md:px-8 text-text font-sans">
        <Header />

        <div className="flex-grow flex flex-col gap-6 overflow-auto pb-[96px]">
          <DashboardView currentTab={currentTab} />
        </div>

        <FooterNav current={currentTab} onNavigate={setCurrentTab} onSaveGrocery={handleSaveGrocery} />
      </div>
    </AppBackground>
  );
}
