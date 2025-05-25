"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAll, remove } from "@/lib/api";
import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type FormulaMaterial = {
  material: { _id: string; name: string; unit: string };
  quantity: string;
};
type Formula = { _id: string; name: string; materials: FormulaMaterial[] };

export default function FeedFormulas() {
  const [isLoading, setIsLoading] = useState(true);
  const [formulas, setFormulas] = useState<Formula[]>([]);

  const fetchFormulas = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAll("formula", {
        populate: "materials.material",
      });
      setFormulas(response.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFormulas();
  }, [fetchFormulas]);

  const handleDeleteFormula = async (id: string) => {
    try {
      if (!confirm("Are you sure you want to delete this formula?")) return;
      await remove("formula", id);
      fetchFormulas();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <header className="border-b flex items-center justify-between px-4 py-4">
        <h1 className="text-xl font-semibold">Feed Formulas</h1>
        <Link href={`/manage/feed-formulas/new`}>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Formula
          </Button>
        </Link>
      </header>

      {isLoading && <Spinner className="mt-2" />}

      {!isLoading && (
        <div className="p-4 space-y-6">
          {formulas.map((formula: Formula) => (
            <Card key={formula._id}>
              <CardHeader className="flex flex-row items-center">
                <CardTitle>{formula.name}</CardTitle>
                <Button
                  className="ml-auto"
                  variant={"ghost"}
                  onClick={() => handleDeleteFormula(formula._id)}
                >
                  <Trash2 color="red" className="h-4 w-4" />
                </Button>
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
                    {formula.materials.map((m: FormulaMaterial) => (
                      <TableRow key={m.material?._id}>
                        <TableCell>{m.material.name}</TableCell>
                        <TableCell className="text-right">
                          {m.quantity} {m.material.unit}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
