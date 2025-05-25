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
import { getAll } from "@/lib/api";
import { useFlocks } from "@/store/flocks";
import { Spinner } from "@/components/ui/spinner";
import { Plus } from "lucide-react";
import { FlockRequired } from "@/components/flock-required";

// Define interfaces for type safety
interface Customer {
  _id: string;
  name: string;
  balance: number;
}

interface Sale {
  _id: string;
  date: string;
  quantity: number;
  rate: number;
  amountPaid: number;
  customer?: {
    _id: string;
    name: string;
  };
}

export default function CustomersPage() {
  const router = useRouter();
  const { selectedFlock } = useFlocks();
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  // Fetch customers and their sales
  const fetchData = useCallback(async () => {
    setIsLoading(true);

    // Get all customers
    const customersResponse = await getAll("customer");
    if (customersResponse) {
      setCustomers(customersResponse.data);
    }

    // Get sales for the selected flock
    if (selectedFlock) {
      const salesResponse = await getAll("eggsSale", {
        flock: selectedFlock._id,
        populate: "customer",
      });
      if (salesResponse) {
        setSales(salesResponse.data);
      }
    }

    setIsLoading(false);
  }, [selectedFlock]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter sales for the selected customer
  const filteredSales = selectedCustomer
    ? sales.filter((sale) => sale.customer?._id === selectedCustomer)
    : sales;

  return (
    <div className="container mx-auto p-4">
      <FlockRequired>
        {/* Header without back button */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Customers</h1>

          {/* Add New Customer Button */}
          <Button
            onClick={() => router.push("/eggs/customers/new")}
            className="gap-1"
          >
            <Plus size={16} />
            Add New Customer
          </Button>
        </div>

        {/* Customers Table */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Customer Balances</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && <Spinner />}
            {!isLoading && customers.length === 0 && (
              <p className="text-center py-4 text-muted-foreground">
                No customers found. Click "Add New Customer" to add your first
                customer.
              </p>
            )}
            {!isLoading && customers.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer Name</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow
                      key={customer._id}
                      className={
                        selectedCustomer === customer._id ? "bg-muted" : ""
                      }
                    >
                      <TableCell>{customer.name}</TableCell>
                      <TableCell
                        className={`text-right ${
                          customer.balance < 0
                            ? "text-red-500"
                            : customer.balance > 0
                            ? "text-green-500"
                            : ""
                        }`}
                      >
                        ₹{customer.balance.toFixed(2)}
                        {customer.balance < 0
                          ? " (due)"
                          : customer.balance > 0
                          ? " (advance)"
                          : ""}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant={
                            selectedCustomer === customer._id
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            setSelectedCustomer(
                              selectedCustomer === customer._id
                                ? null
                                : customer._id
                            )
                          }
                        >
                          {selectedCustomer === customer._id ? "Hide" : "View"}{" "}
                          Sales
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Sales History for Selected Customer */}
        {selectedCustomer && (
          <Card>
            <CardHeader>
              <CardTitle>
                Sales History for{" "}
                {customers.find((c) => c._id === selectedCustomer)?.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredSales.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">
                  No sales found for this customer.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSales.map((sale) => {
                        const totalAmount = (sale.quantity * sale.rate) / 100;
                        const difference = sale.amountPaid - totalAmount;
                        const paymentStatus =
                          Math.abs(difference) < 0.01
                            ? "Exact"
                            : difference > 0
                            ? `+${difference.toFixed(2)}`
                            : difference.toFixed(2);

                        return (
                          <TableRow key={sale._id}>
                            <TableCell>
                              {format(new Date(sale.date), "dd/MM/yyyy")}
                            </TableCell>
                            <TableCell className="text-right">
                              {sale.quantity}
                            </TableCell>
                            <TableCell className="text-right">
                              ₹{totalAmount.toFixed(2)}
                            </TableCell>
                            <TableCell
                              className={`text-right ${
                                paymentStatus !== "Exact"
                                  ? parseFloat(paymentStatus) < 0
                                    ? "text-red-500"
                                    : "text-green-500"
                                  : ""
                              }`}
                            >
                              ₹{sale.amountPaid.toFixed(2)} ({paymentStatus})
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </FlockRequired>
    </div>
  );
}
