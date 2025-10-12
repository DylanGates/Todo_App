"use client";

import type { FC } from "react";

interface SearchBarProps {
  placeholder?: string;
  onClick?: () => void;
}

const SearchBar: FC<SearchBarProps> = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="relative flex justify-between items-center border border-[#6C63FF]/60 px-4
                 rounded-[5px] bg-transparent text-gray-700 text-sm h-[38px] cursor-text 
                 hover:border-[#6C63FF] transition-all duration-200 w-full"
    >
      <div className="pl-4 pr-10 w-full select-none text-gray-500">
        Search note...
      </div>

      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-70"
        >
          <path
            d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default SearchBar;
