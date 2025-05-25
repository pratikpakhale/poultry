"use client";

import { FlockRequired } from "@/components/flock-required";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { create } from "@/lib/api";
import { useFlocks } from "@/store/flocks";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddMortalityPage() {
  const router = useRouter();
  const { selectedFlock, refreshFlocks } = useFlocks();

  const [newMortality, setNewMortality] = useState({
    date: new Date().toISOString().split("T")[0],
    quantity: "",
    flock: selectedFlock?._id,
  });

  const handleNewMortality = async () => {
    // Validation
    if (!newMortality.quantity || Number(newMortality.quantity) <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    const response = await create("birdMortality", {
      ...newMortality,
      flock: selectedFlock?._id,
    });

    if (response) {
      refreshFlocks();
      // Navigate back to the mortality list page
      router.push("/birds/mortality");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <FlockRequired>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Record Bird Mortality</h1>
        </div>

        {/* Form Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Mortality Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleNewMortality();
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="mortality-date">Date</Label>
                <Input
                  type="date"
                  id="mortality-date"
                  value={newMortality.date}
                  onChange={(e) =>
                    setNewMortality({
                      ...newMortality,
                      date: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="death-count">Number of Birds</Label>
                <Input
                  type="number"
                  id="death-count"
                  placeholder="Enter quantity"
                  value={newMortality.quantity}
                  onChange={(e) =>
                    setNewMortality({
                      ...newMortality,
                      quantity: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full">
                  Record Mortality
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </FlockRequired>
    </div>
  );
}
