"use client";

import { FlockRequired } from "@/components/flock-required";
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

export default function AddProductionPage() {
  const router = useRouter();
  const { selectedFlock, refreshFlocks } = useFlocks();

  const [newProduction, setNewProduction] = useState({
    date: new Date().toISOString().split("T")[0],
    quantity: "",
    type: "",
    flock: selectedFlock?._id,
  });

  const handleNewProduction = async () => {
    // Validation
    if (!newProduction.type) {
      alert("Please select an egg type");
      return;
    }

    const response = await create("eggsProduction", {
      ...newProduction,
      flock: selectedFlock?._id,
    });

    if (response) {
      refreshFlocks();
      // Navigate back to the production list page
      router.push("/eggs/production");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <FlockRequired>
        {/* Header without back button */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Add Egg Production</h1>
        </div>

        {/* Form Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Production Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleNewProduction();
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="production-date">Date</Label>
                <Input
                  type="date"
                  id="production-date"
                  value={newProduction.date}
                  onChange={(e) =>
                    setNewProduction({
                      ...newProduction,
                      date: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="egg-count">Number of Eggs</Label>
                <Input
                  type="number"
                  id="egg-count"
                  placeholder="Enter quantity"
                  value={newProduction.quantity}
                  onChange={(e) =>
                    setNewProduction({
                      ...newProduction,
                      quantity: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="egg-type">Type</Label>
                <Select
                  value={newProduction.type}
                  onValueChange={(e) =>
                    setNewProduction({ ...newProduction, type: e })
                  }
                  required
                >
                  <SelectTrigger id="egg-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="cracked">Cracked</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full">
                  Add Production
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </FlockRequired>
    </div>
  );
}
