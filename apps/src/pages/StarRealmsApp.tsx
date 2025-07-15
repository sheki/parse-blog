import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, Plus, RotateCcw, Users } from "lucide-react";

interface Player {
  id: string;
  name: string;
  score: number;
  authority: number;
}

const StarRealmsApp = () => {
  const [players, setPlayers] = useState<Player[]>([
    { id: "1", name: "Player 1", score: 0, authority: 50 },
    { id: "2", name: "Player 2", score: 0, authority: 50 }
  ]);
  const [newPlayerName, setNewPlayerName] = useState("");

  const updatePlayerName = (id: string, name: string) => {
    setPlayers(players.map(p => p.id === id ? { ...p, name } : p));
  };

  const updatePlayerScore = (id: string, delta: number) => {
    setPlayers(players.map(p => p.id === id ? { ...p, score: Math.max(0, p.score + delta) } : p));
  };

  const updatePlayerAuthority = (id: string, delta: number) => {
    setPlayers(players.map(p => p.id === id ? { ...p, authority: Math.max(0, p.authority + delta) } : p));
  };

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      const newPlayer: Player = {
        id: Date.now().toString(),
        name: newPlayerName.trim(),
        score: 0,
        authority: 50
      };
      setPlayers([...players, newPlayer]);
      setNewPlayerName("");
    }
  };

  const removePlayer = (id: string) => {
    if (players.length > 1) {
      setPlayers(players.filter(p => p.id !== id));
    }
  };

  const resetGame = () => {
    setPlayers(players.map(p => ({ ...p, score: 0, authority: 50 })));
  };

  const resetAll = () => {
    setPlayers([
      { id: "1", name: "Player 1", score: 0, authority: 50 },
      { id: "2", name: "Player 2", score: 0, authority: 50 }
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Users className="w-12 h-12 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Star Realms Score Keeper
          </h1>
          <p className="text-xl text-gray-600">
            Track scores and authority for your Star Realms games
          </p>
        </div>

        <div className="mb-6 flex gap-4 justify-center">
          <Button onClick={resetGame} variant="outline" className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset Scores
          </Button>
          <Button onClick={resetAll} variant="outline" className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {players.map((player) => (
            <Card key={player.id} className="bg-white shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Input
                    value={player.name}
                    onChange={(e) => updatePlayerName(player.id, e.target.value)}
                    className="text-lg font-semibold bg-transparent border-none p-0 focus:ring-0 focus:ring-offset-0"
                  />
                  {players.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePlayer(player.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Authority</Label>
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updatePlayerAuthority(player.id, -1)}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-2xl font-bold text-red-600 min-w-[60px] text-center">
                      {player.authority}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updatePlayerAuthority(player.id, 1)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updatePlayerAuthority(player.id, -5)}
                      className="flex-1"
                    >
                      -5
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updatePlayerAuthority(player.id, 5)}
                      className="flex-1"
                    >
                      +5
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Score</Label>
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updatePlayerScore(player.id, -1)}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-2xl font-bold text-blue-600 min-w-[60px] text-center">
                      {player.score}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updatePlayerScore(player.id, 1)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updatePlayerScore(player.id, -5)}
                      className="flex-1"
                    >
                      -5
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updatePlayerScore(player.id, 5)}
                      className="flex-1"
                    >
                      +5
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Add New Player</CardTitle>
            <CardDescription>Add more players to the game</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Player name"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                className="flex-1"
              />
              <Button onClick={addPlayer} disabled={!newPlayerName.trim()}>
                Add Player
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StarRealmsApp;