
import { useState, useEffect } from "react";
import CoffeeMugAnimation from "./CoffeeMugAnimation";
import LatteArtAnimation from "./LatteArtAnimation";
import CroissantAnimation from "./CroissantAnimation";

const animations = [
  CoffeeMugAnimation,
  LatteArtAnimation,
  CroissantAnimation,
];

const corners = [
  "translate-x-full -translate-y-full", // top-right
  "-translate-x-full -translate-y-full", // top-left
  "translate-x-full translate-y-full", // bottom-right
  "-translate-x-full translate-y-full", // bottom-left
];

interface VotingAnimationProps {
  onComplete: () => void;
}

const VotingAnimation = ({ onComplete }: VotingAnimationProps) => {
  const [AnimationComponent, setAnimationComponent] = useState(() => 
    animations[Math.floor(Math.random() * animations.length)]
  );
  const [slideDirection] = useState(() => 
    corners[Math.floor(Math.random() * corners.length)]
  );
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Start the slide-in animation
    setTimeout(() => setIsVisible(true), 50);

    const timer = setTimeout(() => {
      onComplete();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 bg-amber-50/80 backdrop-blur-sm flex items-center justify-center z-50 transition-transform duration-500 ease-out ${
        isVisible ? 'translate-x-0 translate-y-0' : slideDirection
      }`}
    >
      <div className="bg-white rounded-lg p-8 shadow-lg">
        <AnimationComponent />
        
        {/* Growing dots */}
        <div className="flex justify-center space-x-2 mt-4">
          <div className="w-2 h-2 bg-amber-600 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-amber-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-amber-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default VotingAnimation;
