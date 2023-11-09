// UserProvider.tsx
import React, { createContext, useEffect, useState } from "react";
import { authService } from "services/implementations/AuthFirebaseService";
import { User } from "@models/User";

interface UserContextProps {
  currentUser: User | null;
}

export const UserContext = createContext<UserContextProps>({
  currentUser: null,
});

export const UserProvider = ({ children }: { children: any }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = authService.onUserStateChanged((user) => {
      setCurrentUser(user);
    });

    return unsubscribe; // Unsubscribe on unmount
  }, []);

  return (
    <UserContext.Provider value={{ currentUser }}>
      {children}
    </UserContext.Provider>
  );
};
