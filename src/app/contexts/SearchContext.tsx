'use client';

import { createContext, useState, useContext, ReactNode } from 'react';


interface SearchContextType  {
searchQuery: string; 
setSearchQuery: React.Dispatch<React.SetStateAction<string>> 
}


const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
}

// Custom hook to use the SearchContext
// This hook allows components to access the search query state and the function to update it
export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
