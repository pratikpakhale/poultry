"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { create, getAll, update } from "@/lib/api";
import { useFlocks } from "@/store/flocks";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AddFlock } from "./add-flock";
import FlockCard from "./flock-card";

type Flock = { _id: string; name: string; active: boolean; quantity: number };
type FlockUpdate = { name?: string; active?: boolean; deleted?: boolean };

export default function Flocks() {
  const [isLoading, setIsLoading] = useState(true);
  const [flocks, setFlocks] = useState<Flock[]>([]);
  const [isAddingFlock, setIsAddingFlock] = useState(false);
  const { refreshFlocks: refreshGlobalFlocks } = useFlocks();

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
  }, [fetchFlocks]);

  const handleFlockUpdate = async (id: string, data: FlockUpdate) => {
    try {
      await update("flock", id, data);
      fetchFlocks();
      refreshGlobalFlocks();
    } catch (e) {
      console.error(e);
    }
  };

  const handleNewFlock = async (data: FlockUpdate) => {
    try {
      await create("flock", data);
      setIsAddingFlock(false);
      fetchFlocks();
      refreshGlobalFlocks();
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
          {flocks.map((flock: Flock) => (
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
