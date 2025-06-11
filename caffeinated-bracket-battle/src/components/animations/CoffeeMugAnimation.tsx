
import { Coffee } from "lucide-react";

const CoffeeMugAnimation = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="relative">
        <div className="animate-bounce">
          <Coffee className="w-16 h-16 text-amber-600" />
        </div>
        <div className="absolute -top-2 -right-1 w-4 h-4">
          <div className="animate-pulse bg-amber-200 rounded-full w-2 h-2 opacity-60"></div>
          <div className="animate-pulse bg-amber-300 rounded-full w-1 h-1 ml-1 mt-1 opacity-40 animation-delay-150"></div>
          <div className="animate-pulse bg-amber-400 rounded-full w-1 h-1 ml-2 opacity-30 animation-delay-300"></div>
        </div>
      </div>
    </div>
  );
};

export default CoffeeMugAnimation;
