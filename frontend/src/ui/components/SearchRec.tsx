import React, { useState } from "react";
import { useTheme } from "./ThemeContext";

interface SearchInputProps {
  onSearch: (query: string) => void;
  onEnter: (e: React.FormEvent) => void;
}

const SearchRec: React.FC<SearchInputProps> = ({ onSearch, onEnter }) => {
  const [query, setQuery] = useState<string>("");
  const { theme } = useTheme();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <>
      <div className="relative px-2 py-1 mt-[2rem] mx-[4rem] lg:mx-[5rem] xl:mx-[8rem]">
        {theme === "light" ? (
          <img
            src="../../../src/ui/assets/magnifier.png"
            className="w-5 absolute left-3 top-1/2 transform -translate-y-1/2"
          />
        ) : (
          <img
            src="/search_white.svg"
            className="w-5 absolute left-3 top-1/2 transform -translate-y-1/2"
          />
        )}
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onEnter(e); // Call the function from parent
            }
          }}
          className="py-1 pl-8 w-full bg-white dark:bg-brand-dark ring ring-2 ring-secondary_hover_light dark:ring-secondary_dark rounded-lg focus:outline-primary dark:focus:ring-secondary dark:outline-none"
        />
      </div>
    </>
  );
};

export default SearchRec;
