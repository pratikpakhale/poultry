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

type Production = {
  _id: string;
  date: string | Date;
  quantity: number;
  type: string;
};

export default function ProductionPage() {
  const router = useRouter();
  const { selectedFlock, refreshFlocks } = useFlocks();
  const [isLoading, setIsLoading] = useState(false);
  const [productions, setProductions] = useState<Production[]>([]);

  const fetchProductions = useCallback(async () => {
    if (!selectedFlock) return;

    setIsLoading(true);
    const response = await getAll("eggsProduction", {
      flock: selectedFlock._id,
    });

    if (response) {
      setProductions(response.data);
    }
    setIsLoading(false);
  }, [selectedFlock]);

  useEffect(() => {
    fetchProductions();
  }, [fetchProductions]);

  const handleDeleteProduction = async (id: string) => {
    if (!confirm("Are you sure you want to delete this production?")) {
      return;
    }

    const response = await remove("eggsProduction", id);
    if (response) {
      fetchProductions();
      refreshFlocks();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <FlockRequired>
        {/* Header without back button */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Egg Production</h1>

          {/* Add New Production Button */}
          <Button
            onClick={() => router.push("/eggs/production/new")}
            className="gap-1"
          >
            <Plus size={16} />
            Add New
          </Button>
        </div>

        {/* Productions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Production Records</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && <Spinner />}
            {!isLoading && productions.length === 0 && (
              <p className="text-center py-4 text-muted-foreground">
                No production records found. Click &quot;Add New&quot; to record
                production.
              </p>
            )}
            {!isLoading && productions.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productions.map((production: Production) => (
                    <TableRow key={production._id}>
                      <TableCell>
                        {format(new Date(production.date), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>
                        {production.type === "normal" ? "Normal" : "Cracked"}
                      </TableCell>
                      <TableCell className="text-right">
                        {production.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProduction(production._id)}
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
