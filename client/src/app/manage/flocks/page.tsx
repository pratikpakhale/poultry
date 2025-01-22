"use client";

import { Button } from "@/components/ui/button";
import { create, getAll, update } from "@/lib/api";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import FlockCard from "./flock-card";
import { AddFlock } from "./add-flock";
import { Spinner } from "@/components/ui/spinner";

export default function Flocks() {
  const [isLoading, setIsLoading] = useState(true);
  const [flocks, setFlocks] = useState<any>([]);
  const [isAddingFlock, setIsAddingFlock] = useState(false);

  const fetchFlocks = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAll("flock");
      setFlocks(response.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFlocks();
  }, []);

  const handleFlockUpdate = async (id: string, data: any) => {
    try {
      await update("flock", id, data);
      fetchFlocks();
    } catch (e) {
      console.error(e);
    }
  };

  const handleNewFlock = async (data: any) => {
    try {
      await create("flock", data);
      setIsAddingFlock(false);
      fetchFlocks();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <header className="border-b flex items-center justify-between px-4 py-4">
        <h1 className="text-xl font-semibold">Flocks</h1>
        <Button size="sm" onClick={() => setIsAddingFlock(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Flock
        </Button>
      </header>

      {isLoading && <Spinner className="mt-2" />}

      {!isLoading && (
        <div className="p-4 space-y-4">
          {flocks.map((flock: any) => (
            <div key={flock._id}>
              <FlockCard
                flock={{
                  id: flock._id,
                  name: flock.name,
                  active: flock.active,
                  birds: flock.quantity,
                }}
                onUpdate={handleFlockUpdate}
              />
            </div>
          ))}
        </div>
      )}
      <AddFlock
        open={isAddingFlock}
        onSubmit={handleNewFlock}
        onOpenChange={setIsAddingFlock}
      />
    </>
  );
}
