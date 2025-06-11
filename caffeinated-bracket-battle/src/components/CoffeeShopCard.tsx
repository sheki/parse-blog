
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
      isWinner ? 'ring-2 ring-amber-500 bg-amber-50' : 'hover:scale-105'
    }`}>
      <div className="space-y-3">
        <div className="relative">
          <img
            src={`https://images.unsplash.com/${coffeeShop.image}?w=300&h=200&fit=crop`}
            alt={coffeeShop.name}
            className="w-full h-32 object-cover rounded-md"
          />
          <div className="absolute top-2 right-2 bg-amber-600 text-white p-1 rounded-full">
            <Coffee className="w-4 h-4" />
          </div>
        </div>
        
        <div className="text-center">
          <h3 className="font-semibold text-lg text-amber-900">{coffeeShop.name}</h3>
          {coffeeShop.votes !== undefined && (
            <p className="text-sm text-amber-700">{coffeeShop.votes} votes</p>
          )}
        </div>
        
        {showVoteButton && onVote && (
          <Button 
            onClick={onVote}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
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
