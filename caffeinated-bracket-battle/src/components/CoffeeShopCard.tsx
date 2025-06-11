
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coffee } from "lucide-react";

interface CoffeeShop {
  id: string;
  name: string;
  image: string;
  votes?: number;
}

interface CoffeeShopCardProps {
  coffeeShop: CoffeeShop;
  onVote?: () => void;
  isWinner?: boolean;
  showVoteButton?: boolean;
}

const CoffeeShopCard = ({ coffeeShop, onVote, isWinner, showVoteButton = true }: CoffeeShopCardProps) => {
  return (
    <Card className={`p-4 transition-all duration-300 hover:shadow-lg ${
      isWinner ? 'ring-2 ring-stone-400 bg-stone-50' : 'hover:scale-105'
    }`}>
      <div className="space-y-3">
        <div className="relative">
          <img
            src={coffeeShop.image}
            alt={coffeeShop.name}
            className="w-full h-32 object-cover rounded-md"
          />
          <div className="absolute top-2 right-2 bg-stone-600 text-white p-1 rounded-full">
            <Coffee className="w-4 h-4" />
          </div>
        </div>
        
        <div className="text-center">
          <h3 className="font-semibold text-lg text-stone-800">{coffeeShop.name}</h3>
          {coffeeShop.votes !== undefined && (
            <p className="text-sm text-stone-600">{coffeeShop.votes} votes</p>
          )}
        </div>
        
        {showVoteButton && onVote && (
          <Button 
            onClick={onVote}
            className="w-full bg-stone-600 hover:bg-stone-700 text-white"
            disabled={isWinner}
          >
            {isWinner ? 'Winner!' : 'Vote'}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default CoffeeShopCard;
