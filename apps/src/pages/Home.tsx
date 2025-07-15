import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Coffee, Home, Bus, Users } from "lucide-react";

const HomePage = () => {
  const apps = [
    {
      id: "coffee",
      title: "Coffee Tournament",
      description: "Vote for your favorite coffee shop in this elimination tournament",
      icon: <Coffee className="w-8 h-8" />,
      path: "/coffee",
      bgColor: "from-amber-100 to-orange-100",
      borderColor: "border-amber-200"
    },
    {
      id: "bus",
      title: "Bus Times",
      description: "Check the next 3 bus times from and to West Oakland BART",
      icon: <Bus className="w-8 h-8" />,
      path: "/bus",
      bgColor: "from-blue-100 to-indigo-100",
      borderColor: "border-blue-200"
    },
    {
      id: "star-realms",
      title: "Star Realms Score Keeper",
      description: "Track scores and authority for your Star Realms card game",
      icon: <Users className="w-8 h-8" />,
      path: "/star-realms",
      bgColor: "from-purple-100 to-pink-100",
      borderColor: "border-purple-200"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Home className="w-12 h-12 text-gray-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            App Collection
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our collection of interactive applications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app) => (
            <Card 
              key={app.id} 
              className={`bg-gradient-to-br ${app.bgColor} ${app.borderColor} hover:shadow-lg transition-shadow duration-300`}
            >
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-3">
                  {app.icon}
                </div>
                <CardTitle className="text-xl font-semibold text-gray-800">
                  {app.title}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {app.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link to={app.path}>
                  <Button 
                    className="w-full bg-gray-700 hover:bg-gray-800 text-white"
                  >
                    Launch App
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm">
            More apps coming soon...
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;