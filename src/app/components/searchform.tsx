import React from "react";

type SearchFormProps = {
  query: string;
  setQuery: (query: string) => void;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  className?: string;
};

export default function SearchForm({
  query,
  setQuery,
  setSearchQuery,
  handleSearch,
  loading,
  className = "",
}: SearchFormProps) {
  return (
    <form onSubmit={handleSearch} className={className}>
      <div className="flex rounded-full overflow-hidden shadow-md w-full">
        <input
          type="text"
          placeholder="Search for products..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSearchQuery(e.target.value);
          }}
          className="flex-grow p-4 focus:outline-none text-[#333F49]"
        />
        <button
          type="submit"
          className="bg-[#2196F3] hover:bg-[#0966AF] text-white px-6 py-4 transition-colors"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
    </form>
  );
}
