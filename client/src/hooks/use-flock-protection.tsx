"use client";

import { useEffect, useRef } from "react";
import { useFlocks } from "@/store/flocks";
import { useRouter, usePathname } from "next/navigation";

// Paths that REQUIRE flock selection (whitelist approach)
const PROTECTED_PATH_PATTERNS = [
  /^\/$/, // home page
  /^\/eggs($|\/.*)/, // /eggs and all subpaths
  /^\/feed($|\/.*)/, // /feed and all subpaths
  /^\/birds($|\/.*)/, // /birds and all subpaths
  /^\/vaccines($|\/.*)/, // /vaccines and all subpaths
  /^\/manure($|\/.*)/, // /manure and all subpaths
  /^\/other($|\/.*)/, // /other and all subpaths
  /^\/reports($|\/.*)/, // /reports and all subpaths
  /^\/manage\/feed-formulas($|\/.*)/, // feed formulas management
  /^\/manage\/materials($|\/.*)/, // materials management
  // Add other paths that require a selected flock
];

// Paths that should NEVER redirect (regardless of flock selection)
const EXEMPT_PATHS = [
  /^\/select-flock($|\/.*)/,
  /^\/manage\/flocks($|\/.*)/,
  /^\/sign-in($|\/.*)/,
];

export function useFlockProtection() {
  const { selectedFlock, isLoading, flocks } = useFlocks();
  const router = useRouter();
  const pathname = usePathname();
  const redirectionAttempted = useRef(false);

  const isExemptPath = EXEMPT_PATHS.some((pattern) => pattern.test(pathname));
  const requiresFlockSelection = PROTECTED_PATH_PATTERNS.some((pattern) =>
    pattern.test(pathname)
  );

  useEffect(() => {
    redirectionAttempted.current = false;
  }, [pathname]);

  useEffect(() => {
    if (isLoading || redirectionAttempted.current || isExemptPath) return;
    if (pathname.startsWith("/select-flock")) return;

    const needsRedirect =
      requiresFlockSelection && (!selectedFlock || flocks.length === 0);

    if (needsRedirect) {
      redirectionAttempted.current = true;
      try {
        const returnTo = encodeURIComponent(pathname);
        router.push(`/select-flock?returnTo=${returnTo}`);
      } catch (error) {
        console.error("Error during redirection:", error);
      }
    }
  }, [
    isLoading,
    selectedFlock,
    flocks.length,
    isExemptPath,
    requiresFlockSelection,
    pathname,
    router,
  ]);

  return {
    isProtected: !isLoading && requiresFlockSelection && !selectedFlock,
    isExemptPath,
    requiresFlockSelection,
  };
}
