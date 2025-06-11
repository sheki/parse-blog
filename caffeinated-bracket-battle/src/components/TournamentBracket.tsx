
import { useState } from "react";
import CoffeeShopCard from "./CoffeeShopCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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

interface TournamentBracketProps {
  matches: Match[];
  onVote: (matchId: string, winnerId: string) => void;
  currentRound: number;
  totalRounds: number;
}

const TournamentBracket = ({ matches, onVote, currentRound, totalRounds }: TournamentBracketProps) => {
  const getRoundName = (round: number, total: number) => {
    if (round === total) return "Final";
    if (round === total - 1) return "Semi-Final";
    if (round === total - 2) return "Quarter-Final";
    return `Round ${round}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-amber-900 mb-2">
          {getRoundName(currentRound, totalRounds)}
        </h2>
        <div className="flex justify-center mb-4">
          <div className="flex space-x-2">
            {Array.from({ length: totalRounds }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i + 1 <= currentRound ? 'bg-amber-600' : 'bg-amber-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {matches.map((match) => (
          <Card key={match.id} className="p-6 bg-gradient-to-br from-amber-50 to-orange-50">
            <div className="space-y-4">
              <h3 className="text-center font-semibold text-amber-800 mb-4">Match {match.id}</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CoffeeShopCard
                  coffeeShop={match.shop1}
                  onVote={() => onVote(match.id, match.shop1.id)}
                  isWinner={match.winner?.id === match.shop1.id}
                  showVoteButton={!match.winner}
                />
                
                <div className="flex items-center justify-center sm:hidden">
                  <div className="text-amber-600 font-bold text-xl">VS</div>
                </div>
                
                <CoffeeShopCard
                  coffeeShop={match.shop2}
                  onVote={() => onVote(match.id, match.shop2.id)}
                  isWinner={match.winner?.id === match.shop2.id}
                  showVoteButton={!match.winner}
                />
              </div>
              
              <div className="hidden sm:flex items-center justify-center">
                <div className="text-amber-600 font-bold text-xl">VS</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TournamentBracket;
