// File: /app/categories/[slug]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CategoryPage() {
  const router = useRouter();

  // TS sees slug as string | string[] | undefined
  const params = useParams();
  let slug = params.slug;

  // 1) If slug is an array, we’ll pick the first
  if (Array.isArray(slug)) {
    slug = slug[0];
  }

  // 2) If it’s still undefined, we can’t proceed
  if (!slug) {
    return <div>No category found.</div>;
  }

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 3) Save this slug to localStorage
    try {
      const stored = localStorage.getItem("visitedCategories");
      let visited: string[] = stored ? JSON.parse(stored) : [];
      if (!visited.includes(slug!)) {
        visited.push(slug!);
      }
      localStorage.setItem("visitedCategories", JSON.stringify(visited));
    } catch (err) {
      console.error("Failed to update visitedCategories in localStorage:", err);
    }

    // 4) Fetch aggregator data
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Category: {slug}</h1>

      {loading && <p>Loading products for "{slug}"...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((item, idx) => (
          <div key={idx} className="border p-4 rounded shadow">
            <h2 className="font-bold mb-2">{item.name}</h2>
            <img
              src={item.image || ""}
              alt={item.name}
              className="h-32 object-contain mb-2 bg-gray-100"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://via.placeholder.com/150?text=No+Image";
              }}
            />
            <p className="font-semibold">{item.price?.formatted}</p>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 bg-blue-600 text-white px-3 py-1 rounded"
            >
              Buy
            </a>
          </div>
        ))}
      </div>

      <button
        onClick={() => router.push("/home")}
        className="mt-6 inline-block bg-blue-600 hover:bg-gray-300 px-4 py-2 rounded"
      >
        Return to Home
      </button>
    </div>
  );
}
