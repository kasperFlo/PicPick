import React from "react";
import { epilogue } from '@/lib/fonts';
import { Product } from "@/app/types/Product";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white border border-[#E2E7EB] rounded-lg p-4 shadow hover:shadow-lg transition flex flex-col h-full">
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
  );
}
