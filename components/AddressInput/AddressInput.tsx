import React from "react";
import { Search, X } from "lucide-react";

interface AddressInputProps {
  address: string;
  onChangeAddress: (text: string) => void;
  onClearAddress: () => void;
}

const AddressInput: React.FC<AddressInputProps> = ({
  address,
  onChangeAddress,
  onClearAddress,
}) => {
  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <input
          autoFocus
          onBlur={() => {
            onChangeAddress(address);
          }}
          onChange={(e) => {
            onChangeAddress(e.target.value);
          }}
          value={address}
          className="w-full py-2 pl-10 pr-10 text-sm text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out truncate"
          placeholder="Search"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        {address && (
          <button
            onClick={onClearAddress}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default AddressInput;
