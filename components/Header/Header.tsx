import React from "react";

interface HeaderProps {
  onSearch: (query: string) => void;
  onUnitToggle: () => void;
  unit: "C" | "F";
}

const Header: React.FC<HeaderProps> = ({ onSearch, onUnitToggle, unit }) => {
  return (
    <header className="flex justify-between items-center p-4">
      <div className="search-bar flex items-center">
        <input
          type="text"
          placeholder="Search for places ..."
          className="p-2 rounded-l-lg"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch((e.target as HTMLInputElement).value);
            }
          }}
        />
        <button className="bg-gray-200 p-2 rounded-r-lg">🔄</button>
      </div>
      <div className="unit-toggle">
        <button
          className={`px-2 py-1 rounded-l-lg ${
            unit === "C" ? "bg-black text-white" : "bg-gray-200"
          }`}
          onClick={() => unit === "F" && onUnitToggle()}
        >
          °C
        </button>
        <button
          className={`px-2 py-1 rounded-r-lg ${
            unit === "F" ? "bg-black text-white" : "bg-gray-200"
          }`}
          onClick={() => unit === "C" && onUnitToggle()}
        >
          °F
        </button>
      </div>
      <div className="user-profile">
        <img src="/path-to-user-image.jpg" alt="User" className="w-10 h-10 rounded-full" />
      </div>
    </header>
  );
};

export default Header;
