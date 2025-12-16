import React from "react";
import { format } from "date-fns";

interface LastLoggedInProps {
  time?: string | Date | null; // optional, can be string or Date
  formatStr?: string;   // optional, default format
}

const LastLoggedIn: React.FC<LastLoggedInProps> = ({ time, formatStr = "dd MMM yyyy, h:mm a" }) => {
  if (!time) {
    return (
      <div className="text-gray-600">
        <h2 className="font-semibold text-gray-800">Last Logged In</h2>
        <p>Never Logged In</p>
      </div>
    );
  }

  const dateToFormat = new Date(time);

  return (
    <div className="text-gray-600">
      <h2 className="font-semibold text-gray-800">Last Logged In</h2>
      <p>{format(dateToFormat, formatStr)}</p>
    </div>
  );
};

export default LastLoggedIn;
