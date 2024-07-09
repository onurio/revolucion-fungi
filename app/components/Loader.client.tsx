// src/components/Loader.tsx

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex items-center justify-center space-x-2 animate-spin">
        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
        <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
      </div>
    </div>
  );
};

export default Loader;
