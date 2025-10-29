"use client";

import React, { FC, useEffect, useRef, useState } from "react";

interface SearchBarProps {
  placeholder?: string;
  /** Called when the search term changes (debounced) */
  onSearch?: (term: string) => void;
  /** Debounce time in ms */
  debounceMs?: number;
}

const SearchBar: FC<SearchBarProps> = ({
  placeholder = "Search notes...",
  onSearch,
  debounceMs = 300,
}) => {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    // debounce callback to parent
    if (timer.current) {
      window.clearTimeout(timer.current);
    }
    timer.current = window.setTimeout(() => {
      onSearch?.(value.trim());
    }, debounceMs);

    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [value, onSearch, debounceMs]);

  useEffect(() => {
    // keyboard shortcut: focus search when `/` is pressed and target isn't an input
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "/") {
        const active = document.activeElement;
        if (
          active &&
          (active.tagName === "INPUT" || active.tagName === "TEXTAREA")
        ) {
          return;
        }
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const clear = () => {
    setValue("");
    onSearch?.("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        aria-label="Search notes"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full h-[38px] px-4 pr-10 border rounded-[5px] bg-transparent text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
      />

      {value ? (
        <button
          onClick={clear}
          aria-label="Clear search"
          className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ) : null}

      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-70">
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
