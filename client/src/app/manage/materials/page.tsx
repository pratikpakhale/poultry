"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Trash2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function Materials() {
  const [isLoading, setIsLoading] = useState(true);
  const [materials, setMaterials] = useState<any>([]);

  const [newMaterial, setNewMaterial] = useState<any>({
    name: "",
    type: "",
    unit: "",
  });

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

  const handleNewMaterial = async () => {
    try {
      await create("material", newMaterial);
      fetchMaterials();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (!confirm("Are you sure you want to delete this material?")) return;
      await remove("material", id);
      fetchMaterials();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <header className="border-b">
        <h1 className="px-4 py-4 text-xl font-semibold">Raw Materials</h1>
      </header>

      <div className="p-4 space-y-6">
        <Card>
          <form onSubmit={handleNewMaterial}>
            <CardHeader>
              <CardTitle>Add New Material</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <Input
                  placeholder="Material name"
                  className="flex-1"
                  value={newMaterial.name}
                  required
                  onChange={(e) =>
                    setNewMaterial({ ...newMaterial, name: e.target.value })
                  }
                />
                <Select
                  required
                  value={newMaterial.type}
                  onValueChange={(value) =>
                    setNewMaterial({ ...newMaterial, type: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="feed">Raw Material</SelectItem>
                    <SelectItem value="medicine">Medicine</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  required
                  value={newMaterial.unit}
                  onValueChange={(value) =>
                    setNewMaterial({ ...newMaterial, unit: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilo Gram</SelectItem>
                    <SelectItem value="ton">Ton</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">Add Material</Button>
            </CardContent>
          </form>
        </Card>
        {isLoading && <Spinner />}
        {!isLoading && (
          <Card>
            <CardHeader>
              <CardTitle>Material List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materials.map((material: any) => (
                    <TableRow key={material._id}>
                      <TableCell>{material.name}</TableCell>
                      <TableCell>
                        {material.type === "feed" ? "Raw Material" : "Medicine"}
                      </TableCell>
                      <TableCell className="w-[50px]">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(material._id)}
                        >
                          <Trash2 color="red" className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
