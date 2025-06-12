import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { busSchedule } from "@/data/busSchedule";

const BusApp = () => {
  const [nextBuses, setNextBuses] = useState<{
    fromWestOakland: string[];
    toWestOakland: string[];
  }>({
    fromWestOakland: [],
    toWestOakland: [],
  });

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const isWeekend = () => {
    const day = new Date().getDay();
    return day === 0 || day === 6; // Sunday = 0, Saturday = 6
  };

  const getNextThreeBuses = (schedule: string[], currentTime: string) => {
    return schedule
      .filter(time => time >= currentTime)
      .slice(0, 3);
  };

  useEffect(() => {
    const updateBusTimes = () => {
      const currentTime = getCurrentTime();
      const weekend = isWeekend();
      
      const fromSchedule = weekend ? busSchedule.fromWestOaklandBartWeekend : busSchedule.fromWestOaklandBartWeekday;
      const toSchedule = weekend ? busSchedule.toWestOaklandBartWeekends : busSchedule.toWestOaklandBartWeekday;
      
      setNextBuses({
        fromWestOakland: getNextThreeBuses(fromSchedule, currentTime),
        toWestOakland: getNextThreeBuses(toSchedule, currentTime),
      });
    };

    updateBusTimes();
    const interval = setInterval(updateBusTimes, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/">
            <Button 
              variant="outline" 
              className="mb-4 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-2">
            🚌 West Oakland Bus Times
          </h1>
          <p className="text-blue-600 text-lg">
            Next 3 buses • {isWeekend() ? 'Weekend' : 'Weekday'} Schedule
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">
              From West Oakland BART
            </h2>
            <div className="space-y-3">
              {nextBuses.fromWestOakland.length > 0 ? (
                nextBuses.fromWestOakland.map((time, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
                  >
                    <span className="text-lg font-semibold text-blue-700">
                      {time}
                    </span>
                    <span className="text-sm text-blue-500">
                      {index === 0 ? 'Next' : `+${index * 30}min`}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-blue-600">
                  No more buses today
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
            <h2 className="text-2xl font-bold text-green-800 mb-4">
              To West Oakland BART
            </h2>
            <div className="space-y-3">
              {nextBuses.toWestOakland.length > 0 ? (
                nextBuses.toWestOakland.map((time, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
                  >
                    <span className="text-lg font-semibold text-green-700">
                      {time}
                    </span>
                    <span className="text-sm text-green-500">
                      {index === 0 ? 'Next' : `+${index * 30}min`}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-green-600">
                  No more buses today
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-blue-600 text-sm">
            Times are in 24-hour format • Updated every minute
          </p>
        </div>
      </div>
    </div>
  );
};

export default BusApp;