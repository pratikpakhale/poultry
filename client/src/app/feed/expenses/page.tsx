"use client";

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
import { format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface Purchase {
  _id: string;
  date: Date;
  material: {
    _id: string;
    name: string;
    unit: string;
  };
  quantity: number;
  cost: number;
}

export default function FeedExpensesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  const fetchPurchases = useCallback(async () => {
    setIsLoading(true);
    const response = await getAll("feedPurchase", {
      populate: "material",
    });

    if (response) {
      setPurchases(response.data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  const handleDeletePurchase = async (id: string) => {
    if (!confirm("Are you sure you want to delete this purchase?")) {
      return;
    }

    const response = await remove("feedPurchase", id);
    if (response) {
      fetchPurchases();
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Feed Expenses</h1>

        {/* Add New Purchase Button */}
        <Button
          onClick={() => router.push("/feed/expenses/new")}
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
                  <TableHead>Material</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Cost (₹)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchases.map((purchase) => (
                  <TableRow key={purchase._id}>
                    <TableCell>
                      {format(new Date(purchase.date), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>{purchase.material.name}</TableCell>
                    <TableCell className="text-right">
                      {purchase.quantity} {purchase.material.unit}
                    </TableCell>
                    <TableCell className="text-right">
                      {purchase.cost}
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
    </div>
  );
}
