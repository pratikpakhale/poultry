"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type NavigationContextType = {
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  navigationHistory: string[];
  addToHistory: (path: string) => void;
  contextActions: React.ReactNode;
  setContextActions: (actions: React.ReactNode) => void;
};

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);
  const [contextActions, setContextActions] = useState<React.ReactNode>(null);

  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);
  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const addToHistory = (path: string) => {
    setNavigationHistory((prev) => {
      if (prev[prev.length - 1] === path) return prev;
      return [...prev, path];
    });
  };

  return (
    <NavigationContext.Provider
      value={{
        isDrawerOpen,
        toggleDrawer,
        openDrawer,
        closeDrawer,
        navigationHistory,
        addToHistory,
        contextActions,
        setContextActions,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}
