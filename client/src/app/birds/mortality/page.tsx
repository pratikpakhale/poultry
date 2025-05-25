"use client";

import { FlockRequired } from "@/components/flock-required";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAll, remove } from "@/lib/api";
import { useFlocks } from "@/store/flocks";
import { format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function MortalityPage() {
  const router = useRouter();
  const { selectedFlock, refreshFlocks } = useFlocks();
  const [isLoading, setIsLoading] = useState(false);
  const [mortalities, setMortalities] = useState([]);

  const fetchMortalities = useCallback(async () => {
    if (!selectedFlock) return;

    setIsLoading(true);
    const response = await getAll("birdMortality", {
      flock: selectedFlock._id,
    });

    if (response) {
      setMortalities(response.data);
    }
    setIsLoading(false);
  }, [selectedFlock]);

  useEffect(() => {
    fetchMortalities();
  }, [fetchMortalities]);

  const handleDeleteMortality = async (id: string) => {
    if (!confirm("Are you sure you want to delete this mortality record?")) {
      return;
    }

    const response = await remove("birdMortality", id);
    if (response) {
      fetchMortalities();
      refreshFlocks();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <FlockRequired>
        {/* Header with add button */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Bird Mortality</h1>

          {/* Add New Button */}
          <Button
            onClick={() => router.push("/birds/mortality/new")}
            className="gap-1"
          >
            <Plus size={16} />
            Add New
          </Button>
        </div>

        {/* Mortalities Table */}
        <Card>
          <CardHeader>
            <CardTitle>Mortality Records</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && <Spinner />}
            {!isLoading && mortalities.length === 0 && (
              <p className="text-center py-4 text-muted-foreground">
                No mortality records found. Click "Add New" to record mortality.
              </p>
            )}
            {!isLoading && mortalities.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mortalities.map((mortality: any) => (
                    <TableRow key={mortality._id}>
                      <TableCell>
                        {format(new Date(mortality.date), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        {mortality.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteMortality(mortality._id)}
                        >
                          <Trash2 size={16} color="red" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </FlockRequired>
    </div>
  );
}
