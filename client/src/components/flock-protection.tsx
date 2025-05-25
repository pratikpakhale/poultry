"use client";

import { useFlockProtection } from "@/hooks/use-flock-protection";
import { ReactNode } from "react";

export function FlockProtection({ children }: { children: ReactNode }) {
  // This hook handles all redirection logic
  useFlockProtection();
  return <>{children}</>;
}
