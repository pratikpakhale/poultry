"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { create } from "@/lib/api";
import { useFlocks } from "@/store/flocks";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddVaccinePage() {
  const router = useRouter();
  const { selectedFlock } = useFlocks();

  const [newVaccine, setNewVaccine] = useState({
    date: new Date().toISOString().split("T")[0],
    name: "",
    cost: "",
    flock: selectedFlock?._id,
  });

  const handleNewVaccine = async () => {
    const response = await create("vaccine", {
      ...newVaccine,
      flock: selectedFlock?._id,
    });

    if (response) {
      // Navigate back to the vaccines list page
      router.push("/vaccines");
    }
  };

  return (
    <>
      <header className="border-b">
        <h1 className="px-4 py-4 text-xl font-semibold">Add New Vaccine</h1>
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

              <div className="pt-4">
                <Button
                  className="w-full"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNewVaccine();
                  }}
                >
                  Record Vaccine
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
