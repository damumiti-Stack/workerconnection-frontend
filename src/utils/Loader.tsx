import React from "react";
import { Loader2Icon } from "lucide-react";

interface LoaderProps {
  message?: string;
  fullscreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ message = "Loading...", fullscreen = false }) => {
  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <Loader2Icon
            className="h-10 w-10 text-green-600 animate-spin"
          />
          <p className="mt-4 text-gray-700 font-medium">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <Loader2Icon className="h-6 w-6 text-green-600 animate-spin" />
      {message && <span className="ml-2 text-gray-700 font-medium">{message}</span>}
    </div>
  );
};

export default Loader;
