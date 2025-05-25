"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useFlocks } from "@/store/flocks";
import { useNavigation } from "@/store/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronDown, Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";

type MainHeaderProps = {
  className?: string;
};

export function MainHeader({ className }: MainHeaderProps) {
  const { toggleDrawer, contextActions } = useNavigation();
  const pathname = usePathname();
  const router = useRouter();
  const { selectedFlock, flocks, setSelectedFlock, isLoading } = useFlocks();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const showBackButton = pathname !== "/";
  const isSelectFlockPage = pathname.startsWith("/select-flock");

  // Get the back label based on current path
  const getBackLabel = () => {
    const segments = pathname.split("/").filter(Boolean);

    // If we're more than one level deep, we go back to the parent
    if (segments.length > 1) {
      const parentSegment = segments[segments.length - 2];
      return parentSegment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    // If we're one level deep, we go back to Home
    return "Home";
  };

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
        {/* Always show the hamburger menu */}
        <button
          onClick={toggleDrawer}
          className="mr-2 p-2 rounded-full hover:bg-muted"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Show back button on non-homepage */}
        {showBackButton && (
          <Button
            variant={"outline"}
            onClick={handleBack}
            className="mr-2 gap-2 hover:bg-muted"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to {getBackLabel()}</span>
          </Button>
        )}

        {/* <Breadcrumb /> */}
      </div>

      <div className="flex items-center gap-3">
        {/* Flock Selector in Header - Hidden on select-flock page */}
        {flocks && flocks.length > 0 && !isSelectFlockPage && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu
                  open={dropdownOpen}
                  onOpenChange={setDropdownOpen}
                >
                  <DropdownMenuTrigger className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-muted hover:bg-muted/50 transition-colors text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    {selectedFlock ? (
                      <>
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        <span className="max-w-[120px] truncate">
                          {selectedFlock.name}
                        </span>
                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                      </>
                    ) : (
                      <>
                        <span className="text-muted-foreground">
                          Select Flock
                        </span>
                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                      </>
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    {isLoading ? (
                      <DropdownMenuItem disabled>
                        Loading flocks...
                      </DropdownMenuItem>
                    ) : (
                      <>
                        {flocks.map((flock) => (
                          <DropdownMenuItem
                            key={flock._id}
                            className={cn(
                              "flex items-center gap-2 cursor-pointer",
                              selectedFlock?._id === flock._id && "bg-muted"
                            )}
                            onClick={() => {
                              setSelectedFlock(flock);
                              setDropdownOpen(false);
                            }}
                          >
                            <span className="h-2 w-2 rounded-full bg-green-500"></span>
                            <span>{flock.name}</span>
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-primary mt-1 pt-1"
                          onClick={() => {
                            router.push("/manage/flocks");
                            setDropdownOpen(false);
                          }}
                        >
                          Manage Flocks
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent>
                <p>Quick switch between flocks</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

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
