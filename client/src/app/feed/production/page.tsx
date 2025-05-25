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
import { format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface Production {
  _id: string;
  date: Date;
  formula: {
    _id: string;
    name: string;
  };
}

export default function FeedProductionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [productions, setProductions] = useState<Production[]>([]);

  const fetchProductions = useCallback(async () => {
    setIsLoading(true);
    const response = await getAll("feedProduction", {
      populate: "formula",
    });

    if (response) {
      setProductions(response.data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchProductions();
  }, [fetchProductions]);

  const handleDeleteProduction = async (id: string) => {
    if (!confirm("Are you sure you want to delete this production?")) {
      return;
    }

    const response = await remove("feedProduction", id);
    if (response) {
      fetchProductions();
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header without back button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Feed Production</h1>

        {/* Add New Production Button */}
        <Button
          onClick={() => router.push("/feed/production/new")}
          className="gap-1"
        >
          <Plus size={16} />
          Add New
        </Button>
      </div>

      {/* Productions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Production Records</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <Spinner />}
          {!isLoading && productions.length === 0 && (
            <p className="text-center py-4 text-muted-foreground">
              No production records found. Click &quot;Add New&quot; to record
              production.
            </p>
          )}
          {!isLoading && productions.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Formula</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productions.map((production) => (
                  <TableRow key={production._id}>
                    <TableCell>
                      {format(new Date(production.date), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>{production.formula.name}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProduction(production._id)}
                      >
                        <Trash2 size={16} color="red" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
