import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
    <>
      <header className="flex justify-between items-center p-4 bg-white text-black shadow-md">
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
    <html lang="en">
        {/* Header */}


        <body className={inter.className}>{children}</body>
      </html></>
  );
}
