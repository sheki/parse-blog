
const LatteArtAnimation = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 bg-amber-100 rounded-full animate-pulse"></div>
        <div className="absolute inset-2 bg-amber-200 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
        <div className="absolute inset-4 bg-amber-800 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full opacity-80 animate-pulse"></div>
      </div>
    </div>
  );
};

export default LatteArtAnimation;
