// File: /app/(route)/home/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import { poppins, epilogue } from "@/lib/fonts";
import { Product } from "@/app/types/Product";

export default function HomePage() {
  const router = useRouter();
  const [subcategories, setSubcategories] = useState<string[]>([]);

  const categories = [
    {
      name: "Home",
      icon: "home.png",
      subcategories: ["Furniture", "Appliances", "Decor"],
    },
    {
      name: "Garden",
      icon: "sprout.png",
      subcategories: ["Plants", "Tools", "Outdoor Decor"],
    },
    {
      name: "Kids",
      icon: "stroller.png",
      subcategories: ["Clothing", "Toys", "School Supplies"],
    },
    {
      name: "Gaming",
      icon: "game.png",
      subcategories: ["Consoles", "Games", "Accessories"],
    },
    {
      name: "Electronics",
      icon: "keyboard.png",
      subcategories: ["Laptops", "Desktops", "Accessories"],
    },
    {
      name: "Phones",
      icon: "smartphone.png",
      subcategories: ["Smartphones", "Cases", "Chargers"],
    },
    {
      name: "Sound & TV",
      icon: "wave-sound.png",
      subcategories: ["Headphones", "Speakers", "Televisions"],
    },
    {
      name: "Photography",
      icon: "camera.png",
      subcategories: ["Cameras", "Lenses", "Tripods"],
    },
    {
      name: "Clothing",
      icon: "shirt.png",
      subcategories: ["Men", "Women", "Kids"],
    },
    {
      name: "Health",
      icon: "lotion.png",
      subcategories: ["Supplements", "Fitness", "Hygiene"],
    },
    {
      name: "Sports",
      icon: "basketball.png",
      subcategories: ["Equipment", "Apparel", "Footwear"],
    },
  ];

  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [popLoading, setPopLoading] = useState<boolean>(false);
  const [popError, setPopError] = useState<string | null>(null);

  const handleCategoryClick = (categoryName: string) => {
    const category = categories.find((c) => c.name === categoryName);
    if (category && category.subcategories) {
      setSubcategories(category.subcategories);
    } else {
      setSubcategories([]);
    }
  };

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
        console.error(err);
      } finally {
        setPopLoading(false);
      }
    };
    fetchPopular();
  }, []);

  return (
    <div className="min-h-screen font-sans bg-[#EFF2F4] text-[#1E252B]">
      <section className="flex flex-col md:flex-row items-center justify-between p-10 bg-[#053358] text-white">
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold mb-4 leading-snug">
            Search, compare, save
            <br />
            Find your next deal today
          </h1>
          <p className="mb-6">
            At PicPick you can compare prices on{" "}
            <strong>8 million products</strong> from{" "}
            <strong>6,300 shops</strong>
          </p>
          <div className="flex items-center bg-white rounded-full overflow-hidden max-w-md">
            <input
              type="text"
              placeholder="What are you looking for today?"
              className="p-3 flex-grow text-[#333F49] focus:outline-none"
            />
            <button className="bg-[#2196F3] text-white px-5 py-3 hover:bg-[#0966AF] transition-colors">
              →
            </button>
          </div>
        </div>
        <div className="mt-10 md:mt-0 md:ml-10">
          <img
            src="https://cdn-icons-png.flaticon.com/512/270/270798.png"
            alt="shopping"
            className="w-60 rounded-lg shadow-xl"
          />
        </div>
      </section>

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

      {subcategories.length > 0 && (
        <div className="bg-white p-6">
          <h3 className="text-lg font-semibold mb-3 text-center">
            Choose a Subcategory
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {subcategories.map((sub) => (
              <button
                key={sub}
                onClick={() =>
                  router.push(`/search?q=${encodeURIComponent(sub)}`)
                }
                className="bg-[#2196F3] hover:bg-[#0966AF] text-white px-4 py-2 rounded-full text-sm transition"
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* POPULAR PRODUCTS */}
      <section className="p-6 bg-white text-[#1E252B]">
        <h2 className="text-xl font-semibold mb-4">Popular Products</h2>
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
                <button
                  onClick={() =>
                    router.push(`/search?q=${encodeURIComponent(prod.name)}`)
                  }
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
