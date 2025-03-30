import React from "react";

type EmptyStateProps = {
  query?: string;
};

export default function NoValidState({ query }: EmptyStateProps) {
  if (query) {
    return (
      <p className="text-[#5D7285] text-center p-8 bg-white rounded-lg shadow">
        No results found for "{query} with the selected filters". Try searching for something else.
      </p>
    );
  }
  
  return (
    <div className="text-center p-8 bg-white rounded-lg shadow">
      <p className="text-[#5D7285] mb-2">No results found for {query} with the selected filters. Try searching for something else.</p>
      <p className="text-sm text-[#91A3B2]">Try searching adjusting your filters"</p>
    </div>
  );
}
