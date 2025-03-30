// File: /app/(route)/home/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { poppins, epilogue } from "@/lib/fonts";

export default function HomePage() {
  const router = useRouter();

  // ========== “For You” State ==========
  const [visitedCategories, setVisitedCategories] = useState<string[]>([]);
  const [forYouProducts, setForYouProducts] = useState<any[]>([]);

  // ========== “Popular Products” State ==========
  const [popularProducts, setPopularProducts] = useState<any[]>([]);
  const [popLoading, setPopLoading] = useState<boolean>(false);
  const [popError, setPopError] = useState<string | null>(null);

  // ========== Category Buttons (go to category page) ==========
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

  // ========== 1) Load visited categories from localStorage on mount ==========
  useEffect(() => {
    try {
      const stored = localStorage.getItem("visitedCategories");
      if (stored) {
        const arr = JSON.parse(stored) as string[];
        setVisitedCategories(arr);
      }
    } catch (err) {
      // ignoring parse errors
    }
  }, []);

  // ========== 2) Whenever visitedCategories changes, fetch aggregator data ==========
  useEffect(() => {
    if (visitedCategories.length === 0) return;

    const fetchForYouData = async () => {
      try {
        // 1) Fetch aggregator data for each visited category in parallel
        const promises = visitedCategories.map(async (cat) => {
          const res = await fetch(`/api/searchProduct/${encodeURIComponent(cat)}`);
          if (!res.ok) return [];
          const data = await res.json();
          return data.success ? data.data || [] : [];
        });

        const allResults = await Promise.all(promises); 
        // => allResults[i] is the array of products for visitedCategories[i]

        // 2) Identify newest category => last element in visitedCategories
        const newestIndex = visitedCategories.length - 1;
        const newestItems = allResults[newestIndex]; // array from the newest cat

        // 3) Combine older cats: everything except newestIndex
        let olderItems: any[] = [];
        for (let i = 0; i < allResults.length; i++) {
          if (i !== newestIndex) {
            olderItems = olderItems.concat(allResults[i]);
          }
        }

        // We'll do 8 total
        // We'll pick ~3 from newest cat (or fewer if it doesn't have that many),
        // and the rest from older cats => 5 (or more if newest has <3).
        const totalNeeded = 8;

        // "40-60% from newest" => let's say exactly 3 from newest if possible
        let newestCount = 3;
        // If there's only 1 cat visited, all come from newest
        if (visitedCategories.length === 1) {
          newestCount = 8;
        } else if (newestItems.length < 3) {
          // If newest cat doesn't have 3 items, use all it has
          newestCount = newestItems.length;
        }

        // Slice from newest
        const chosenNewest = newestItems.slice(0, newestCount);

        // The rest from older
        const olderCount = totalNeeded - chosenNewest.length;

        // Shuffle older items, then pick
        const shuffledOlder = shuffleArray(olderItems);
        const chosenOlder = shuffledOlder.slice(0, olderCount);

        // Combine and shuffle final result
        let combined = [...chosenNewest, ...chosenOlder];
        combined = shuffleArray(combined);

        // Just in case, slice to 8
        combined = combined.slice(0, 8);

        setForYouProducts(combined);
      } catch (err) {
        console.error("Error loading 'For You' data:", err);
      }
    };

    fetchForYouData();
  }, [visitedCategories]);

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

  // Utility: shuffle an array
  function shuffleArray<T>(arr: T[]): T[] {
    const array = [...arr];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Category click => go to categories/[slug] page
  const handleCategoryClick = (categoryName: string) => {
    router.push(`/categories/${encodeURIComponent(categoryName)}`);
  };

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
            At PriceRunner you can compare prices on{" "}
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
        {categories.map((category) => (
          <div
            key={category.name}
            className="cursor-pointer flex flex-col items-center hover:scale-110 transition-transform duration-200 w-20"
            onClick={() => handleCategoryClick(category.name)}
          >
            <img
              src={`/icons/${category.icon}`}
              alt={`${category.name} icon`}
              className="w-8 h-8 mb-2"
            />
            <span className="text-sm font-medium">{category.name}</span>
          </div>
        ))}
      </div>

      {/* For You Section */}
      {visitedCategories.length > 0 && (
        <section className="p-6 bg-white text-[#1E252B]">
          <h2 className={`${epilogue.className} text-xl font-semibold mb-4`}>
            For You
          </h2>
          {forYouProducts.length === 0 ? (
            <p>Loading your personalized picks...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {forYouProducts.map((item, idx) => (
                <div
                  key={idx}
                  className="border border-[#E2E7EB] p-4 rounded-lg shadow hover:shadow-lg bg-white"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className={`${epilogue.className} font-bold text-lg`}>
                        {item.name}
                      </h3>
                      {item.platform && (
                        <p className="text-sm text-[#76BC9F] flex items-center gap-1">
                          <span>🧩</span> {item.platform}
                        </p>
                      )}
                    </div>
                    <span className="text-red-500 text-xl cursor-pointer">❤️</span>
                  </div>
                  <div className="mb-4 h-36 bg-[#EFF2F4] flex items-center justify-center text-[#ACB9C5] text-2xl">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full object-contain"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "https://via.placeholder.com/150?text=No+Image";
                        }}
                      />
                    ) : (
                      <span className="text-sm">No Image</span>
                    )}
                  </div>
                  <p className="font-bold text-lg">{item.price?.formatted}</p>
                  <div className="flex gap-2 mt-3">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#2196F3] hover:bg-[#0966AF] text-white px-4 py-2 rounded-full text-sm flex-1 text-center flex items-center gap-1 justify-center transition-colors"
                    >
                      <span>👁️</span> See
                    </a>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#074C83] hover:bg-[#053358] text-white px-4 py-2 rounded-full text-sm flex-1 text-center flex items-center gap-1 justify-center transition-colors"
                    >
                      <span>🛒</span> Buy
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Popular Products */}
      <section className="p-6 bg-white text-[#1E252B]">
        <h2 className={`${epilogue.className} text-xl font-semibold mb-4`}>
          Popular products
        </h2>
        {popLoading && <p>Loading popular products...</p>}
        {popError && <p className="text-red-500">Error: {popError}</p>}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {popularProducts.map((item, idx) => (
            <div
              key={idx}
              className="border border-[#E2E7EB] p-4 rounded-lg shadow hover:shadow-lg bg-white"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className={`${epilogue.className} font-bold text-lg`}>
                    {item.name}
                  </h3>
                  {item.platform && (
                    <p className="text-sm text-[#76BC9F] flex items-center gap-1">
                      <span>🧩</span> {item.platform}
                    </p>
                  )}
                </div>
                <span className="text-red-500 text-xl cursor-pointer">❤️</span>
              </div>
              <div className="mb-4 h-36 bg-[#EFF2F4] flex items-center justify-center text-[#ACB9C5] text-2xl">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "https://via.placeholder.com/150?text=No+Image";
                    }}
                  />
                ) : (
                  <span className="text-sm">No Image</span>
                )}
              </div>
              <p className="font-bold text-lg">{item.price?.formatted}</p>
              <div className="flex gap-2 mt-3">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#2196F3] hover:bg-[#0966AF] text-white px-4 py-2 rounded-full text-sm flex-1 text-center flex items-center gap-1 justify-center transition-colors"
                >
                  <span>👁️</span> See
                </a>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#074C83] hover:bg-[#053358] text-white px-4 py-2 rounded-full text-sm flex-1 text-center flex items-center gap-1 justify-center transition-colors"
                >
                  <span>🛒</span> Buy
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
