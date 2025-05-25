"use client";

import { ChevronRight, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFlocks } from "@/store/flocks";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useState, useCallback, useEffect } from "react";

export function FlockSelector() {
  const {
    error,
    flocks,
    isLoading,
    selectedFlock,
    setSelectedFlock,
    refreshFlocks,
  } = useFlocks();
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    if (flocks.length === 0 && !isLoading && !error) {
      refreshFlocks();
    }
  }, [flocks.length, isLoading, error, refreshFlocks]);

  const handleFlockChange = useCallback(
    (value: string) => {
      if (value === selectedFlock?._id || isChanging) return;

      setIsChanging(true);
      const flockToSelect = flocks.find((f) => f._id === value) ?? null;
      setSelectedFlock(flockToSelect);
      setTimeout(() => setIsChanging(false), 50);
    },
    [flocks, selectedFlock, setSelectedFlock, isChanging]
  );

  const showLoading = isLoading || isChanging;

  return (
    <div className="px-4 py-3 bg-muted/50 rounded-md border border-muted">
      <Select
        value={selectedFlock?._id}
        onValueChange={handleFlockChange}
        disabled={showLoading}
      >
        <SelectTrigger className="w-full bg-background">
          <div className="flex items-center gap-2">
            {showLoading && <Loader2 className="h-3 w-3 animate-spin" />}
            <SelectValue placeholder="Select Flock" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {showLoading ? (
            <SelectItem value="loading" disabled>
              <div className="flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Loading flocks...</span>
              </div>
            </SelectItem>
          ) : error ? (
            <SelectItem value="error" disabled>
              <div className="text-destructive">Error loading flocks</div>
            </SelectItem>
          ) : flocks.length === 0 ? (
            <div className="p-2 text-center">
              <p className="text-sm text-muted-foreground">
                No active flocks found
              </p>
              <Link
                href="/manage/flocks"
                className="text-xs text-primary flex items-center justify-center mt-1"
              >
                Create a flock <ChevronRight className="h-3 w-3 ml-1" />
              </Link>
            </div>
          ) : (
            flocks.map((flock) => (
              <SelectItem key={flock._id} value={flock._id}>
                <div className="flex items-center gap-2">
                  {flock.name}
                  {flock.quantity && (
                    <Badge variant="outline" className="ml-1 text-xs">
                      {flock.quantity} birds
                    </Badge>
                  )}
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {!selectedFlock && !showLoading && flocks.length > 0 && (
        <p className="text-xs text-muted-foreground mt-1.5">
          Please select a flock to continue
        </p>
      )}
    </div>
  );
}
