// UserProvider.tsx
import React, { createContext, useEffect, useState } from "react";
import { authService } from "services/implementations/AuthFirebaseService";
import { User } from "models/User";

interface UserContextProps {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextProps>({
  currentUser: null,
  setCurrentUser: () => {},
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
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};
