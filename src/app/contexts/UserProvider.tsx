import React, { createContext, useState, useContext } from "react";

interface User {
  rawToken: string,
  decodedToken: string,
    name?: string;
    email?: string;
    picture?: string;
  }

interface UserContextType {
    user: User;
    setUser: (user: any) => void;
  }

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }:{children: React.ReactNode}) => {
    const [user, setUser] = useState<any>(null);
  
    return (
      <UserContext.Provider value={{ user, setUser }}>
        {children}
      </UserContext.Provider>
    );
  };

// Custom hook to use the UserContext
// This hook allows components to access the user state and the function to update it
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) { throw new Error("useUser must be used within a UserProvider"); }
    return context;
  };
