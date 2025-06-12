
import { Croissant } from "lucide-react";

const CroissantAnimation = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="animate-bounce" style={{ animationDuration: '2s' }}>
        <Croissant className="w-16 h-16 text-amber-600 animate-pulse" />
      </div>
    </div>
  );
};

export default CroissantAnimation;
