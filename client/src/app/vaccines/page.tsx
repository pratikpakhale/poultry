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
import { useFlocks } from "@/store/flocks";
import { format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function VaccineManagement() {
  const router = useRouter();
  const { selectedFlock } = useFlocks();
  const [isLoading, setIsLoading] = useState(false);
  const [vaccines, setVaccines] = useState([]);

  const fetchVaccines = useCallback(async () => {
    if (!selectedFlock) return;
    const response = await getAll("vaccine", {
      flock: selectedFlock?._id,
    });
    if (response) {
      setVaccines(response.data);
    }
  }, [selectedFlock]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetchVaccines();
      setIsLoading(false);
    };
    fetchData();
  }, [selectedFlock, fetchVaccines]);

  const handleDeleteVaccine = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vaccine record?")) {
      return;
    }

    const response = await remove("vaccine", id);

    if (response) {
      fetchVaccines();
    }
  };

  return (
    <>
      <header className="border-b">
        <div className="px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Vaccine Management</h1>
          <Button
            onClick={() => router.push("/vaccines/new")}
            className="gap-1"
          >
            <Plus size={16} />
            Add New
          </Button>
        </div>
      </header>

      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Vaccine History</CardTitle>
          </CardHeader>
          {isLoading && <Spinner />}
          {!isLoading && (
            <CardContent>
              {vaccines.length === 0 && (
                <p className="text-center py-4 text-muted-foreground">
                  No vaccine records found. Click "Add New" to record a vaccine.
                </p>
              )}
              {vaccines.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-right">Cost</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vaccines.map((vaccine: any) => (
                      <TableRow key={vaccine._id}>
                        <TableCell>
                          {format(new Date(vaccine.date), "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell>{vaccine.name}</TableCell>
                        <TableCell className="text-right">
                          ₹ {Number(vaccine.cost).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant={"ghost"}
                            onClick={() => handleDeleteVaccine(vaccine._id)}
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
          )}
        </Card>
      </div>
    </>
  );
}
