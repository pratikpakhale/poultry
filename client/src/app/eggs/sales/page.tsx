"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { getAll, remove } from "@/lib/api";
import { useFlocks } from "@/store/flocks";
import { Spinner } from "@/components/ui/spinner";
import { Plus, Trash2 } from "lucide-react";
import { FlockRequired } from "@/components/flock-required";

export default function SalesPage() {
  const router = useRouter();
  const { selectedFlock, refreshFlocks } = useFlocks();
  const [isLoading, setIsLoading] = useState(false);
  const [sales, setSales] = useState([]);

  const fetchSales = useCallback(async () => {
    if (!selectedFlock) return;

    setIsLoading(true);
    const response = await getAll("eggsSale", {
      flock: selectedFlock._id,
      populate: "customer",
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
    if (!confirm("Are you sure you want to delete this sale?")) {
      return;
    }

    const response = await remove("eggsSale", id);
    if (response) {
      fetchSales();
      refreshFlocks();
    }
  };

  const getPaymentStatus = (sale: any) => {
    const totalAmount = (sale.quantity * sale.rate) / 100;
    const difference = sale.amountPaid - totalAmount;

    if (Math.abs(difference) < 0.01) return "Exact";
    if (difference > 0) return `+${difference.toFixed(2)}`;
    return difference.toFixed(2);
  };

  return (
    <div className="container mx-auto p-4">
      <FlockRequired>
        {/* Header without back button */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Egg Sales</h1>

          {/* Add New Sale Button */}
          <Button
            onClick={() => router.push("/eggs/sales/new")}
            className="gap-1"
          >
            <Plus size={16} />
            Add New Sale
          </Button>
        </div>

        {/* Sales Table */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Records</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && <Spinner />}
            {!isLoading && sales.length === 0 && (
              <p className="text-center py-4 text-muted-foreground">
                No sales records found. Click "Add New Sale" to record a sale.
              </p>
            )}
            {!isLoading && sales.length > 0 && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Rate</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Payment</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sales.map((sale: any) => (
                      <TableRow key={sale._id}>
                        <TableCell>
                          {format(new Date(sale.date), "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell>{sale.customer?.name}</TableCell>
                        <TableCell className="text-right">
                          {sale.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          ₹{sale.rate / 100}
                        </TableCell>
                        <TableCell className="text-right">
                          ₹{((sale.quantity * sale.rate) / 100).toFixed(2)}
                        </TableCell>
                        <TableCell
                          className={`text-right ${
                            getPaymentStatus(sale) !== "Exact"
                              ? parseFloat(getPaymentStatus(sale)) < 0
                                ? "text-red-500"
                                : "text-green-500"
                              : ""
                          }`}
                        >
                          ₹{sale.amountPaid.toFixed(2)} (
                          {getPaymentStatus(sale)})
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
              </div>
            )}
          </CardContent>
        </Card>
      </FlockRequired>
    </div>
  );
}
