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
import { useFlocks } from "@/store/flocks";
import { format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type ManureSale = {
  _id: string;
  date: string | Date;
  customer: string;
  type: string;
  quantity: number;
  rate: number;
};

export default function ManureManagement() {
  const router = useRouter();
  const { selectedFlock } = useFlocks();
  const [isLoading, setIsLoading] = useState(false);
  const [sales, setSales] = useState<ManureSale[]>([]);

  const fetchSales = useCallback(async () => {
    if (!selectedFlock) return;
    const response = await getAll("manure", {
      flock: selectedFlock?._id,
    });
    if (response) {
      setSales(response.data);
    }
  }, [selectedFlock]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetchSales();
      setIsLoading(false);
    };
    fetchData();
  }, [selectedFlock, fetchSales]);

  const handleDeleteSale = async (id: string) => {
    if (!confirm("Are you sure you want to delete this manure sale?")) {
      return;
    }

    const response = await remove("manure", id);

    if (response) {
      fetchSales();
    }
  };

  return (
    <>
      <header className="border-b">
        <div className="px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Manure Management</h1>
          <Button onClick={() => router.push("/manure/new")} className="gap-1">
            <Plus size={16} />
            Add New
          </Button>
        </div>
      </header>

      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Sales History</CardTitle>
          </CardHeader>
          {isLoading && <Spinner />}
          {!isLoading && (
            <CardContent>
              {sales.length === 0 && (
                <p className="text-center py-4 text-muted-foreground">
                  No manure sales found. Click &quot;Add New&quot; to record a
                  sale.
                </p>
              )}
              {sales.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Rate</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sales.map((sale: ManureSale) => (
                      <TableRow key={sale._id}>
                        <TableCell>
                          {format(new Date(sale.date), "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell>{sale.customer}</TableCell>
                        <TableCell>{sale.type}</TableCell>
                        <TableCell className="text-right">
                          {sale.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          ₹{sale.rate}
                        </TableCell>
                        <TableCell className="text-right">
                          ₹
                          {(
                            Number(sale.quantity) * Number(sale.rate)
                          ).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant={"ghost"}
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
          )}
        </Card>
      </div>
    </>
  );
}
