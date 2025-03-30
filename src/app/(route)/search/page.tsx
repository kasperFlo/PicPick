"use client";

import React, { useState, useEffect } from "react";
import { poppins, epilogue } from '@/lib/fonts';
import { useSearchParams } from 'next/navigation';
import { useSearch } from "@/app/contexts/SearchContext";

// Define the structure of a product result based on your API response
type Product = {
  name: string;
  price: {
    value: number;
    currency: string;
    formatted: string;
  };
  seller: string;
  platform: string;
  link: string;
  image: string;
  rating?: {
    value: number;
    count: number;
  };
  shipping?: string;
  condition?: string;
};

export default function SearchPage() {
  const { searchQuery, setSearchQuery } = useSearch();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState<string>(searchParams.get('q') || '');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const currentQuery = searchParams.get('q') || '';
    if (currentQuery) {
      setQuery(currentQuery);
      // Trigger search with the new query
      fetchSearchResults(currentQuery);
    }
  }, [searchParams]);
  
  // Create a separate function for the fetch logic
  const fetchSearchResults = async (searchTerm: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/searchProduct/${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const data = await response.json();
      setResults(data.data || []);
    } catch (error) {
      console.error('Error fetching results:', error);
      setError('Failed to fetch results. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };
  

  // useEffect(() => {
  //     const searchWithoutEvent = async () => {
  //       setLoading(true);
  //       setError(null);
  
  //       try {
  //         const response = await fetch(`/api/searchProduct/${encodeURIComponent(query)}`);
  //         if (!response.ok) {
  //           throw new Error('Failed to fetch data');
  //         }
  
  //         const data = await response.json();
  //         console.log('Response data:', data);
  
  //         setResults(data.data || []);
  //       } catch (error) {
  //         console.error('Error fetching results:', error);
  //         setError('Failed to fetch results. Please try again.');
  //         setResults([]);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };
  
  //     if (query) {
  //       searchWithoutEvent();
  //     }
  //   }, [query]);
  
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Call your backend API route
      const response = await fetch(`/api/searchProduct/${encodeURIComponent(query)}`)

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      setResults(data.data || []);
    } catch (error) {
      console.error('Error fetching results:', error);
      setError('Failed to fetch results. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${poppins.variable} bg-[#EFF2F4] min-h-screen text-[#1E252B] p-6 font-poppins`}>
      <h1 className={`${epilogue.className} text-4xl font-bold mb-6 text-[#053358]`}>
        Product Search
      </h1>
      
      <form onSubmit={handleSearch} className="max-w-xl mb-8">
        <div className="flex rounded-full overflow-hidden shadow-md">
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
  
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
  
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2196F3]"></div>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map((product, index) => (
            <div
              key={index}
              className="bg-white border border-[#E2E7EB] rounded-lg p-4 shadow hover:shadow-lg transition flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-3">
                <h2 
                  className={`${epilogue.className} text-xl font-semibold line-clamp-2 h-14 overflow-hidden`}
                >
                  {product.name}
                </h2>
                <span className="text-red-500 text-xl cursor-pointer flex-shrink-0 ml-2">❤️</span>
              </div>
              
              <div className="w-full h-48 mb-4 bg-[#EFF2F4] rounded overflow-hidden flex items-center justify-center">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/300x200?text=No+Image";
                    }}
                  />
                ) : (
                  <span className="text-[#ACB9C5] text-lg">No Image</span>
                )}
              </div>
              
              <div className="mb-3 flex-grow flex flex-col justify-between">
                <div>
                  <p className="text-[#76BC9F] text-sm mb-1 truncate">{product.platform}</p>
                  <p className="text-[#485967] text-sm mb-1 truncate">Seller: {product.seller}</p>
                  {product.rating && (
                    <div className="flex items-center text-sm mb-1">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span>{product.rating.value}</span>
                      <span className="text-[#ACB9C5] ml-1">({product.rating.count} reviews)</span>
                    </div>
                  )}
                  {product.shipping && (
                    <p className="text-green-600 text-sm truncate">{product.shipping}</p>
                  )}
                </div>
                
                <p className="font-bold text-lg text-[#1E252B] mt-2">
                  {product.price.formatted}
                </p>
              </div>
              
              <div className="flex gap-2 mt-3 pt-3 border-t border-[#E2E7EB]">
                <a 
                  href={product.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#2196F3] hover:bg-[#0966AF] text-white px-4 py-2 rounded-full text-sm flex items-center gap-1 transition-colors flex-1 justify-center"
                >
                  <span>👁️</span> View Details
                </a>
                <button className="bg-[#074C83] hover:bg-[#053358] text-white px-4 py-2 rounded-full text-sm flex items-center gap-1 transition-colors flex-1 justify-center">
                  <span>🛒</span> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : query ? (
        <p className="text-[#5D7285] text-center p-8 bg-white rounded-lg shadow">
          No results found for "{query}". Try searching for something else.
        </p>
      ) : (
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <p className="text-[#5D7285] mb-2">Enter a search term to find products</p>
          <p className="text-sm text-[#91A3B2]">Try searching for "iPhone", "laptop", or "headphones"</p>
        </div>
      )}
    </div>
  );
}  