"use client";

import { navigationConfig, NavItem } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { useNavigation } from "@/store/navigation";
import { UserButton } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export function SideDrawer() {
  const { isDrawerOpen, closeDrawer } = useNavigation();
  const pathname = usePathname();

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={closeDrawer}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed left-0 top-0 z-50 h-full w-[280px] border-r bg-background p-4 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Pakhale Poultry</h2>
              <button
                onClick={closeDrawer}
                className="p-1 rounded-full hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center space-x-3 mb-8 px-2 py-2 rounded-lg border">
              <UserButton afterSignOutUrl="/" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">User Profile</p>
                <p className="text-xs text-muted-foreground truncate">
                  Manage your account
                </p>
              </div>
            </div>

            <nav className="space-y-1">
              {navigationConfig.map((item) => (
                <NavItemComponent
                  key={item.path}
                  item={item}
                  pathname={pathname}
                  onClick={closeDrawer}
                />
              ))}
            </nav>

            <div className="absolute bottom-4 left-4 right-4">
              <div className="p-3 rounded-lg border">
                <p className="text-xs text-muted-foreground">Version 1.0.0</p>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

function NavItemComponent({
  item,
  pathname,
  onClick,
  depth = 0,
}: {
  item: NavItem;
  pathname: string;
  onClick: () => void;
  depth?: number;
}) {
  const [expanded, setExpanded] = React.useState(
    pathname.startsWith(item.path)
  );
  const hasChildren = item.children && item.children.length > 0;

  // Improved active state logic
  const isExactMatch = pathname === item.path;
  const isChildActive =
    hasChildren &&
    item.children?.some(
      (child) => pathname === child.path || pathname.startsWith(child.path)
    );
  const isActive =
    isExactMatch ||
    (hasChildren &&
      isChildActive &&
      !pathname.includes("/", item.path.length + 1));

  const handleExpand = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setExpanded(!expanded);
    }
  };

  return (
    <div>
      <Link
        href={hasChildren ? "#" : item.path}
        className={cn(
          "flex items-center justify-between py-2 px-3 rounded-md text-sm",
          "hover:bg-muted transition-colors duration-200",
          isActive ? "bg-muted font-medium text-primary" : "",
          depth > 0 ? "pl-[calc(0.75rem*depth)]" : ""
        )}
        onClick={(e) => {
          if (hasChildren) {
            handleExpand(e);
          } else {
            onClick();
          }
        }}
      >
        <div className="flex items-center gap-3">
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
        </div>

        {hasChildren && (
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              expanded ? "transform rotate-180" : ""
            )}
          />
        )}
      </Link>

      {hasChildren && expanded && (
        <div className="mt-1 ml-3 pl-3 border-l">
          {item.children?.map((child) => (
            <NavItemComponent
              key={child.path}
              item={child}
              pathname={pathname}
              onClick={onClick}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
