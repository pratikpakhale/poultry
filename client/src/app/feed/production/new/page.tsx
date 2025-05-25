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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { create, getAll } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface Formula {
  _id: string;
  name: string;
  materials: Array<{
    material: {
      _id: string;
      name: string;
      quantity: number;
      unit: string;
    };
    quantity: number;
  }>;
}

export default function AddProductionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [selectedFormula, setSelectedFormula] = useState<string>("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const fetchFormulas = useCallback(async () => {
    setIsLoading(true);
    const response = await getAll("formula", {
      populate: "materials.material",
    });

    if (response) {
      setFormulas(response.data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchFormulas();
  }, [fetchFormulas]);

  const handleNewProduction = async () => {
    if (!selectedFormula) {
      alert("Please select a formula");
      return;
    }

    const response = await create("feedProduction", {
      date,
      formula: selectedFormula,
    });

    if (response) {
      // Navigate back to the production list page
      router.push("/feed/production");
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add Feed Production</h1>
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
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="formula">Formula</Label>
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Spinner />
                </div>
              ) : (
                <Select
                  value={selectedFormula}
                  onValueChange={setSelectedFormula}
                  required
                >
                  <SelectTrigger id="formula">
                    <SelectValue placeholder="Select formula" />
                  </SelectTrigger>
                  <SelectContent>
                    {formulas.map((formula) => (
                      <SelectItem key={formula._id} value={formula._id}>
                        {formula.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {selectedFormula && (
              <Card className="bg-muted mt-4">
                <CardHeader>
                  <CardTitle className="text-sm">Formula Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Material</TableHead>
                        <TableHead className="text-right">Required</TableHead>
                        <TableHead className="text-right">Available</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formulas
                        .find((f) => f._id === selectedFormula)
                        ?.materials.map((m) => (
                          <TableRow key={m.material._id}>
                            <TableCell>{m.material.name}</TableCell>
                            <TableCell className="text-right">
                              {m.quantity} {m.material.unit}
                            </TableCell>
                            <TableCell className="text-right">
                              {m.material.quantity} {m.material.unit}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            <div className="pt-4">
              <Button type="submit" className="w-full">
                Record Production
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
