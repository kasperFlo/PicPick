import type { Metadata } from "next";
import "./globals.css";
import { poppins , epilogue} from '@/lib/fonts';

export const metadata: Metadata = {
  title: "Shopping Platform",
  description: "Your conglomerate shopping platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Sticky Header */}
        <header className="sticky top-0 z-50 flex justify-between items-center p-4 bg-white text-black shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-pink-500 font-bold text-lg">🌟</span>
            <span className="font-semibold text-lg">PicPick</span>
          </div>
          <nav className="flex gap-6 text-sm">
            <a href="#">All categories</a>
            <a href="#">Sale</a>
            <a href="#">Blogs</a>
            <a href="#">How to use</a>
            <a href="#">About us</a>
          </nav>
          <button className="border border-gray-400 px-4 py-1 rounded-full text-sm">
            Sign in
          </button>
        </header>

        {/* Page Content */}
        {children}

        {/* Global Footer */}
        <footer className="bg-white text-center text-sm text-gray-600 border-t border-gray-300 mt-20 px-4 py-8">
          {/* Top Links */}
          <div className="mb-4 space-x-4 text-blue-600 font-medium">
            <a href="#">About Us</a>
            <a href="#">Customer Service</a>
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Sitemap</a>
          </div>

          {/* Site Name */}
          <h2 className="text-2xl font-bold text-black mb-2">PicPick CA</h2>

          {/* Subheading */}
          <h3 className="font-semibold text-black mb-2">
            PicPick<sup>®</sup> CA • Search Products Faster
          </h3>

          {/* Copyright */}
          <p className="mb-1">
            Copyright © 2003–2025 PicPick Inc. All Rights Reserved.
          </p>

          {/* Inspirational Message */}
          <p className="italic text-gray-500">
            You are my one and only...You are the one to find deals...
          </p>
        </footer>
      </body>
    </html>
  );
}
