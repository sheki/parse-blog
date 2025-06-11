
import { Coffee } from "lucide-react";

interface TournamentHeaderProps {
  title?: string;
  subtitle?: string;
}

const TournamentHeader = ({ 
  title = "Coffee Shop Championship", 
  subtitle = "Vote for your favorite local coffee spots!" 
}: TournamentHeaderProps) => {
  return (
    <div className="text-center py-8 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg mb-8">
      <div className="flex justify-center mb-4">
        <div className="bg-white/20 p-3 rounded-full">
          <Coffee className="w-8 h-8" />
        </div>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
      <p className="text-amber-100 text-lg">{subtitle}</p>
    </div>
  );
};

export default TournamentHeader;
