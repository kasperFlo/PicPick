"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSearch } from '@/app/contexts/SearchContext';

export default function Header() {
  const router = useRouter();
  const { searchQuery, setSearchQuery } = useSearch();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Update the context with the search query
    setSearchQuery(query);
    
    // Redirect to the search page with the query
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  

  return (
    <header className="bg-[#053358] text-white">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <Link href="/" className="text-2xl font-bold">PicPick</Link>
        </div>
        
        <form onSubmit={handleSearch} className="w-full md:w-1/2 mb-4 md:mb-0">
          <div className="flex rounded-full overflow-hidden shadow-md">
            <input
              type="text"
              placeholder="Search for products..."
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              className="flex-grow p-2 text-[#333F49] focus:outline-none bg-[#BCDFFB]"
            />
            <button 
              type="submit" 
              className="bg-[#2196F3] hover:bg-[#0966AF] text-white px-4 py-2 transition-colors"
            >
              Search
            </button>
          </div>
        </form>
        
        <nav className="flex space-x-4">
          <Link href="/wishlist" className="hover:text-[#6EB8F7]">Wishlist</Link>
          <Link href="/account" className="hover:text-[#6EB8F7]">Account</Link>
        </nav>
      </div>
    </header>
  );
}
