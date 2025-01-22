"use client";

import { useCallback, useEffect, useState } from "react";
import { FlockSelector } from "@/components/flock-selector";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { create, getAll, remove } from "@/lib/api";
import { useFlocks } from "@/store/flocks";
import { Spinner } from "@/components/ui/spinner";
import { Trash2 } from "lucide-react";

export default function ManureManagement() {
  const { selectedFlock } = useFlocks();
  const [isLoading, setIsLoading] = useState(false);
  const [sales, setSales] = useState([]);

  const [newSale, setNewSale] = useState({
    date: new Date().toISOString().split("T")[0],
    type: "",
    quantity: "",
    rate: "",
    customer: "",
    flock: selectedFlock?._id,
  });

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

  const handleNewSale = async () => {
    const response = await create("manure", {
      ...newSale,
      flock: selectedFlock?._id,
    });

    if (response) {
      fetchSales();
      setNewSale({
        date: new Date().toISOString().split("T")[0],
        type: "",
        quantity: "",
        rate: "",
        customer: "",
        flock: selectedFlock?._id,
      });
    }
  };

  const handleDeleteSale = async (id: string) => {
    if (!confirm("Are you sure you want to delete this manure sale?")) {
      return;
    }

    const response = await remove("manure", id);

    if (response) {
      fetchSales();
    }
  };

  const calculateTotal = () => {
    if (!newSale.quantity || !newSale.rate) return 0;
    return Number(newSale.quantity) * Number(newSale.rate);
  };

  return (
    <>
      <header className="border-b">
        <h1 className="px-4 py-4 text-xl font-semibold">Manure Management</h1>
      </header>

      <FlockSelector />

      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Record Manure Sale</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  type="date"
                  id="date"
                  value={newSale.date}
                  onChange={(e) =>
                    setNewSale({ ...newSale, date: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={newSale.type}
                  onValueChange={(value) =>
                    setNewSale({ ...newSale, type: value })
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bag">Bag</SelectItem>
                    <SelectItem value="dumper">Dumper</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  type="number"
                  id="quantity"
                  placeholder="Number of units"
                  value={newSale.quantity}
                  onChange={(e) =>
                    setNewSale({ ...newSale, quantity: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rate">Rate per unit (₹)</Label>
                <Input
                  type="number"
                  id="rate"
                  placeholder="Enter rate"
                  value={newSale.rate}
                  onChange={(e) =>
                    setNewSale({ ...newSale, rate: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer">Customer Name</Label>
                <Input
                  type="text"
                  id="customer"
                  placeholder="Enter customer name"
                  value={newSale.customer}
                  onChange={(e) =>
                    setNewSale({ ...newSale, customer: e.target.value })
                  }
                  required
                />
              </div>

              <div className="rounded-lg bg-muted p-4">
                <div className="flex justify-between">
                  <span>Total Amount</span>
                  <span className="font-bold">
                    ₹ {calculateTotal().toLocaleString()}
                  </span>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={(e) => {
                  e.preventDefault();
                  handleNewSale();
                }}
              >
                Record Sale
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales History</CardTitle>
          </CardHeader>
          {isLoading && <Spinner />}
          {!isLoading && (
            <CardContent>
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
                  {sales.map((sale: any) => (
                    <TableRow key={sale._id}>
                      <TableCell>
                        {format(new Date(sale.date), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>{sale.customer}</TableCell>
                      <TableCell>{sale.type}</TableCell>
                      <TableCell className="text-right">
                        {sale.quantity}
                      </TableCell>
                      <TableCell className="text-right">₹{sale.rate}</TableCell>
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
            </CardContent>
          )}
        </Card>
      </div>
    </>
  );
}