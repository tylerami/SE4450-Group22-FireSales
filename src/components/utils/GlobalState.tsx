// GlobalStateContext.tsx
import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the shape of the global state context
interface GlobalStateContextProps {
  activeTabIndex: number;
  setActiveTabIndex: (index: number) => void;
}

// Create the context with a default value
const GlobalStateContext = createContext<GlobalStateContextProps>({
  activeTabIndex: 0, // Provide a sensible default for the activeTabIndex.
  setActiveTabIndex: () => {
    throw new Error("setActiveTabIndex function must be overridden");
  },
});

// Export a custom hook that wraps the useContext hook for convenience
export const useGlobalState = () => useContext(GlobalStateContext);

// Define the props for the GlobalStateProvider component
interface GlobalStateProviderProps {
  children: ReactNode;
}

// Create a provider component for the global state
export const GlobalStateProvider = ({ children }: GlobalStateProviderProps) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  // The value object encapsulates all global state and setters
  const value = { activeTabIndex, setActiveTabIndex };

  return (
    <GlobalStateContext.Provider value={value}>
      {children}
    </GlobalStateContext.Provider>
  );
};
