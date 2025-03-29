"use client";

import React, { useState } from "react";

// Define the structure of a product result
type Product = {
  name: string;
  price: number;
  description: string;
};

export default function SearchPage() {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Product[]>([]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fakeResults: Product[] = [
      {
        name: "iPhone 15 Pro",
        price: 1399.99,
        description: "Powerful Apple smartphone with A17 chip",
      },
      {
        name: "Samsung Galaxy S24",
        price: 1249.99,
        description: "Flagship Android phone with great camera",
      },
    ];

    const filtered = fakeResults.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filtered);
  };

  return (
    <div className="bg-white min-h-screen text-black p-6 font-sans">
      <h1 className="text-3xl font-bold mb-6">Search Products</h1>
      <form onSubmit={handleSearch} className="max-w-xl mb-8">
        <div className="flex border rounded-full overflow-hidden">
          <input
            type="text"
            placeholder="Type to search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow p-3 focus:outline-none"
          />
          <button type="submit" className="bg-black text-white px-6 py-3">
            Search
          </button>
        </div>
      </form>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.map((item, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 shadow hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <p className="text-gray-600 mb-2">{item.description}</p>
              <p className="font-bold text-lg">${item.price.toFixed(2)} CAD</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">
          No results found. Try searching something else.
        </p>
      )}
    </div>
  );
}
