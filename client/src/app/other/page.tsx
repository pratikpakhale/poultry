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

type Expense = {
  _id: string;
  date: string | Date;
  name: string;
  flock?: { name: string };
  cost: number;
};

export default function OtherExpenses() {
  const router = useRouter();
  const { selectedFlock } = useFlocks();
  const [isLoading, setIsLoading] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const fetchExpenses = useCallback(async () => {
    const response = await getAll("other", {
      populate: "flock",
    });
    if (response) {
      setExpenses(response.data);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetchExpenses();
      setIsLoading(false);
    };
    fetchData();
  }, [selectedFlock, fetchExpenses]);

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
        <div className="px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Other Expenses</h1>
          <Button onClick={() => router.push("/other/new")} className="gap-1">
            <Plus size={16} />
            Add New
          </Button>
        </div>
      </header>

      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Expense History</CardTitle>
          </CardHeader>
          {isLoading && <Spinner />}
          {!isLoading && (
            <CardContent>
              {expenses.length === 0 && (
                <p className="text-center py-4 text-muted-foreground">
                  No expenses found. Click &quot;Add New&quot; to record an
                  expense.
                </p>
              )}
              {expenses.length > 0 && (
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
                    {expenses.map((expense: Expense) => (
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
              )}
            </CardContent>
          )}
        </Card>
      </div>
    </>
  );
}
