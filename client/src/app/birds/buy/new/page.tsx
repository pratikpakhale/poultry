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

export default function AddBirdPurchasePage() {
  const router = useRouter();
  const { selectedFlock, refreshFlocks } = useFlocks();

  const [newPurchase, setNewPurchase] = useState({
    date: new Date().toISOString().split("T")[0],
    quantity: "",
    rate: "",
    flock: selectedFlock?._id,
  });

  const totalAmount = useMemo(() => {
    const quantity = Number(newPurchase.quantity) || 0;
    const rate = Number(newPurchase.rate) || 0;
    return quantity * rate;
  }, [newPurchase.quantity, newPurchase.rate]);

  const handleNewPurchase = async () => {
    const response = await create("birdPurchase", {
      ...newPurchase,
      flock: selectedFlock?._id,
    });

    if (response) {
      refreshFlocks();
      // Navigate back to the purchases list page
      router.push("/birds/buy");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <FlockRequired>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Record Bird Purchase</h1>
        </div>

        {/* Form Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Purchase Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleNewPurchase();
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="purchase-date">Date</Label>
                <Input
                  type="date"
                  id="purchase-date"
                  value={newPurchase.date}
                  onChange={(e) =>
                    setNewPurchase({
                      ...newPurchase,
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
                  value={newPurchase.quantity}
                  onChange={(e) =>
                    setNewPurchase({
                      ...newPurchase,
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
                  value={newPurchase.rate}
                  onChange={(e) =>
                    setNewPurchase({
                      ...newPurchase,
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
                  Record Purchase
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </FlockRequired>
    </div>
  );
}
