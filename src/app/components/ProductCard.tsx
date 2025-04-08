import React, { useState, useEffect } from "react";
import { epilogue } from "@/lib/types/fonts";
import { Product } from "@/lib/types/Product";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if product is in wishlist when component mounts
  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        const response = await fetch(
          `/api/wishlist/check?link=${encodeURIComponent(product.link)}`
        );
        if (response.ok) {
          const data = await response.json();
          setIsFavorite(data.inWishlist);
        }
      } catch (error) {
        console.error("Error checking wishlist status:", error);
      }
    };

    checkWishlistStatus();
  }, [product.link]);

  const toggleFavorite = async () => {
    setIsLoading(true);
    try {
      const method = isFavorite ? "DELETE" : "POST";
      const response = await fetch("/api/wishlist", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: {
            name: product.name,
            link: product.link,
            // Match your schema exactly - it expects a number, not an object
            price: typeof product.price === 'object' ? product.price.value : product.price,
          },
        }),
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
        console.log(`Product ${isFavorite ? 'removed from' : 'added to'} wishlist successfully`);
      } else {
        const errorData = await response.json();
        console.error("Wishlist update failed:", errorData);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  };
  // returns product cards
  return (
    <div className="bg-white border border-[#E2E7EB] rounded-lg p-4 shadow hover:shadow-lg transition flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <h2
          className={`${epilogue.className} text-xl font-semibold line-clamp-2 h-14 overflow-hidden`}
        >
          {product.name}
        </h2>
        <IconButton
          onClick={toggleFavorite}
          className="text-red-500 flex-shrink-0 ml-2"
          size="small"
          disabled={isLoading}
        >
          {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </div>

      <div className="w-full h-48 mb-4 bg-[#EFF2F4] rounded overflow-hidden flex items-center justify-center">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.src =
                "https://via.placeholder.com/300x200?text=No+Image";
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
          <VisibilityIcon fontSize="small" className="mr-1" /> View Details
        </a>
        <button
          onClick={toggleFavorite}
          disabled={isLoading}
          className={`${
            isFavorite
              ? "bg-red-500 hover:bg-red-600"
              : "bg-[#074C83] hover:bg-[#053358]"
          } text-white px-4 py-2 rounded-full text-sm flex items-center gap-1 transition-colors flex-1 justify-center`}
        >
          <FavoriteIcon fontSize="small" className="mr-1" />
          {isFavorite ? "Remove from Wishlist" : "Add to Wishlist"}
        </button>
      </div>
    </div>
  );
}
