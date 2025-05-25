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
import { BirdSale } from "./types";

export default function BirdSalesPage() {
  const router = useRouter();
  const { selectedFlock, refreshFlocks } = useFlocks();
  const [isLoading, setIsLoading] = useState(false);
  const [sales, setSales] = useState<BirdSale[]>([]);

  const fetchSales = useCallback(async () => {
    if (!selectedFlock) return;

    setIsLoading(true);
    const response = await getAll("birdSale", {
      flock: selectedFlock._id,
    });

    if (response) {
      setSales(response.data);
    }
    setIsLoading(false);
  }, [selectedFlock]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const handleDeleteSale = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sale record?")) {
      return;
    }

    const response = await remove("birdSale", id);
    if (response) {
      fetchSales();
      refreshFlocks();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <FlockRequired>
        {/* Header with add button */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Bird Sales</h1>

          {/* Add New Button */}
          <Button
            onClick={() => router.push("/birds/sell/new")}
            className="gap-1"
          >
            <Plus size={16} />
            Add New
          </Button>
        </div>

        {/* Sales Table */}
        <Card>
          <CardHeader>
            <CardTitle>Sale Records</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && <Spinner />}
            {!isLoading && sales.length === 0 && (
              <p className="text-center py-4 text-muted-foreground">
                No sale records found. Click &quot;Add New&quot; to record a
                sale.
              </p>
            )}
            {!isLoading && sales.length > 0 && (
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
                  {sales.map((sale: BirdSale) => (
                    <TableRow key={sale._id}>
                      <TableCell>
                        {format(new Date(sale.date), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        {sale.quantity}
                      </TableCell>
                      <TableCell className="text-right">{sale.rate}</TableCell>
                      <TableCell className="text-right">
                        {sale.quantity * sale.rate}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSale(sale._id)}
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
