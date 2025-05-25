"use client";

import { Button } from "@/components/ui/button";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { create, getAll } from "@/lib/api";
import { AlertTriangle, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function AddFormula() {
  const router = useRouter();

  const [flock, setFlock] = useState({
    name: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [materials, setMaterials] = useState<any>([]);
  const [newFormula, setNewFormula] = useState<any>({
    name: "",
    materials: [],
  });

  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [selectedQuantity, setSelectedQuantity] = useState("");

  const fetchMaterials = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAll("material");
      setMaterials(response.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleNewFormula = async (data: any) => {
    try {
      if (data.materials.length === 0) {
        alert("Please add materials to the formula");
        return;
      }

      if (data.name === "") {
        alert("Please provide a name for the formula");
        return;
      }

      await create("formula", data);
      router.push("/manage/feed-formulas");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form className="container mx-auto px-4 py-6 max-w-2xl">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">New Formula</h1>
          <p className="text-muted-foreground">
            Create a new formula from materials.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              onChange={(e) =>
                setNewFormula({ ...newFormula, name: e.target.value })
              }
              name="name"
              id="name"
              value={newFormula.name}
              className="w-full"
              required
            />
          </div>

          <div className="border-b" />
          <div className="p-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Materials</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {newFormula.materials.map((material: any) => (
                      <TableRow key={material.material}>
                        <TableCell>{material.name}</TableCell>
                        <TableCell className="text-right">
                          {material.quantity} {material.unit}{" "}
                        </TableCell>
                        <TableCell className="w-[50px]">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setNewFormula({
                                ...newFormula,
                                materials: newFormula.materials.filter(
                                  (m: any) => m.material !== material.material
                                ),
                              });
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="border-b" />

                {!isLoading && materials.length === 0 ? (
                  <Alert variant="destructive" className="mb-4 mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>No materials found</AlertTitle>
                    <AlertDescription>
                      You need to add materials before creating a formula.{" "}
                      <Link
                        href="/manage/materials"
                        className="underline font-medium"
                      >
                        Add new material
                      </Link>
                    </AlertDescription>
                  </Alert>
                ) : (
                  !isLoading &&
                  materials.some((material: any) => {
                    const usedMaterials = newFormula.materials.map(
                      (m: any) => m.material
                    );
                    return !usedMaterials.includes(material._id);
                  }) && (
                    <div className="mt-4 flex gap-2">
                      <Select
                        required
                        value={selectedMaterial?._id || ""}
                        onValueChange={(value) => {
                          setSelectedMaterial(
                            materials.find((m: any) => m._id === value)
                          );
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Material" />
                        </SelectTrigger>
                        <SelectContent>
                          {materials
                            .filter((material: any) => {
                              const usedMaterials = newFormula.materials.map(
                                (m: any) => m.material
                              );
                              return !usedMaterials.includes(material._id);
                            })
                            .map((material: any) => (
                              <SelectItem
                                key={material._id}
                                value={material._id}
                              >
                                {material.name} ({material.unit})
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder={
                          "Quantity " + (selectedMaterial?.unit || "")
                        }
                        type="number"
                        className="w-[120px]"
                        onChange={(e) => {
                          setSelectedQuantity(
                            (Number(e.target.value) || 0).toString()
                          );
                        }}
                        value={selectedQuantity}
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          if (selectedMaterial) {
                            setNewFormula({
                              ...newFormula,
                              materials: [
                                ...newFormula.materials,
                                {
                                  material: selectedMaterial._id,
                                  name: selectedMaterial.name,
                                  quantity: selectedQuantity,
                                  unit: selectedMaterial.unit,
                                },
                              ],
                            });
                            setSelectedMaterial(null);
                            setSelectedQuantity("");
                          }
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        <div>
          <Button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              handleNewFormula(newFormula);
            }}
          >
            Create Formula
          </Button>
        </div>
      </div>
    </form>
  );
}
