"use client";

import { useCallback, useEffect, useState } from "react";
import { FlockSelector } from "@/components/flock-selector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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

export default function OtherExpenses() {
  const { selectedFlock } = useFlocks();
  const [isLoading, setIsLoading] = useState(false);
  const [expenses, setExpenses] = useState([]);

  const [newExpense, setNewExpense] = useState({
    date: new Date().toISOString().split("T")[0],
    name: "",
    cost: "",
    isFlockSpecific: false,
    flock: null,
  });

  const fetchExpenses = useCallback(async () => {
    const response = await getAll("other", {
      populate: "flock",
    });
    if (response) {
      setExpenses(response.data);
    }
  }, [selectedFlock]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetchExpenses();
      setIsLoading(false);
    };
    fetchData();
  }, [selectedFlock, fetchExpenses]);

  const handleNewExpense = async () => {
    const expenseData = {
      ...newExpense,
      flock: newExpense.isFlockSpecific ? selectedFlock?._id : null,
    };

    const response = await create("other", expenseData);

    if (response) {
      fetchExpenses();
      setNewExpense({
        date: new Date().toISOString().split("T")[0],
        name: "",
        cost: "",
        isFlockSpecific: false,
        flock: null,
      });
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) {
      return;
    }

    const response = await remove("other", id);

    if (response) {
      fetchExpenses();
    }
  };

  return (
    <>
      <header className="border-b">
        <h1 className="px-4 py-4 text-xl font-semibold">Other Expenses</h1>
      </header>

      {newExpense.isFlockSpecific && <FlockSelector />}

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

              <Button
                className="w-full"
                onClick={(e) => {
                  e.preventDefault();
                  handleNewExpense();
                }}
              >
                Record Expense
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense History</CardTitle>
          </CardHeader>
          {isLoading && <Spinner />}
          {!isLoading && (
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense: any) => (
                    <TableRow key={expense._id}>
                      <TableCell>
                        {format(new Date(expense.date), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>{expense.name}</TableCell>
                      <TableCell>
                        {expense.flock
                          ? `Flock: ${expense.flock.name}`
                          : "General"}
                      </TableCell>
                      <TableCell className="text-right">
                        ₹ {Number(expense.cost).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant={"ghost"}
                          onClick={() => handleDeleteExpense(expense._id)}
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