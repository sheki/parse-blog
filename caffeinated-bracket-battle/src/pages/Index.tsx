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
  eligibilityFilter?: (dateTime: Date) => boolean;
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
    {
      id: "1",
      name: "Proyecto Diaz Coffee",
      image: "/images/proyecto-diaz-coffee.jpg",
      eligibilityFilter: (dateTime: Date) => {
        const hour = dateTime.getHours();
        const day = dateTime.getDay();
        // Closed Sundays, open 8am-3pm other days
        if (day === 0) return false; // Sunday
        return hour >= 8 && hour < 15;
      },
    },
    {
      id: "2",
      name: "Mother Tongue Coffee",
      image: "/images/mother-tongue-coffee.jpg",
    },
    {
      id: "3",
      name: "Crown Coffee",
      image: "/images/crown-coffee.jpg",
    },
    {
      id: "4",
      name: "Timeless Coffee",
      image: "/images/timeless-coffee.jpg",
    },
    {
      id: "5",
      name: "Bicycle Coffee",
      image: "/images/bicycle-coffee.jpg",
    },
    {
      id: "6",
      name: "Pizzaiolo",
      image: "/images/pizzaiolo.jpg",
      eligibilityFilter: (dateTime: Date) => {
        const hour = dateTime.getHours();
        const day = dateTime.getDay();
        // Open Wed-Sun 8am-12pm
        if (day < 3) return false; // Monday, Tuesday
        return hour >= 8 && hour < 12; // 8am-12pm
      },
    },
    {
      id: "7",
      name: "Third Culture Berkeley",
      image: "/images/third-culture-berkeley.jpg",
    },
    {
      id: "8",
      name: "Xochi the Dog Cafe",
      image: "/images/xochi-dog-cafe.jpg",
    },
    {
      id: "9",
      name: "Starter Bakery",
      image: "/images/starter-bakery.jpg",
    },
    {
      id: "10",
      name: "Haddon Hill Cafe",
      image: "/images/haddon-hill-cafe.jpg",
    },
  ];

  const filterEligibleShops = (
    shops: CoffeeShop[],
    dateTime: Date,
  ): CoffeeShop[] => {
    return shops.filter((shop) => {
      // If no eligibility filter is provided, shop is always eligible
      if (!shop.eligibilityFilter) return true;
      // Otherwise, use the shop's custom eligibility function
      return shop.eligibilityFilter(dateTime);
    });
  };

  const createNextMatch = (shops: CoffeeShop[]): Match | null => {
    if (shops.length < 2) return null;

    // Randomly select two different coffee shops
    const shuffledShops = [...shops].sort(() => Math.random() - 0.5);

    return {
      id: `match-${Date.now()}`,
      shop1: shuffledShops[0],
      shop2: shuffledShops[1],
    };
  };

  useEffect(() => {
    const now = new Date();
    const eligibleShops = filterEligibleShops(initialCoffeeShops, now);
    setRemainingShops(eligibleShops);
    const firstMatch = createNextMatch(eligibleShops);
    setCurrentMatch(firstMatch);
  }, []);

  const handleVote = (winnerId: string) => {
    if (!currentMatch) return;

    setShowAnimation(true);
  };

  const handleAnimationComplete = () => {
    if (!currentMatch) return;

    const winner =
      currentMatch.shop1.id === currentMatch.shop1.id
        ? currentMatch.shop1
        : currentMatch.shop2;

    // Remove both shops from remaining and add winner back to the end
    const updatedShops = remainingShops.filter(
      (shop) =>
        shop.id !== currentMatch.shop1.id && shop.id !== currentMatch.shop2.id,
    );
    updatedShops.push(winner);

    setRemainingShops(updatedShops);

    // Check if we have a champion
    if (updatedShops.length === 1) {
      setChampion(updatedShops[0]);
      setTournamentComplete(true);
      setCurrentMatch(null);
      setShowAnimation(false);
      return;
    }

    // Create next match
    const nextMatch = createNextMatch(updatedShops);
    setCurrentMatch(nextMatch);
    setShowAnimation(false);
  };

  const resetTournament = () => {
    const now = new Date();
    const eligibleShops = filterEligibleShops(initialCoffeeShops, now);
    setRemainingShops(eligibleShops);
    const firstMatch = createNextMatch(eligibleShops);
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
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-neutral-100 p-4">
        <div className="max-w-4xl mx-auto">
          <TournamentHeader
            title="🏆 Tournament Complete!"
            subtitle="We have a champion!"
          />

          <Card className="p-8 text-center bg-gradient-to-br from-stone-100 to-neutral-50">
            <div className="max-w-md mx-auto">
              <h2 className="text-3xl font-bold text-stone-800 mb-6">
                Champion
              </h2>
              <img
                src={champion.image}
                alt={champion.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-2xl font-bold text-stone-700 mb-6">
                {champion.name}
              </h3>
              <Button
                onClick={resetTournament}
                className="bg-stone-600 hover:bg-stone-700 text-white px-8 py-3"
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
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-neutral-100 p-4">
      {showAnimation && (
        <VotingAnimation onComplete={handleAnimationComplete} />
      )}

      <div className="max-w-4xl mx-auto">
        <TournamentHeader />

        {currentMatch && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-stone-600 text-lg mb-4">
                {remainingShops.length} coffee shops remaining
              </p>
            </div>

            <Card className="p-6 bg-gradient-to-br from-stone-50 to-neutral-50">
              <div className="space-y-4">
                <h3 className="text-center font-semibold text-stone-700 mb-4 text-xl">
                  Choose your favorite
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <CoffeeShopCard
                    coffeeShop={currentMatch.shop1}
                    onVote={() => handleVote(currentMatch.shop1.id)}
                    showVoteButton={true}
                  />

                  <div className="flex items-center justify-center sm:hidden">
                    <div className="text-stone-500 font-bold text-xl">VS</div>
                  </div>

                  <CoffeeShopCard
                    coffeeShop={currentMatch.shop2}
                    onVote={() => handleVote(currentMatch.shop2.id)}
                    showVoteButton={true}
                  />
                </div>

                <div className="hidden sm:flex items-center justify-center">
                  <div className="text-stone-500 font-bold text-xl">VS</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        <div className="mt-8 text-center">
          <Button
            onClick={resetTournament}
            variant="outline"
            className="border-stone-500 text-stone-600 hover:bg-stone-500 hover:text-white"
          >
            Reset Tournament
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
