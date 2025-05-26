"use client";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { create, getAll, remove } from "@/lib/api";
import { format } from "date-fns";
import { AlertTriangle, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface Material {
  _id: string;
  name: string;
  type: string;
  quantity: number;
  unit: string;
}

interface Deduction {
  _id: string;
  date: Date;
  material: {
    _id: string;
    name: string;
    unit: string;
  };
  quantity: number;
  cost: number;
}

export default function InventoryPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeductionsLoading, setIsDeductionsLoading] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [deductMaterials, setDeductMaterials] = useState<Deduction[]>([]);
  const [deductMaterial, setDeductMaterial] = useState({
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

  const fetchDeductions = useCallback(async () => {
    setIsDeductionsLoading(true);
    const response = await getAll("feedSale", {
      populate: "material",
    });

    if (response) {
      setDeductMaterials(response.data);
    }
    setIsDeductionsLoading(false);
  }, []);

  useEffect(() => {
    fetchMaterials();
    fetchDeductions();
  }, [fetchMaterials, fetchDeductions]);

  const handleDeductMaterial = async () => {
    // Validation
    if (!deductMaterial.material) {
      alert("Please select a material");
      return;
    }

    const response = await create("feedSale", {
      date: deductMaterial.date,
      material: deductMaterial.material,
      quantity: Number(deductMaterial.quantity),
      cost: deductMaterial.cost ? Number(deductMaterial.cost) : 0,
    });

    if (response) {
      fetchMaterials();
      fetchDeductions();
      setDeductMaterial({
        date: new Date().toISOString().split("T")[0],
        material: "",
        quantity: "",
        cost: "",
      });
    }
  };

  const handleDeleteDeduction = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) {
      return;
    }

    const response = await remove("feedSale", id);
    if (response) {
      fetchMaterials();
      fetchDeductions();
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Feed Inventory</h1>
      </div>

      {/* Current Inventory */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Spinner />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.map((material) => (
                  <TableRow key={material._id}>
                    <TableCell>{material.name}</TableCell>
                    <TableCell>{material.type}</TableCell>
                    <TableCell className="text-right">
                      {material.quantity} {material.unit}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Material Deduction Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Record Material Use/Sale</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleDeductMaterial();
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="deduct-date">Date</Label>
              <Input
                type="date"
                id="deduct-date"
                value={deductMaterial.date}
                onChange={(e) =>
                  setDeductMaterial({
                    ...deductMaterial,
                    date: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deduct-material">Material</Label>
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Spinner />
                </div>
              ) : materials.length === 0 ? (
                <Alert variant="destructive" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>No materials found</AlertTitle>
                  <AlertDescription>
                    You need to add materials before recording material use.{" "}
                    <Link
                      href="/manage/materials"
                      className="underline font-medium"
                    >
                      Add new material
                    </Link>
                  </AlertDescription>
                </Alert>
              ) : (
                <Select
                  value={deductMaterial.material}
                  onValueChange={(value) =>
                    setDeductMaterial({
                      ...deductMaterial,
                      material: value,
                    })
                  }
                  required
                >
                  <SelectTrigger id="deduct-material">
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
              <Label htmlFor="deduct-quantity">Quantity</Label>
              <Input
                type="number"
                id="deduct-quantity"
                placeholder="Enter quantity"
                value={deductMaterial.quantity}
                onChange={(e) =>
                  setDeductMaterial({
                    ...deductMaterial,
                    quantity: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deduct-cost">Revenue (₹) (Optional)</Label>
              <Input
                type="number"
                id="deduct-cost"
                placeholder="Enter revenue if sold"
                value={deductMaterial.cost}
                onChange={(e) =>
                  setDeductMaterial({
                    ...deductMaterial,
                    cost: e.target.value,
                  })
                }
              />
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full">
                Record Material Use
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Material Deductions History */}
      <Card>
        <CardHeader>
          <CardTitle>Material Use History</CardTitle>
        </CardHeader>
        <CardContent>
          {isDeductionsLoading ? (
            <div className="flex items-center justify-center p-4">
              <Spinner />
            </div>
          ) : (
            <>
              {deductMaterials.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">
                  No material use records found.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Material</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Revenue (₹)</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deductMaterials.map((deduction) => (
                      <TableRow key={deduction._id}>
                        <TableCell>
                          {format(new Date(deduction.date), "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell>{deduction.material.name}</TableCell>
                        <TableCell className="text-right">
                          {deduction.quantity} {deduction.material.unit}
                        </TableCell>
                        <TableCell className="text-right">
                          {deduction.cost || "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteDeduction(deduction._id)}
                          >
                            <Trash2 size={16} color="red" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
