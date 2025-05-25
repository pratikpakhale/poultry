"use client";

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
import { create } from "@/lib/api";
import { useFlocks } from "@/store/flocks";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddManureSalePage() {
  const router = useRouter();
  const { selectedFlock } = useFlocks();

  const [newSale, setNewSale] = useState({
    date: new Date().toISOString().split("T")[0],
    type: "",
    quantity: "",
    rate: "",
    customer: "",
    flock: selectedFlock?._id,
  });

  const handleNewSale = async () => {
    const response = await create("manure", {
      ...newSale,
      flock: selectedFlock?._id,
    });

    if (response) {
      // Navigate back to the manure list page
      router.push("/manure");
    }
  };

  const calculateTotal = () => {
    if (!newSale.quantity || !newSale.rate) return 0;
    return Number(newSale.quantity) * Number(newSale.rate);
  };

  return (
    <>
      <header className="border-b">
        <h1 className="px-4 py-4 text-xl font-semibold">Add New Manure Sale</h1>
      </header>

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

              <div className="pt-4">
                <Button
                  className="w-full"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNewSale();
                  }}
                >
                  Record Sale
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
