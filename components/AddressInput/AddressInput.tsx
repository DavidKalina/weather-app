import React from "react";

interface AddressInputProps {
  address: string;
  onChangeAddress: (text: string) => void;
  onClearAddress: () => void;
}

const AddressInput: React.FC<AddressInputProps> = ({
  address,
  onChangeAddress,
  // onClearAddress,
}) => {
  return (
    <div className="search-container">
      <input
        autoFocus
        onBlur={() => {
          // onClearAddress();
          onChangeAddress(address);
        }}
        onChange={(e) => {
          onChangeAddress(e.target.value);
        }}
        value={address}
        style={{
          padding: 8,
          width: "100%",
          color: "#000",
          fontFamily: "BungeeInline",
        }}
        placeholder="Search"
      />
    </div>
  );
};

export default AddressInput;
