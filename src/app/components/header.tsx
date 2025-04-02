"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSearch } from "@/app/contexts/SearchContext";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const router = useRouter();
  const { setSearchQuery } = useSearch();
  const [query, setQuery] = useState("");
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchQuery(query);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="bg-[#053358] text-white relative">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <Link href="/" className="text-2xl font-bold">
            PicPick
          </Link>
        </div>

        <form onSubmit={handleSearch} className="w-full md:w-1/2 mb-4 md:mb-0">
          <div className="flex rounded-full overflow-hidden shadow-md">
            <input
              type="text"
              placeholder="Search for products..."
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setQuery(e.target.value)
              }
              className="flex-grow p-2 text-[#333F49] focus:outline-none bg-[#BCDFFB]"
            />
            <button
              type="submit"
              className="bg-[#2196F3] hover:bg-[#0966AF] text-white px-4 py-2 transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        <nav className="flex space-x-4 items-center relative">
          <Link href="/wishlist" className="hover:text-[#6EB8F7]">
            Wishlist
          </Link>
          <Link href="/account" className="hover:text-[#6EB8F7]">
            Account
          </Link>

          {session?.user ? (
            <div className="relative">
              <Image
                src={session.user.image || "/default-avatar.png"}
                alt="Profile"
                width={36}
                height={36}
                className="rounded-full border-2 border-white cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg z-50">
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => signOut()}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/signup"
              className="border border-white px-4 py-1 rounded-full text-sm hover:bg-white hover:text-[#053358] transition"
            >
              Sign up
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
