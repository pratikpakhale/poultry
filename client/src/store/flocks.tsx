import { getAll } from "@/lib/api";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

interface Flock {
  _id: string;
  name: string;
  eggs: number;
  quantity: number;
  mortality: number;
}

interface FlocksContextType {
  flocks: Flock[];
  selectedFlock: Flock | null;
  setSelectedFlock: (flock: Flock | null) => void;
  isLoading: boolean;
  error: string | null;
  refreshFlocks: () => Promise<void>;
}

const FlocksContext = createContext<FlocksContextType | undefined>(undefined);

export function FlocksProvider({ children }: { children: ReactNode }) {
  const [flocks, setFlocks] = useState<Flock[]>([]);
  const [selectedFlock, setSelectedFlock] = useState<Flock | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFlocks = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getAll("flock", { active: "true" });
      setFlocks(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      console.error("Error fetching flocks:", err);
      setError("Failed to fetch flocks");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshFlocks = useCallback(async () => {
    await fetchFlocks();
  }, [fetchFlocks]);

  useEffect(() => {
    const initialize = async () => {
      const data = await fetchFlocks();
      if (!data) return;

      const savedFlockId = localStorage.getItem("selectedFlock");
      if (savedFlockId) {
        const savedFlock = data.find((f: Flock) => f._id === savedFlockId);
        if (savedFlock) {
          setSelectedFlock(savedFlock);
        } else {
          localStorage.removeItem("selectedFlock");
        }
      }
    };

    initialize();
  }, [fetchFlocks]);

  const handleSetSelectedFlock = useCallback((flock: Flock | null) => {
    setSelectedFlock(flock);
    if (flock) {
      localStorage.setItem("selectedFlock", flock._id);
    } else {
      localStorage.removeItem("selectedFlock");
    }
  }, []);

  return (
    <FlocksContext.Provider
      value={{
        flocks,
        selectedFlock,
        setSelectedFlock: handleSetSelectedFlock,
        isLoading,
        error,
        refreshFlocks,
      }}
    >
      {children}
    </FlocksContext.Provider>
  );
}

export function useFlocks() {
  const context = useContext(FlocksContext);
  if (context === undefined) {
    throw new Error("useFlocks must be used within a FlocksProvider");
  }
  return context;
}
