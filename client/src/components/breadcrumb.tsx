"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getBreadcrumbItems } from "@/config/navigation";

type BreadcrumbProps = {
  className?: string;
};

export function Breadcrumb({ className }: BreadcrumbProps) {
  const pathname = usePathname();
  const breadcrumbItems = getBreadcrumbItems(pathname);

  // If we're at the home page, don't show breadcrumbs
  if (pathname === "/") {
    return null;
  }

  return (
    <nav
      className={cn(
        "flex items-center space-x-1 text-sm text-muted-foreground",
        className
      )}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-1">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <li key={item.path} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground/60" />
              )}

              {isLast ? (
                <span className="font-medium text-foreground truncate max-w-[150px]">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className="hover:text-foreground transition-colors truncate max-w-[100px]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
