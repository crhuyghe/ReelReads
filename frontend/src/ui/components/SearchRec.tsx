import React, { useState } from "react";

interface SearchInputProps {
  onSearch: (query: string) => void;
}

const SearchRec: React.FC<SearchInputProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <>
      <div className="relative px-2 py-1 mt-[2rem] mx-[4rem]">
        <img
          src="../../../src/ui/assets/magnifier.png"
          className="w-5 absolute left-3 top-1/2 transform -translate-y-1/2"
        />
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={handleChange}
          className="py-1 pl-8 w-full ring ring-2 ring-primary rounded-lg"
        />
      </div>
    </>
  );
};

export default SearchRec;
