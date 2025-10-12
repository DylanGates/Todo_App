"use client";

import React, { useState, useRef, useEffect } from "react";

export type FilterOption = "all" | "completed" | "uncompleted";

type Props = {
  onChange?: (option: FilterOption) => void;
};

const labels: Record<FilterOption, string> = {
  all: "All",
  completed: "Complete",
  uncompleted: "Incomplete",
};

const FilterButton: React.FC<Props> = ({ onChange }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<FilterOption>("all");
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const choose = (opt: FilterOption) => {
    setSelected(opt);
    setOpen(false);
    onChange?.(opt);
  };

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen((s) => !s)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex justify-between items-center gap-2 px-2 py-2 rounded shadow-sm text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#6C63FF] bg-[#6C63FF] w-auto h-[38px]"
      >
        <span>{labels[selected]}</span>
        
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-3 h-3 transition-transform text-[#F7F7F7] ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
          focusable={false}
        >
          <path
            d="M7 10l5 5 5-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Filter todos"
          className="absolute right-0 text-left bg-white dark:bg-[#F7F7F7] border border-[#6C63FF20] rounded shadow-md w-[93px] py-1 z-50 list-none pl-0"
        >
          {(Object.keys(labels) as FilterOption[]).map((opt) => (
            <li
              key={opt}
              role="option"
              aria-selected={selected === opt}
              onClick={() => choose(opt)}
              className={`px-1 py-2 cursor-pointer hover:bg-[#6C63FF] dark:hover:bg-[#6C63FF20] ${
                selected === opt ? "font-semibold text-[#6C63FF]" : ""
              }`}
            >
              {labels[opt]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FilterButton;
