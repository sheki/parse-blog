import { useState, useEffect } from "react";
import TournamentHeader from "@/components/TournamentHeader";
import CoffeeShopCard from "@/components/CoffeeShopCard";
import VotingAnimation from "@/components/animations/VotingAnimation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface CoffeeShop {
  id: string;
  name: string;
  image: string;
  votes?: number;
}

interface Match {
  id: string;
  shop1: CoffeeShop;
  shop2: CoffeeShop;
  winner?: CoffeeShop;
}

const Index = () => {
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [remainingShops, setRemainingShops] = useState<CoffeeShop[]>([]);
  const [champion, setChampion] = useState<CoffeeShop | null>(null);
  const [tournamentComplete, setTournamentComplete] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const initialCoffeeShops: CoffeeShop[] = [
    { id: "1", name: "Bean & Gone", image: "photo-1649972904349-6e44c42644a7" },
    { id: "2", name: "The Grind House", image: "photo-1488590528505-98d2b5aba04b" },
    { id: "3", name: "Café Mocha", image: "photo-1581091226825-a6a2a5aee158" },
    { id: "4", name: "Espresso Yourself", image: "photo-1486312338219-ce68d2c6f44d" },
    { id: "5", name: "Java Junction", image: "photo-1460925895917-afdab827c52f" },
    { id: "6", name: "Steam & Bean", image: "photo-1649972904349-6e44c42644a7" },
    { id: "7", name: "Roast & Toast", image: "photo-1488590528505-98d2b5aba04b" },
    { id: "8", name: "Brew Crew", image: "photo-1581091226825-a6a2a5aee158" },
  ];

  const createNextMatch = (shops: CoffeeShop[]): Match | null => {
    if (shops.length < 2) return null;
    
    return {
      id: `match-${Date.now()}`,
      shop1: shops[0],
      shop2: shops[1],
    };
  };

  useEffect(() => {
    setRemainingShops(initialCoffeeShops);
    const firstMatch = createNextMatch(initialCoffeeShops);
    setCurrentMatch(firstMatch);
  }, []);

  const handleVote = (winnerId: string) => {
    if (!currentMatch) return;

    setShowAnimation(true);
  };

  const handleAnimationComplete = () => {
    if (!currentMatch) return;

    const winner = currentMatch.shop1.id === currentMatch.shop1.id ? currentMatch.shop1 : currentMatch.shop2;
    
    // Remove both shops from remaining and add winner back to the end
    const updatedShops = remainingShops.filter(shop => 
      shop.id !== currentMatch.shop1.id && shop.id !== currentMatch.shop2.id
    );
    updatedShops.push(winner);

    setRemainingShops(updatedShops);

    // Check if we have a champion
    if (updatedShops.length === 1) {
      setChampion(updatedShops[0]);
      setTournamentComplete(true);
      setCurrentMatch(null);
      setShowAnimation(false);
      toast({
        title: "Tournament Complete!",
        description: `${updatedShops[0].name} is the Coffee Shop Champion!`,
      });
      return;
    }

    // Create next match
    const nextMatch = createNextMatch(updatedShops);
    setCurrentMatch(nextMatch);
    setShowAnimation(false);
  };

  const resetTournament = () => {
    setRemainingShops(initialCoffeeShops);
    const firstMatch = createNextMatch(initialCoffeeShops);
    setCurrentMatch(firstMatch);
    setChampion(null);
    setTournamentComplete(false);
    toast({
      title: "Tournament Reset",
      description: "Starting a new coffee shop championship!",
    });
  };

  if (tournamentComplete && champion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4">
        <div className="max-w-4xl mx-auto">
          <TournamentHeader 
            title="🏆 Tournament Complete!" 
            subtitle="We have a champion!"
          />
          
          <Card className="p-8 text-center bg-gradient-to-br from-amber-100 to-orange-100">
            <div className="max-w-md mx-auto">
              <h2 className="text-3xl font-bold text-amber-900 mb-6">Champion</h2>
              <img
                src={`https://images.unsplash.com/${champion.image}?w=400&h=300&fit=crop`}
                alt={champion.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-2xl font-bold text-amber-800 mb-6">{champion.name}</h3>
              <Button 
                onClick={resetTournament}
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3"
              >
                Start New Tournament
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4">
      {showAnimation && <VotingAnimation onComplete={handleAnimationComplete} />}
      
      <div className="max-w-4xl mx-auto">
        <TournamentHeader />
        
        {currentMatch && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-amber-700 text-lg mb-4">
                {remainingShops.length} coffee shops remaining
              </p>
            </div>

            <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50">
              <div className="space-y-4">
                <h3 className="text-center font-semibold text-amber-800 mb-4 text-xl">
                  Choose your favorite
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <CoffeeShopCard
                    coffeeShop={currentMatch.shop1}
                    onVote={() => handleVote(currentMatch.shop1.id)}
                    showVoteButton={true}
                  />
                  
                  <div className="flex items-center justify-center sm:hidden">
                    <div className="text-amber-600 font-bold text-xl">VS</div>
                  </div>
                  
                  <CoffeeShopCard
                    coffeeShop={currentMatch.shop2}
                    onVote={() => handleVote(currentMatch.shop2.id)}
                    showVoteButton={true}
                  />
                </div>
                
                <div className="hidden sm:flex items-center justify-center">
                  <div className="text-amber-600 font-bold text-xl">VS</div>
                </div>
              </div>
            </Card>
          </div>
        )}
        
        <div className="mt-8 text-center">
          <Button 
            onClick={resetTournament}
            variant="outline"
            className="border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white"
          >
            Reset Tournament
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
