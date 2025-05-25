"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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
import { format } from "date-fns";
import { create, getAll, remove } from "@/lib/api";
import { useFlocks } from "@/store/flocks";
import { Spinner } from "@/components/ui/spinner";
import { Trash2 } from "lucide-react";

export default function VaccineManagement() {
  const { selectedFlock } = useFlocks();
  const [isLoading, setIsLoading] = useState(false);
  const [vaccines, setVaccines] = useState([]);

  const [newVaccine, setNewVaccine] = useState({
    date: new Date().toISOString().split("T")[0],
    name: "",
    cost: "",
    flock: selectedFlock?._id,
  });

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

  const handleNewVaccine = async () => {
    const response = await create("vaccine", {
      ...newVaccine,
      flock: selectedFlock?._id,
    });

    if (response) {
      fetchVaccines();
      setNewVaccine({
        date: new Date().toISOString().split("T")[0],
        name: "",
        cost: "",
        flock: selectedFlock?._id,
      });
    }
  };

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
        <h1 className="px-4 py-4 text-xl font-semibold">Vaccine Management</h1>
      </header>


      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Record Vaccine Expense</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vaccine-date">Date</Label>
                <Input
                  type="date"
                  id="vaccine-date"
                  value={newVaccine.date}
                  onChange={(e) =>
                    setNewVaccine({
                      ...newVaccine,
                      date: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vaccine-name">Vaccine Name</Label>
                <Input
                  type="text"
                  id="vaccine-name"
                  placeholder="Enter vaccine name"
                  value={newVaccine.name}
                  onChange={(e) =>
                    setNewVaccine({
                      ...newVaccine,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vaccine-cost">Cost (₹)</Label>
                <Input
                  type="number"
                  id="vaccine-cost"
                  placeholder="Enter cost"
                  value={newVaccine.cost}
                  onChange={(e) =>
                    setNewVaccine({
                      ...newVaccine,
                      cost: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <Button
                className="w-full"
                onClick={(e) => {
                  e.preventDefault();
                  handleNewVaccine();
                }}
              >
                Record Vaccine
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vaccine History</CardTitle>
          </CardHeader>
          {isLoading && <Spinner />}
          {!isLoading && (
            <CardContent>
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
            </CardContent>
          )}
        </Card>
      </div>
    </>
  );
}