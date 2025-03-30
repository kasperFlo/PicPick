import React from "react";

type EmptyStateProps = {
  query?: string;
};

export default function EmptyState({ query }: EmptyStateProps) {
  if (query) {
    return (
      <p className="text-[#5D7285] text-center p-8 bg-white rounded-lg shadow">
        No results found for "{query}". Try searching for something else.
      </p>
    );
  }
  
  return (
    <div className="text-center p-8 bg-white rounded-lg shadow">
      <p className="text-[#5D7285] mb-2">Enter a search term to find products</p>
      <p className="text-sm text-[#91A3B2]">Try searching for "iPhone", "laptop", or "headphones"</p>
    </div>
  );
}
