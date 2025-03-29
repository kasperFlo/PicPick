"use client";

import { useState } from "react";

export default function header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white text-black shadow-md">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-2">
          <span className="text-pink-500 font-bold text-lg">🌟</span>
          <span className="font-semibold text-lg">PicPick</span>
        </div>
        <nav className="hidden md:flex gap-6 text-sm">
          <a href="#">All categories</a>
          <a href="#">Sale</a>
          <a href="#">Blogs</a>
          <a href="#">How to use</a>
          <a href="#">About us</a>
        </nav>
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
        <button className="hidden md:block border border-gray-400 px-4 py-1 rounded-full text-sm">
          Sign in
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden flex flex-col gap-3 p-4 bg-white border-t border-gray-200 text-sm">
          <a href="#">All categories</a>
          <a href="#">Sale</a>
          <a href="#">Blogs</a>
          <a href="#">How to use</a>
          <a href="#">About us</a>
          <button className="border border-gray-400 px-4 py-1 rounded-full text-sm w-max">
            Sign in
          </button>
        </div>
      )}
    </header>
  );
}
