import type { Metadata } from "next";
import "./globals.css";
import { poppins } from "@/lib/types/fonts";
import Header from "@/app/components/header";
import { Providers } from "@/app/contexts/providers";

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
      <body className={`${poppins.className} bg-white`}>
      <script src="https://accounts.google.com/gsi/client" async defer></script>

        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">{children}</main>
            <footer className="bg-zinc-900 text-center text-sm text-zinc-300 border-t border-zinc-800 px-4 py-8">
              <div className="mb-4 space-x-4 text-blue-400 font-medium">
                <a href="#">About Us</a>
                <a href="#">Customer Service</a>
                <a href="#">Terms of Service</a>
                <a href="#">Privacy Policy</a>
                <a href="#">Sitemap</a>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">PicPick CA</h2>
              <h3 className="font-semibold text-white mb-2">
                PicPick<sup>®</sup> CA • Search Products Faster
              </h3>
              <p className="mb-1">
                Copyright © 2003–2025 PicPick Inc. All Rights Reserved.
              </p>
              <p className="italic text-zinc-400">
                You are my one and only...You are the one to find deals...
              </p>
            </footer>
          </div>
        </Providers>
        
      </body>
    </html>
  );
}
