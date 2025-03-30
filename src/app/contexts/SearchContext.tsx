'use client';
import { createContext, useState, useContext, ReactNode } from 'react';

const SearchContext = createContext<{ 
  searchQuery: string; 
  setSearchQuery: React.Dispatch<React.SetStateAction<string>> 
} | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
