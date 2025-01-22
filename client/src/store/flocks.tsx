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
  loading: boolean;
  error: string | null;
  fetchFlocks: () => void;
}

const FlocksContext = createContext<FlocksContextType | undefined>(undefined);

export function FlocksProvider({ children }: { children: ReactNode }) {
  const [flocks, setFlocks] = useState<Flock[]>([]);
  const [selectedFlock, setSelectedFlock] = useState<Flock | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFlocks = useCallback(async () => {
    try {
      const response = await getAll("flock", { active: "true" });
      setFlocks(response.data);

      const cached = localStorage.getItem("selectedFlock");
      let foundFlock = null;

      if (cached) {
        foundFlock = response.data.find((flock: Flock) => flock._id === cached);
      }

      if (foundFlock) {
        setSelectedFlock(foundFlock);
      } else if (response.data.length > 0) {
        setSelectedFlock(response.data[0]);
      }

      setLoading(false);
    } catch (err) {
      setError("Failed to fetch flocks");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFlocks();
  }, []);

  const handleSetSelectedFlock = (flock: Flock | null) => {
    setSelectedFlock(flock);
    if (flock) {
      localStorage.setItem("selectedFlock", flock._id);
    } else {
      localStorage.removeItem("selectedFlock");
    }
  };

  const value = {
    flocks,
    selectedFlock,
    setSelectedFlock: handleSetSelectedFlock,
    loading,
    error,
    fetchFlocks: async () => {
      setLoading(true);
      await fetchFlocks();
      setLoading(false);
    },
  };

  return (
    <FlocksContext.Provider value={value}>{children}</FlocksContext.Provider>
  );
}

export function useFlocks() {
  const context = useContext(FlocksContext);
  if (context === undefined) {
    throw new Error("useFlocks must be used within a FlocksProvider");
  }
  return context;
}
