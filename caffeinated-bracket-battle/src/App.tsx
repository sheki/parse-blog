import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";

const App = () => (
  <TooltipProvider>
    <Index />
  </TooltipProvider>
);

export default App;
