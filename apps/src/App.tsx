import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "./pages/Home";
import CoffeeApp from "./pages/CoffeeApp";
import BusApp from "./pages/BusApp";
import StarRealmsApp from "./pages/StarRealmsApp";

const App = () => (
  <TooltipProvider>
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/coffee" element={<CoffeeApp />} />
        <Route path="/bus" element={<BusApp />} />
        <Route path="/star-realms" element={<StarRealmsApp />} />
      </Routes>
    </Router>
  </TooltipProvider>
);

export default App;
