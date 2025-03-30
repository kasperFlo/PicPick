// File: /app/(route)/home/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { poppins, epilogue } from "@/lib/fonts";
import { Product } from "@/app/types/Product";

export default function HomePage() {
  const router = useRouter();

  // ========== “For You” State ==========
  const [visitedCategories, setVisitedCategories] = useState<string[]>([]);
  const [forYouProducts, setForYouProducts] = useState<Product[]>([]);

  // ========== “Popular Products” State ==========
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [popLoading, setPopLoading] = useState<boolean>(false);
  const [popError, setPopError] = useState<string | null>(null);

  // ========== Categories for display (click => go to /categories/[slug]) ==========
  const categories = [
    { name: "Home", icon: "home.png" },
    { name: "Garden", icon: "sprout.png" },
    { name: "Kids", icon: "stroller.png" },
    { name: "Toys", icon: "scissors.png" },
    { name: "Gaming", icon: "game.png" },
    { name: "Electronics", icon: "keyboard.png" },
    { name: "Phones", icon: "smartphone.png" },
    { name: "Sound & TV", icon: "wave-sound.png" },
    { name: "Photography", icon: "camera.png" },
    { name: "Clothing", icon: "shirt.png" },
    { name: "Health", icon: "lotion.png" },
    { name: "Sports", icon: "basketball.png" },
  ];

  // ========== 1) Load visitedCategories from localStorage on mount ==========
  useEffect(() => {
    try {
      const stored = localStorage.getItem("visitedCategories");
      if (stored) {
        const arr = JSON.parse(stored) as string[];
        setVisitedCategories(arr);
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // ========== 2) Weighted “For You” approach (3 items from newest cat, 5 from older, shuffle) ==========
  useEffect(() => {
    if (visitedCategories.length === 0) return;

    const fetchForYouData = async () => {
      try {
        // fetch aggregator data for each visited category
        const promises = visitedCategories.map(async (cat) => {
          const res = await fetch(`/api/searchProduct/${encodeURIComponent(cat)}`);
          if (!res.ok) return [];
          const data = await res.json();
          return data.success ? (data.data as Product[]) : [];
        });

        const allResults = await Promise.all(promises); 
        // => allResults[i] is array of products for visitedCategories[i]

        // Identify newest category => last in visitedCategories
        const newestIndex = visitedCategories.length - 1;
        const newestItems = allResults[newestIndex];

        // Combine older cats
        let olderItems: Product[] = [];
        for (let i = 0; i < allResults.length; i++) {
          if (i !== newestIndex) {
            olderItems = olderItems.concat(allResults[i]);
          }
        }

        // We'll do a total of 8 items
        // ~3 from newest cat => ~40% weighting
        let newestCount = 3;
        if (visitedCategories.length === 1) {
          // If only 1 category visited, take all 8 from that cat
          newestCount = 8;
        } else if (newestItems.length < 3) {
          // If newest cat doesn't have 3 items, take all it has
          newestCount = newestItems.length;
        }

        const chosenNewest = newestItems.slice(0, newestCount);

        const olderCount = 8 - chosenNewest.length;
        // Shuffle older items
        const shuffledOlder = shuffleArray(olderItems);
        const chosenOlder = shuffledOlder.slice(0, olderCount);

        // Combine and shuffle final result
        let combined = [...chosenNewest, ...chosenOlder];
        combined = shuffleArray(combined);
        // Slice to 8 just in case
        combined = combined.slice(0, 8);

        setForYouProducts(combined);
      } catch (err) {
        console.error("Error loading 'For You' data:", err);
      }
    };

    fetchForYouData();
  }, [visitedCategories]);

  // Simple shuffle
  function shuffleArray<T>(arr: T[]): T[] {
    const array = [...arr];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // ========== 3) Fetch “Popular Products” on mount (example: "Phones") ==========
  useEffect(() => {
    const fetchPopular = async () => {
      try {
        setPopLoading(true);
        const res = await fetch(`/api/searchProduct/Phones`);
        if (!res.ok) throw new Error("Failed to fetch popular products");
        const data = await res.json();
        if (data.success) {
          setPopularProducts(data.data || []);
        } else {
          setPopError(data.error || "Failed to load popular products");
        }
      } catch (err) {
        setPopError("Error fetching popular products");
      } finally {
        setPopLoading(false);
      }
    };
    fetchPopular();
  }, []);

  // handleCategoryClick => /categories/[slug]
  const handleCategoryClick = (categoryName: string) => {
    router.push(`/categories/${encodeURIComponent(categoryName)}`);
  };

  // “View Details” => goes to /search?q= productName (example)
  function handleViewDetails(productName: string) {
    router.push(`/search?q=${encodeURIComponent(productName)}`);
  }

  // ========== Render ==========
  return (
    <div className={`${poppins.variable} bg-[#EFF2F4] text-[#1E252B] min-h-screen font-sans`}>
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between p-10 bg-[#053358] text-white">
        <div className="max-w-xl">
          <h1 className={`${epilogue.className} text-4xl font-bold mb-4 leading-snug`}>
            Search, compare, save
            <br />
            Find your next deal today
          </h1>
          <p className="mb-6 font-poppins">
            At PicPick you can compare prices on{" "}
            <strong>8 million products</strong> from{" "}
            <strong>6,300 shops</strong>
          </p>
          <div className="flex items-center bg-white rounded-full overflow-hidden max-w-md">
            <input
              type="text"
              placeholder="What are you looking for today?"
              className="p-3 flex-grow text-[#333F49] focus:outline-none font-poppins"
            />
            <button className="bg-[#2196F3] text-white px-5 py-3 hover:bg-[#0966AF] transition-colors">
              →
            </button>
          </div>
        </div>
        <div className="mt-10 md:mt-0 md:ml-10">
          <img
            src="https://cdn-icons-png.flaticon.com/512/270/270798.png"
            alt="phone with shopping info"
            className="w-60 rounded-lg shadow-xl"
          />
        </div>
      </section>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-6 text-center p-4 text-sm bg-white text-[#1E252B]">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="cursor-pointer flex flex-col items-center hover:scale-110 transition-transform duration-200 w-20"
            onClick={() => handleCategoryClick(cat.name)}
          >
            <img
              src={`/icons/${cat.icon}`}
              alt={`${cat.name} icon`}
              className="w-8 h-8 mb-2"
            />
            <span className="text-sm font-medium">{cat.name}</span>
          </div>
        ))}
      </div>

      {/* FOR YOU */}
      {visitedCategories.length > 0 && (
        <section className="p-6 bg-white text-[#1E252B]">
          <h2 className={`${epilogue.className} text-xl font-semibold mb-4`}>
            For You
          </h2>

          {forYouProducts.length === 0 ? (
            <p>Loading your personalized picks...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {forYouProducts.map((prod, idx) => (
                <div
                  key={idx}
                  className="border border-[#E2E7EB] p-4 rounded-lg shadow hover:shadow-lg bg-white flex flex-col"
                >
                  <h3 className="font-bold text-lg mb-1 line-clamp-2">
                    {prod.name}
                  </h3>
                  <img
                    src={prod.image || ""}
                    alt={prod.name}
                    className="h-36 bg-[#EFF2F4] object-contain mb-2"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "https://via.placeholder.com/200?text=No+Image";
                    }}
                  />
                  <p className="font-bold mb-2">{prod.price.formatted}</p>

                  <div className="mt-auto flex gap-2">
                    {/* View Details => route to /search?q=... */}
                    <button
                      onClick={() => handleViewDetails(prod.name)}
                      className="bg-[#2196F3] hover:bg-[#0966AF] text-white px-3 py-1 rounded-full text-sm flex-1 text-center"
                    >
                      Related Products
                    </button>

                    {/* Buy => direct store link */}
                    <a
                      href={prod.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#074C83] hover:bg-[#053358] text-white px-3 py-1 rounded-full text-sm flex-1 text-center"
                    >
                      Buy
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* POPULAR PRODUCTS */}
      <section className="p-6 bg-white text-[#1E252B]">
        <h2 className={`${epilogue.className} text-xl font-semibold mb-4`}>
          Popular Products
        </h2>
        {popLoading && <p>Loading popular products...</p>}
        {popError && <p className="text-red-500">Error: {popError}</p>}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {popularProducts.map((prod, idx) => (
            <div
              key={idx}
              className="border border-[#E2E7EB] p-4 rounded-lg shadow hover:shadow-lg bg-white flex flex-col"
            >
              <h3 className="font-bold text-lg mb-1 line-clamp-2">
                {prod.name}
              </h3>
              <img
                src={prod.image || ""}
                alt={prod.name}
                className="h-36 bg-[#EFF2F4] object-contain mb-2"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "https://via.placeholder.com/200?text=No+Image";
                }}
              />
              <p className="font-bold mb-2">{prod.price.formatted}</p>

              <div className="mt-auto flex gap-2">
                {/* View Details => /search?q=... */}
                <button
                  onClick={() => handleViewDetails(prod.name)}
                  className="bg-[#2196F3] hover:bg-[#0966AF] text-white px-3 py-1 rounded-full text-sm flex-1 text-center"
                >
                  Related Products
                </button>
                <a
                  href={prod.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#074C83] hover:bg-[#053358] text-white px-3 py-1 rounded-full text-sm flex-1 text-center"
                >
                  Buy
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
