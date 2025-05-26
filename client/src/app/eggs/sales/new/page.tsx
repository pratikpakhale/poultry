"use client";

import { FlockRequired } from "@/components/flock-required";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { create, getAll } from "@/lib/api";
import { useFlocks } from "@/store/flocks";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type Customer = { _id: string; name: string };

export default function AddSalePage() {
  const router = useRouter();
  const { selectedFlock, refreshFlocks } = useFlocks();
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [newSale, setNewSale] = useState({
    date: new Date().toISOString().split("T")[0],
    customer: "",
    quantity: "",
    rate: "",
    amountPaid: "",
    flock: selectedFlock?._id,
  });

  // Fetch the list of customers
  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    const response = await getAll("customer");
    if (response) {
      setCustomers(response.data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const calculateTotalSale = () => {
    if (!newSale.quantity || !newSale.rate) return 0;
    return (Number(newSale.quantity) * Number(newSale.rate)) / 100;
  };

  const handleNewSale = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!newSale.customer) {
      alert("Please select a customer");
      return;
    }

    // Set amount paid to total if not specified
    const saleData = { ...newSale };
    const saleAmount = calculateTotalSale();
    if (!saleData.amountPaid) {
      saleData.amountPaid = saleAmount.toString();
    }

    const response = await create("eggsSale", {
      ...saleData,
      flock: selectedFlock?._id,
    });

    if (response) {
      refreshFlocks();
      // Navigate back to the sales list page
      router.push("/eggs/sales");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <FlockRequired>
        {/* Header without back button */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Record Egg Sale</h1>
        </div>

        {/* Form Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Sale Details</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Spinner />
              </div>
            ) : customers.length === 0 ? (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>No customers found</AlertTitle>
                <AlertDescription>
                  You need to add customers before recording a sale.{" "}
                  <Link
                    href="/eggs/customers/new"
                    className="underline font-medium"
                  >
                    Add a new customer
                  </Link>
                </AlertDescription>
              </Alert>
            ) : (
              <form className="space-y-4" onSubmit={handleNewSale}>
                <div className="space-y-2">
                  <Label htmlFor="sale-date">Date</Label>
                  <Input
                    type="date"
                    id="sale-date"
                    value={newSale.date}
                    onChange={(e) =>
                      setNewSale({
                        ...newSale,
                        date: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer">Customer</Label>
                  <div className="flex gap-2">
                    <Select
                      value={newSale.customer}
                      onValueChange={(value) =>
                        setNewSale({
                          ...newSale,
                          customer: value,
                        })
                      }
                      required
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer: Customer) => (
                          <SelectItem key={customer._id} value={customer._id}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      onClick={() => router.push("/eggs/customers/new")}
                    >
                      New
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity of Eggs</Label>
                  <Input
                    type="number"
                    id="quantity"
                    placeholder="Enter quantity"
                    value={newSale.quantity}
                    onChange={(e) =>
                      setNewSale({
                        ...newSale,
                        quantity: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rate">Rate per 100 eggs</Label>
                  <Input
                    type="number"
                    id="rate"
                    placeholder="Enter rate per 100 eggs"
                    value={newSale.rate}
                    onChange={(e) =>
                      setNewSale({
                        ...newSale,
                        rate: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="rounded-lg bg-muted p-4">
                  <div className="flex justify-between">
                    <span>Total Amount</span>
                    <span className="font-bold">
                      ₹{calculateTotalSale().toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amountPaid">Amount Paid</Label>
                  <Input
                    type="number"
                    id="amountPaid"
                    placeholder={`Enter amount paid (default: ${calculateTotalSale().toFixed(
                      2
                    )})`}
                    value={newSale.amountPaid}
                    onChange={(e) =>
                      setNewSale({
                        ...newSale,
                        amountPaid: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="pt-4">
                  <Button type="submit" className="w-full">
                    Record Sale
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </FlockRequired>
    </div>
  );
}
