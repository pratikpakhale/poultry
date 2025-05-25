"use client";

import { getBreadcrumbItems } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

  // Determine which items to show based on length
  const showingItems =
    breadcrumbItems.length > 3
      ? [
          breadcrumbItems[0], // First item (Home)
          { label: "...", path: "" }, // Ellipsis
          ...breadcrumbItems.slice(-2), // Last two items
        ]
      : breadcrumbItems;

  return (
    <nav
      className={cn(
        "flex flex-wrap items-center gap-1 text-sm text-muted-foreground min-w-0",
        className
      )}
      aria-label="Breadcrumb"
    >
      <ol className="flex flex-wrap items-center gap-1 min-w-0">
        {showingItems.map((item, index) => {
          const isLast = index === showingItems.length - 1;
          const isEllipsis = item.label === "...";

          return (
            <li
              key={item.path || index}
              className="flex items-center min-w-0 max-w-full"
            >
              {index > 0 && (
                <ChevronRight className="h-4 w-4 mx-0.5 flex-shrink-0 text-muted-foreground/60" />
              )}

              {isLast ? (
                <span className="font-medium text-foreground truncate min-w-0">
                  {item.label}
                </span>
              ) : isEllipsis ? (
                <span className="text-muted-foreground flex-shrink-0">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className="hover:text-foreground transition-colors truncate min-w-0"
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
