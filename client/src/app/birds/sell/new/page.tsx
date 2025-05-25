"use client";

import { FlockRequired } from "@/components/flock-required";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { create } from "@/lib/api";
import { useFlocks } from "@/store/flocks";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function AddBirdSalePage() {
  const router = useRouter();
  const { selectedFlock, refreshFlocks } = useFlocks();

  const [newSale, setNewSale] = useState({
    date: new Date().toISOString().split("T")[0],
    quantity: "",
    rate: "",
    flock: selectedFlock?._id,
  });

  const totalAmount = useMemo(() => {
    const quantity = Number(newSale.quantity) || 0;
    const rate = Number(newSale.rate) || 0;
    return quantity * rate;
  }, [newSale.quantity, newSale.rate]);

  const handleNewSale = async () => {
    // Validation
    if (!newSale.quantity || Number(newSale.quantity) <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    if (!newSale.rate || Number(newSale.rate) <= 0) {
      alert("Please enter a valid rate");
      return;
    }

    // Check if we have enough birds to sell
    if (
      selectedFlock &&
      Number(newSale.quantity) >
        selectedFlock.quantity - selectedFlock.mortality
    ) {
      alert("You don't have enough birds to sell this quantity!");
      return;
    }

    const response = await create("birdSale", {
      ...newSale,
      flock: selectedFlock?._id,
    });

    if (response) {
      refreshFlocks();
      // Navigate back to the sales list page
      router.push("/birds/sell");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <FlockRequired>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Record Bird Sale</h1>
        </div>

        {/* Form Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Sale Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleNewSale();
              }}
            >
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
                <Label htmlFor="bird-count">Number of Birds</Label>
                <Input
                  type="number"
                  id="bird-count"
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
                <Label htmlFor="rate">Rate per Bird (₹)</Label>
                <Input
                  type="number"
                  id="rate"
                  placeholder="Enter rate"
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
                  <span className="font-bold">₹{totalAmount}</span>
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full">
                  Record Sale
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </FlockRequired>
    </div>
  );
}
