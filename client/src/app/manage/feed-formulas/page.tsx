"use client";

import { BottomNav } from "@/components/bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { create, getAll, remove } from "@/lib/api";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";

export default function FeedFormulas() {
  const [isLoading, setIsLoading] = useState(true);
  const [formulas, setFormulas] = useState<any>([]);

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
  }, []);

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
          {formulas.map((formula: any) => (
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
                    {formula.materials.map((m: any) => (
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
