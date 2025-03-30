import React from "react";

type FilterSidebarProps = {
  filters: {
    ratings: {
      fourStars: boolean;
      threeStars: boolean;
      twoStars: boolean;
      oneStar: boolean;
    };
    brands: {
      walmart: boolean;
      amazon: boolean;
      bestBuy: boolean;
      ebay: boolean;
    };
    delivery: {
      sameDay: boolean;
      weekWithin: boolean;
      free: boolean;
    };
    price: {
      range: string;
      min: string;
      max: string;
    };
    deals: {
      today: boolean;
    };
  };
  onFilterChange: (category: "ratings" | "brands" | "delivery" | "price" | "deals", name: string, value: boolean | string) => void;
};

export default function FilterSidebar({ filters, onFilterChange }: FilterSidebarProps) {
  const handleRatingChange = (name: string, checked: boolean) => {
    onFilterChange('ratings', name, checked);
  };
  
  const handleBrandChange = (name: string, checked: boolean) => {
    onFilterChange('brands', name, checked);
  };
  
  const handleDeliveryChange = (name: string, checked: boolean) => {
    onFilterChange('delivery', name, checked);
  };
  
  const handlePriceRangeClick = (range: string) => {
    onFilterChange('price', 'range', range === filters.price.range ? '' : range);
  };
  
  const handleMinPriceChange = (value: string) => {
    onFilterChange('price', 'min', value);
  };
  
  const handleMaxPriceChange = (value: string) => {
    onFilterChange('price', 'max', value);
  };
  
  const handleDealsChange = (checked: boolean) => {
    onFilterChange('deals', 'today', checked);
  };
  
  const applyCustomPriceRange = () => {
    // This function would be called when the "Go" button is clicked
    // The filtering is already handled by the min/max state
    console.log("Custom price range applied:", filters.price.min, filters.price.max);
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow">
      {/* Customer Review Section */}
      <div className="mb-6">
        <h3 className="font-bold text-lg mb-2">Customer Review</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="4stars" 
              className="mr-2"
              checked={filters.ratings.fourStars}
              onChange={(e) => handleRatingChange('fourStars', e.target.checked)}
            />
            <label htmlFor="4stars" className="flex items-center">
              <span className="text-yellow-400">★★★★</span>
              <span className="text-gray-300">☆</span>
              <span className="ml-1">& Up</span>
            </label>
          </div>
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="3stars" 
              className="mr-2"
              checked={filters.ratings.threeStars}
              onChange={(e) => handleRatingChange('threeStars', e.target.checked)}
            />
            <label htmlFor="3stars" className="flex items-center">
              <span className="text-yellow-400">★★★</span>
              <span className="text-gray-300">☆☆</span>
              <span className="ml-1">& Up</span>
            </label>
          </div>
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="2stars" 
              className="mr-2"
              checked={filters.ratings.twoStars}
              onChange={(e) => handleRatingChange('twoStars', e.target.checked)}
            />
            <label htmlFor="2stars" className="flex items-center">
              <span className="text-yellow-400">★★</span>
              <span className="text-gray-300">☆☆☆</span>
              <span className="ml-1">& Up</span>
            </label>
          </div>
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="1star" 
              className="mr-2"
              checked={filters.ratings.oneStar}
              onChange={(e) => handleRatingChange('oneStar', e.target.checked)}
            />
            <label htmlFor="1star" className="flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="text-gray-300">☆☆☆☆</span>
              <span className="ml-1">& Up</span>
            </label>
          </div>
        </div>
      </div>

      {/* Brand Section */}
      <div className="mb-6">
        <h3 className="font-bold text-lg mb-2">Brand</h3>
        <input 
          type="text" 
          placeholder="Search" 
          className="w-full border rounded p-2 mb-2"
        />
        <div className="space-y-1">
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="walmart" 
              className="mr-2"
              checked={filters.brands.walmart}
              onChange={(e) => handleBrandChange('walmart', e.target.checked)}
            />
            <label htmlFor="walmart">Walmart</label>
          </div>
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="amazon" 
              className="mr-2"
              checked={filters.brands.amazon}
              onChange={(e) => handleBrandChange('amazon', e.target.checked)}
            />
            <label htmlFor="amazon">Amazon</label>
          </div>
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="bestbuy" 
              className="mr-2"
              checked={filters.brands.bestBuy}
              onChange={(e) => handleBrandChange('bestBuy', e.target.checked)}
            />
            <label htmlFor="bestbuy">Best Buy</label>
          </div>
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="ebay" 
              className="mr-2"
              checked={filters.brands.ebay}
              onChange={(e) => handleBrandChange('ebay', e.target.checked)}
            />
            <label htmlFor="ebay">Ebay</label>
          </div>
        </div>
        <button className="text-[#2196F3] flex items-center mt-1">
          See more ▼
        </button>
      </div>

      {/* Delivery Section */}
      <div className="mb-6">
        <h3 className="font-bold text-lg mb-2">Delivery</h3>
        <div className="space-y-1">
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="sameday" 
              className="mr-2"
              checked={filters.delivery.sameDay}
              onChange={(e) => handleDeliveryChange('sameDay', e.target.checked)}
            />
            <label htmlFor="sameday">Same Day Delivery</label>
          </div>
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="week" 
              className="mr-2"
              checked={filters.delivery.weekWithin}
              onChange={(e) => handleDeliveryChange('weekWithin', e.target.checked)}
            />
            <label htmlFor="week">Week Within Delivery</label>
          </div>
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="free" 
              className="mr-2"
              checked={filters.delivery.free}
              onChange={(e) => handleDeliveryChange('free', e.target.checked)}
            />
            <label htmlFor="free">Free Delivery</label>
          </div>
        </div>
      </div>

      {/* Price Section */}
      <div className="mb-6">
        <h3 className="font-bold text-lg mb-2">Price</h3>
        <div className="space-y-1">
          <div 
            className={`cursor-pointer py-1 px-2 rounded ${filters.price.range === 'under50' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
            onClick={() => handlePriceRangeClick('under50')}
          >
            $Under 50
          </div>
          <div 
            className={`cursor-pointer py-1 px-2 rounded ${filters.price.range === '50to100' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
            onClick={() => handlePriceRangeClick('50to100')}
          >
            $50 - $100
          </div>
          <div 
            className={`cursor-pointer py-1 px-2 rounded ${filters.price.range === '100to500' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
            onClick={() => handlePriceRangeClick('100to500')}
          >
            $100 - $500
          </div>
          <div 
            className={`cursor-pointer py-1 px-2 rounded ${filters.price.range === '500to1000' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
            onClick={() => handlePriceRangeClick('500to1000')}
          >
            $500 - $1000
          </div>
          <div 
            className={`cursor-pointer py-1 px-2 rounded ${filters.price.range === '1000to5000' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
            onClick={() => handlePriceRangeClick('1000to5000')}
          >
            $1000 - $5000
          </div>
          <div 
            className={`cursor-pointer py-1 px-2 rounded ${filters.price.range === '5000to10000' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
            onClick={() => handlePriceRangeClick('5000to10000')}
          >
            $5000 - $10,000
          </div>
          <div 
            className={`cursor-pointer py-1 px-2 rounded ${filters.price.range === '10000to20000' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
            onClick={() => handlePriceRangeClick('10000to20000')}
          >
            $10,000 - $20,000
          </div>
          <div 
            className={`cursor-pointer py-1 px-2 rounded ${filters.price.range === 'over20000' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
            onClick={() => handlePriceRangeClick('over20000')}
          >
            Over $20,000
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <input 
            placeholder="$Min" 
            className="border rounded p-2 w-1/3"
            value={filters.price.min}
            onChange={(e) => handleMinPriceChange(e.target.value)}
          />
          <input 
            placeholder="$Max" 
            className="border rounded p-2 w-1/3"
            value={filters.price.max}
            onChange={(e) => handleMaxPriceChange(e.target.value)}
          />
          <button 
            className="bg-[#2196F3] text-white rounded px-3"
            onClick={applyCustomPriceRange}
          >
            Go
          </button>
        </div>
      </div>

      {/* Deals Section */}
      <div>
        <h3 className="font-bold text-lg mb-2">Deals</h3>
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="deals" 
            className="mr-2"
            checked={filters.deals.today}
            onChange={(e) => handleDealsChange(e.target.checked)}
          />
          <label htmlFor="deals">Today&quots Deals</label>
        </div>
      </div>
    </div>
  );
}
