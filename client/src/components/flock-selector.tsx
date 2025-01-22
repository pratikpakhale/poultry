'use client'

import { ChevronDown } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useFlocks } from "@/store/flocks";

export function FlockSelector() {
  const { error, flocks, loading, selectedFlock, setSelectedFlock } =
    useFlocks();

  return (
    <div className="px-4 py-2 bg-muted/50">
      <Select
        value={selectedFlock?._id ?? undefined}
        onValueChange={(value) =>
          setSelectedFlock(flocks.find((f) => f._id === value) ?? null)
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Flock" />
        </SelectTrigger>
        <SelectContent>
          {loading ? (
            <SelectItem value="loading">Loading flocks...</SelectItem>
          ) : error ? (
            <SelectItem value="error">Error loading flocks</SelectItem>
          ) : (
            flocks.map((flock) => (
              <SelectItem key={flock._id} value={flock._id}>
                {flock.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}

