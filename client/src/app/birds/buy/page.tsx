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
import { BirdPurchase } from "./types";

export default function BirdPurchasesPage() {
  const router = useRouter();
  const { selectedFlock, refreshFlocks } = useFlocks();
  const [isLoading, setIsLoading] = useState(false);
  const [purchases, setPurchases] = useState<BirdPurchase[]>([]);

  const fetchPurchases = useCallback(async () => {
    if (!selectedFlock) return;

    setIsLoading(true);
    const response = await getAll("birdPurchase", {
      flock: selectedFlock._id,
    });

    if (response) {
      setPurchases(response.data);
    }
    setIsLoading(false);
  }, [selectedFlock]);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  const handleDeletePurchase = async (id: string) => {
    if (!confirm("Are you sure you want to delete this purchase record?")) {
      return;
    }

    const response = await remove("birdPurchase", id);
    if (response) {
      fetchPurchases();
      refreshFlocks();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <FlockRequired>
        {/* Header with add button */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Bird Purchases</h1>

          {/* Add New Button */}
          <Button
            onClick={() => router.push("/birds/buy/new")}
            className="gap-1"
          >
            <Plus size={16} />
            Add New
          </Button>
        </div>

        {/* Purchases Table */}
        <Card>
          <CardHeader>
            <CardTitle>Purchase Records</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && <Spinner />}
            {!isLoading && purchases.length === 0 && (
              <p className="text-center py-4 text-muted-foreground">
                No purchase records found. Click &quot;Add New&quot; to record a
                purchase.
              </p>
            )}
            {!isLoading && purchases.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Rate (₹)</TableHead>
                    <TableHead className="text-right">Total (₹)</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchases.map((purchase: BirdPurchase) => (
                    <TableRow key={purchase._id}>
                      <TableCell>
                        {format(new Date(purchase.date), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        {purchase.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {purchase.rate}
                      </TableCell>
                      <TableCell className="text-right">
                        {purchase.quantity * purchase.rate}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePurchase(purchase._id)}
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
