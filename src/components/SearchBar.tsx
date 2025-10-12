const SearchBar = () => {
  return (
    <div className="relative flex items-center mt-4 border border-primary/60 rounded-lg bg-transparent h-10 w-full hover:border-primary transition-all duration-200">
      <input
        type="text"
        placeholder="Search notes"
        className="pl-10 pr-4 w-full outline-none bg-transparent text-gray-700 placeholder-gray-500"
      />
      <div className="absolute left-3 top-1/2 -translate-y-1/2">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          className="opacity-70"
        >
          <path
            d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
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
