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
import { Spinner } from "@/components/ui/spinner";
import { create, getAll } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface Material {
  _id: string;
  name: string;
  unit: string;
}

export default function AddExpensePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);

  const [purchaseMaterial, setPurchaseMaterial] = useState({
    date: new Date().toISOString().split("T")[0],
    material: "",
    quantity: "",
    cost: "",
  });

  const fetchMaterials = useCallback(async () => {
    setIsLoading(true);
    const response = await getAll("material");

    if (response) {
      setMaterials(response.data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  const handleNewPurchase = async () => {
    // Validation
    if (!purchaseMaterial.material) {
      alert("Please select a material");
      return;
    }

    if (!purchaseMaterial.quantity || Number(purchaseMaterial.quantity) <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    if (!purchaseMaterial.cost || Number(purchaseMaterial.cost) <= 0) {
      alert("Please enter a valid cost");
      return;
    }

    const response = await create("feedPurchase", {
      date: purchaseMaterial.date,
      material: purchaseMaterial.material,
      quantity: Number(purchaseMaterial.quantity),
      cost: Number(purchaseMaterial.cost),
    });

    if (response) {
      // Navigate back to the expenses list page
      router.push("/feed/expenses");
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Record Feed Purchase</h1>
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
                value={purchaseMaterial.date}
                onChange={(e) =>
                  setPurchaseMaterial({
                    ...purchaseMaterial,
                    date: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="material">Material</Label>
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Spinner />
                </div>
              ) : (
                <Select
                  value={purchaseMaterial.material}
                  onValueChange={(value) =>
                    setPurchaseMaterial({
                      ...purchaseMaterial,
                      material: value,
                    })
                  }
                  required
                >
                  <SelectTrigger id="material">
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    {materials.map((material) => (
                      <SelectItem key={material._id} value={material._id}>
                        {material.name} ({material.unit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                type="number"
                id="quantity"
                placeholder="Enter quantity"
                value={purchaseMaterial.quantity}
                onChange={(e) =>
                  setPurchaseMaterial({
                    ...purchaseMaterial,
                    quantity: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Cost (₹)</Label>
              <Input
                type="number"
                id="cost"
                placeholder="Enter cost"
                value={purchaseMaterial.cost}
                onChange={(e) =>
                  setPurchaseMaterial({
                    ...purchaseMaterial,
                    cost: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full">
                Record Purchase
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
