
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
    <div className="text-center py-8 bg-white border border-stone-200 rounded-xl mb-8 shadow-sm">
      <div className="flex justify-center mb-4">
        <div className="bg-stone-100 p-3 rounded-full">
          <Coffee className="w-8 h-8 text-stone-600" />
        </div>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-stone-900">{title}</h1>
      <p className="text-stone-600 text-lg">{subtitle}</p>
    </div>
  );
};

export default TournamentHeader;
