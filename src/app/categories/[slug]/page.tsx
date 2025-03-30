// File: /app/categories/[slug]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Product } from "@/app/types/Product";

export default function CategoryPage() {
  const router = useRouter();
  const params = useParams();
  let slug: string | undefined | string[] = params.slug;

  // If slug is array, pick first
  if (Array.isArray(slug)) {
    slug = slug[0];
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError("No category specified");
      setLoading(false);
      return;
    }

    // Save slug to localStorage => used by home page
    try {
      const stored = localStorage.getItem("visitedCategories");
      let visited: string[] = stored ? JSON.parse(stored) : [];
      if (!visited.includes(slug)) {
        visited.push(slug);
      }
      localStorage.setItem("visitedCategories", JSON.stringify(visited));
    } catch (err) {
      console.error("Failed to update visitedCategories in localStorage:", err);
    }

    // Fetch aggregator data
    const fetchCategoryData = async () => {
      try {
        const res = await fetch(`/api/searchProduct/${encodeURIComponent(slug!)}`);
        if (!res.ok) throw new Error("Failed to fetch category products");
        const data = await res.json();
        if (data.success) {
          setProducts(data.data || []);
        } else {
          setError(data.error || "Failed to load products");
        }
      } catch (err) {
        setError("Error fetching products");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [slug]);

  function handleViewDetails(productName: string) {
    router.push(`/search?q=${encodeURIComponent(productName)}`);
  }

  if (!slug) {
    return (
      <div className="p-4">
        <p>No category found in URL.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Category: {slug}</h1>

      {loading && <p>Loading products for "{slug}"...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((prod, idx) => (
          <div key={idx} className="border p-4 rounded shadow flex flex-col">
            <h2 className="font-bold mb-2 line-clamp-2">{prod.name}</h2>
            <img
              src={prod.image || ""}
              alt={prod.name}
              className="h-32 object-contain mb-2 bg-gray-100"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://via.placeholder.com/150?text=No+Image";
              }}
            />
            <p className="font-semibold mb-2">{prod.price.formatted}</p>

            <div className="mt-auto flex gap-2">
              {/* View Details => /search?q=... */}
              <button
                onClick={() => handleViewDetails(prod.name)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex-1 text-center"
              >
                Related Products
              </button>

              {/* Buy => direct link */}
              <a
                href={prod.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex-1 text-center"
              >
                Buy
              </a>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => router.push("/home")}
        className="mt-6 inline-block bg-blue-600 hover:bg-gray-400 px-4 py-2 rounded"
      >
        Return to Home
      </button>
    </div>
  );
}
