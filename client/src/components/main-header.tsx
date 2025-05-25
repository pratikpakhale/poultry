"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Breadcrumb } from "./breadcrumb";
import { useNavigation } from "@/store/navigation";
import { motion } from "framer-motion";

type MainHeaderProps = {
  className?: string;
};

export function MainHeader({ className }: MainHeaderProps) {
  const { toggleDrawer, contextActions } = useNavigation();
  const pathname = usePathname();
  const router = useRouter();

  const showBackButton = pathname !== "/";

  const handleBack = () => {
    router.back();
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 h-16 border-b bg-background/95 backdrop-blur-sm z-30",
        "flex items-center justify-between px-4",
        className
      )}
    >
      <div className="flex items-center gap-2">
        {showBackButton ? (
          <button
            onClick={handleBack}
            className="mr-2 p-2 rounded-full hover:bg-muted"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        ) : (
          <button
            onClick={toggleDrawer}
            className="mr-2 p-2 rounded-full hover:bg-muted"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <Breadcrumb />
      </div>

      <div className="flex items-center">
        {contextActions && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            {contextActions}
          </motion.div>
        )}
      </div>
    </header>
  );
}
