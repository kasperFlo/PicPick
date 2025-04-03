"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { SessionProvider } from "next-auth/react";
import { SearchProvider } from "./SearchContext";
import { UserProvider } from "./UserProvider";
import { useUser } from "./UserProvider";

const { data: session } = useSession();
const { user, setUser } = useUser();

useEffect(() => {
  if (session?.user && !user) {
    setUser({
      token: session.accessToken, 
      name: session.user.name,
      email: session.user.email,
      picture: session.user.image
    });
  }
}, [session]);



export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UserProvider>
        <SearchProvider>{children}</SearchProvider>
      </UserProvider>
    </SessionProvider>
  );
}
