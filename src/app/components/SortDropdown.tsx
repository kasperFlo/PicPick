import React from "react";

type SortDropdownProps = {
  onChange: (option: string) => void;
};

export default function SortDropdown({ onChange }: SortDropdownProps) {
  return (
    <div className="flex justify-end mb-4">
      <select 
        className="p-2 border rounded-md bg-white"
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Sort by</option>
        <option value="price_high_low">Price: High to Low</option>
        <option value="price_low_high">Price: Low to High</option>
        <option value="newest">Newest Items</option>
        <option value="rating">Average Review</option>
      </select>
    </div>
  );
}
