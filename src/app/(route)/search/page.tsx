"use client";

import React, { useState, useEffect } from "react";
import { poppins, epilogue } from "@/lib/fonts";
import { useSearchParams } from "next/navigation";
import { useSearch } from "@/app/contexts/SearchContext";
import SearchForm from "@/app/components/searchform";
import FilterSidebar from "@/app/components/FilterSidebar";
import ProductGrid from "@/app/components/ProductGrid";
import SortDropdown from "@/app/components/SortDropdown";
import LoadingSpinner from "@/app/components/Ui/LoadingSpinner";
import ErrorMessage from "@/app/components/Ui/ErrorMessage";
import EmptyState from "@/app/components/Ui/EmptyState";
import NoValidState from "@/app/components/Ui/NoValidState";
import { Product } from "@/app/types/Product";

export default function SearchPage() {
  const { searchQuery, setSearchQuery } = useSearch();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState<string>(searchParams.get("q") || "");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>("");

  const [filters, setFilters] = useState({
    ratings: {
      fourStars: false,
      threeStars: false,
      twoStars: false,
      oneStar: false,
    },
    brands: {
      walmart: false,
      amazon: false,
      bestBuy: false,
      ebay: false,
    },
    delivery: {
      sameDay: false,
      weekWithin: false,
      free: false,
    },
    price: {
      range: "",
      min: "",
      max: "",
    },
    deals: {
      today: false,
    },
  });

  useEffect(() => {
    const currentQuery = searchParams.get("q") || "";
    if (currentQuery) {
      setQuery(currentQuery);
      fetchSearchResults(currentQuery);
    }
  }, [searchParams]);

  const fetchSearchResults = async (searchTerm: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/searchProduct/${encodeURIComponent(searchTerm)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setResults(data.data || []);
    } catch (error) {
      console.error("Error fetching results:", error);
      setError("Failed to fetch results. Please try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchSearchResults(query);
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
    // Implement sorting logic here
  };

  // A function to handle filter changes
  const handleFilterChange = (
    category: keyof typeof filters,
    name: string,
    value: boolean | string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [name]: value,
      },
    }));
  };

  // A function to apply filters to products
  const getFilteredProducts = () => {
    let filtered = [...results];

    // Filter by ratings
    if (
      filters.ratings.fourStars ||
      filters.ratings.threeStars ||
      filters.ratings.twoStars ||
      filters.ratings.oneStar
    ) {
      filtered = filtered.filter((product) => {
        const rating = product.rating?.value || 0;
        if (filters.ratings.fourStars && rating >= 4) return true;
        if (filters.ratings.threeStars && rating >= 3) return true;
        if (filters.ratings.twoStars && rating >= 2) return true;
        if (filters.ratings.oneStar && rating >= 1) return true;
        return false;
      });
    }

    // Filter by brands
    if (
      filters.brands.walmart ||
      filters.brands.amazon ||
      filters.brands.bestBuy ||
      filters.brands.ebay
    ) {
      filtered = filtered.filter((product) => {
        const platform = product.platform.toLowerCase();
        if (filters.brands.walmart && platform.includes("walmart")) return true;
        if (filters.brands.amazon && platform.includes("amazon")) return true;
        if (filters.brands.bestBuy && platform.includes("best buy"))
          return true;
        if (filters.brands.ebay && platform.includes("ebay")) return true;
        return false;
      });
    }

    // Filter by delivery
    if (
      filters.delivery.sameDay ||
      filters.delivery.weekWithin ||
      filters.delivery.free
    ) {
      filtered = filtered.filter((product) => {
        const shipping = (product.shipping || "").toLowerCase();
        if (filters.delivery.sameDay && shipping.includes("same day"))
          return true;
        if (filters.delivery.weekWithin && shipping.includes("week"))
          return true;
        if (filters.delivery.free && shipping.includes("free")) return true;
        return false;
      });
    }

    // Filter by price range
    if (filters.price.range) {
      filtered = filtered.filter((product) => {
        const price = product.price.value;
        switch (filters.price.range) {
          case "under50":
            return price < 50;
          case "50to100":
            return price >= 50 && price <= 100;
          case "100to500":
            return price > 100 && price <= 500;
          case "500to1000":
            return price > 500 && price <= 1000;
          case "1000to5000":
            return price > 1000 && price <= 5000;
          case "5000to10000":
            return price > 5000 && price <= 10000;
          case "10000to20000":
            return price > 10000 && price <= 20000;
          case "over20000":
            return price > 20000;
          default:
            return true;
        }
      });
    }

    // Filter by custom price range
    if (filters.price.min || filters.price.max) {
      filtered = filtered.filter((product) => {
        const price = product.price.value;
        const min = filters.price.min ? parseFloat(filters.price.min) : 0;
        const max = filters.price.max
          ? parseFloat(filters.price.max)
          : Infinity;
        return price >= min && price <= max;
      });
    }

    return filtered;
  };

  const getFilteredAndSortedProducts = () => {
    const filtered = getFilteredProducts();

    if (!sortOption) return filtered;

    const sorted = [...filtered];

    switch (sortOption) {
      case "price_high_low":
        return sorted.sort((a, b) => b.price.value - a.price.value);
      case "price_low_high":
        return sorted.sort((a, b) => a.price.value - b.price.value);
      case "newest":
        return sorted; // For now, just return unsorted
      case "rating":
        return sorted.sort((a, b) => {
          const ratingA = a.rating?.value || 0;
          const ratingB = b.rating?.value || 0;
          return ratingB - ratingA;
        });
      default:
        return sorted;
    }
  };

  const getSortedProducts = () => {
    if (!sortOption || results.length === 0) return results;

    const sortedProducts = [...results];

    switch (sortOption) {
      case "price_high_low":
        return sortedProducts.sort((a, b) => b.price.value - a.price.value);
      case "price_low_high":
        return sortedProducts.sort((a, b) => a.price.value - b.price.value);
      case "newest":
        // Assuming you have a date field, otherwise you'll need to add one
        return sortedProducts; // For now, just return unsorted
      case "rating":
        return sortedProducts.sort((a, b) => {
          const ratingA = a.rating?.value || 0;
          const ratingB = b.rating?.value || 0;
          return ratingB - ratingA;
        });
      default:
        return sortedProducts;
    }
  };

  return (
    <div
      className={`${poppins.variable} bg-[#EFF2F4] min-h-screen text-[#1E252B] p-6 font-poppins`}
    >
      <h1
        className={`${epilogue.className} text-4xl font-bold mb-6 text-[#053358]`}
      >
        Product Search
      </h1>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <SearchForm
          query={query}
          setQuery={setQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          loading={loading}
          className="flex-grow max-w-4xl w-full"
        />

        <SortDropdown onChange={handleSortChange} />
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner />
      ) : results.length > 0 ? (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-64 sticky top-6 self-start">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          <div className="flex-1">
            {getFilteredAndSortedProducts().length > 0 ? (
              <ProductGrid products={getFilteredAndSortedProducts()} />
            ) : (
              <NoValidState />
            )}
          </div>
        </div>
      ) : query ? (
        <EmptyState query={query} />
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
