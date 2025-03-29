"use client";

import React from "react";

export default function HomePage() {
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

  const products = [
    {
      name: "iPhone 15 Pro",
      price: 1399.99,
      discount: "",
      watchers: 200,
      category: "Phones",
    },
    {
      name: "AirPods Pro 2",
      price: 329.99,
      discount: "-20%",
      watchers: 0,
      category: "Electronics",
    },
    {
      name: "AirPods 3rd Gen",
      price: 239.99,
      discount: "-10%",
      watchers: 0,
      category: "Electronics",
    },
    {
      name: "New Balance 530",
      price: 109.99,
      discount: "",
      watchers: 200,
      category: "Clothing",
    },
  ];

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between p-10 bg-black text-white">
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold mb-4 leading-snug">
            Search, compare, save
            <br />
            Find your next deal today
          </h1>
          <p className="mb-6">
            At PriceRunner you can compare prices on{" "}
            <strong>8 million products</strong> from{" "}
            <strong>6,300 shops</strong>
          </p>
          <div className="flex items-center bg-white rounded-full overflow-hidden max-w-md">
            <input
              type="text"
              placeholder="What are you looking for today?"
              className="p-3 flex-grow text-black focus:outline-none"
            />
            <button className="bg-black text-white px-5 py-3">→</button>
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
      <div className="flex flex-wrap justify-center gap-6 text-center p-4 text-sm bg-white text-black">
        {categories.map((category) => (
          <div
            key={category.name}
            className="cursor-pointer flex flex-col items-center hover:scale-110 transition-transform duration-200 w-20"
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

      {/* Popular Products */}
      <section className="p-6 bg-white text-black">
        <h2 className="text-xl font-semibold mb-4">
          Popular products right now
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((item, idx) => (
            <div
              key={idx}
              className="border p-4 rounded-lg shadow hover:shadow-lg bg-white text-black"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <span>🧩</span> {item.category}
                  </p>
                </div>
                <span className="text-red-500 text-xl cursor-pointer">❤️</span>
              </div>
              <div className="mb-4 h-36 bg-gray-100 flex items-center justify-center text-gray-400 text-2xl">
                🖼 Image
              </div>
              {item.watchers > 0 && (
                <div className="text-xs text-green-600 mb-1">
                  🔥 {item.watchers}+ watching
                </div>
              )}
              {item.discount && (
                <div className="text-xs text-red-500 mb-1">{item.discount}</div>
              )}
              <p className="font-bold text-lg">${item.price.toFixed(2)} CAD</p>
              <div className="flex gap-2 mt-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm flex items-center gap-1">
                  <span>👁️</span> See Details
                </button>
                <button className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-full text-sm flex items-center gap-1">
                  <span>🛒</span> Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
