"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useNavigation } from "@/store/navigation";
import { getBreadcrumbItems } from "@/config/navigation";

export function useBackNavigation() {
  const router = useRouter();
  const { navigationHistory } = useNavigation();

  const canGoBack = navigationHistory.length > 1;

  const goBack = () => {
    if (canGoBack) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return { canGoBack, goBack };
}

export function useBreadcrumbs() {
  const pathname = usePathname();
  return getBreadcrumbItems(pathname);
}

export function useContextActions(actions: React.ReactNode) {
  const { setContextActions } = useNavigation();

  useEffect(() => {
    setContextActions(actions);

    return () => {
      setContextActions(null);
    };
  }, [actions, setContextActions]);
}

export function useNavigationHistory() {
  const pathname = usePathname();
  const { addToHistory } = useNavigation();

  useEffect(() => {
    addToHistory(pathname);
  }, [pathname, addToHistory]);
}
