"use client";
import { SessionProvider } from "next-auth/react";
import { SearchProvider } from "./SearchContext";
import { UserProvider } from "./UserProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UserProvider>
        <SearchProvider>{children}</SearchProvider>
      </UserProvider>
    </SessionProvider>
  );
}
