"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { create } from "@/lib/api";
import { useFlocks } from "@/store/flocks";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddOtherExpensePage() {
  const router = useRouter();
  const { selectedFlock } = useFlocks();

  const [newExpense, setNewExpense] = useState({
    date: new Date().toISOString().split("T")[0],
    name: "",
    cost: "",
    isFlockSpecific: true,
    flock: null,
  });

  const handleNewExpense = async () => {
    const expenseData = {
      ...newExpense,
      flock: newExpense.isFlockSpecific ? selectedFlock?._id : null,
    };

    const response = await create("other", expenseData);

    if (response) {
      // Navigate back to the expenses list page
      router.push("/other");
    }
  };

  return (
    <>
      <header className="border-b">
        <h1 className="px-4 py-4 text-xl font-semibold">Add New Expense</h1>
      </header>

      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Record Expense</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  type="date"
                  id="date"
                  value={newExpense.date}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, date: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Expense Name</Label>
                <Input
                  type="text"
                  id="name"
                  placeholder="Enter expense name"
                  value={newExpense.name}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  type="number"
                  id="amount"
                  placeholder="Enter amount"
                  value={newExpense.cost}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, cost: e.target.value })
                  }
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="flock-specific">Flock Specific</Label>
                <Switch
                  id="flock-specific"
                  checked={newExpense.isFlockSpecific}
                  onCheckedChange={(checked) =>
                    setNewExpense({ ...newExpense, isFlockSpecific: checked })
                  }
                />
              </div>

              <div className="pt-4 space-x-2">
                <Button
                  className="w-full"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNewExpense();
                  }}
                >
                  Record Expense
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
