import { AnimatePresence, motion } from "framer-motion";
import AlertsDashboard from "../views/AlertsDashboard";

function HomeDashboard() {
  return <div className="text-center p-10 text-xl">Coming soon: Home Dashboard</div>;
}

function FamilyDashboard() {
  return <div className="text-center p-10 text-xl">Coming soon: Family Dashboard</div>;
}

const views = {
  ALERTS: AlertsDashboard,
  HOME: HomeDashboard,
  FAMILY: FamilyDashboard,
};

export default function DashboardView({ currentTab }) {
  const ViewComponent = views[currentTab];

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
          <ViewComponent />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
