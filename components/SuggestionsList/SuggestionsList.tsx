import React from "react";
import { Suggestion } from "../AddressToCoordinates/AddressToCoordinates";

interface SuggestionListProps {
  suggestions: Suggestion[];
  onSelectSuggestion: (suggestion: Suggestion) => void;
}

const SuggestionList: React.FC<SuggestionListProps> = ({ suggestions, onSelectSuggestion }) => {
  return (
    <div className="bg-white shadow-md rounded-md mt-2 absolute">
      <ul className="divide-y divide-gray-200">
        {suggestions.map((item) => (
          <li key={item.id}>
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100 transition duration-150 ease-in-out"
              onClick={() => onSelectSuggestion(item)}
            >
              {item.place_name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SuggestionList;
