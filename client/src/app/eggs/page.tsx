"use client";

import { FlockRequired } from "@/components/flock-required";
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
import { getAll } from "@/lib/api";
import { useFlocks } from "@/store/flocks";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

// Define interface for activity items
interface ActivityItem {
  date: Date;
  category: string;
  additional: string;
  quantity: number;
}

export default function EggManagement() {
  const router = useRouter();
  const { selectedFlock } = useFlocks();
  const [isLoading, setIsLoading] = useState(false);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  // Fetch productions and sales for the recent activity section
  const fetchRecentActivity = useCallback(async () => {
    if (!selectedFlock) return;

    setIsLoading(true);

    // Fetch recent egg productions
    const productionsResponse = await getAll("eggsProduction", {
      flock: selectedFlock._id,
      limit: 10,
    });

    // Fetch recent egg sales
    const salesResponse = await getAll("eggsSale", {
      flock: selectedFlock._id,
      populate: "customer",
      limit: 10,
    });

    const productions = productionsResponse?.data || [];
    const sales = salesResponse?.data || [];

    const combinedActivity = [
      ...productions.map((p: any) => ({
        date: new Date(p.date),
        category: "Production",
        additional: p.type === "normal" ? "Normal" : "Cracked",
        quantity: Number(p.quantity),
      })),
      ...sales.map((s: any) => ({
        date: new Date(s.date),
        category: "Sale",
        additional: s.customer?.name || "Unknown",
        quantity: Number(s.quantity),
      })),
    ];

    combinedActivity.sort((a, b) => b.date.getTime() - a.date.getTime());
    setRecentActivity(combinedActivity.slice(0, 5));
    setIsLoading(false);
  }, [selectedFlock]);

  useEffect(() => {
    fetchRecentActivity();
  }, [fetchRecentActivity]);

  return (
    <div className="container mx-auto p-4">
      <FlockRequired>
        <h1 className="text-2xl font-bold mb-6">Egg Management</h1>

        {/* Current Inventory Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Current Inventory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <span className="text-lg font-medium">Total Eggs Available</span>
              <span className="text-2xl font-bold">
                {selectedFlock?.eggs || 0}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && <Spinner />}
            {!isLoading && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Additional</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivity.map((activity, index) => (
                    <TableRow key={index}>
                      <TableCell>{format(activity.date, "MMM dd")}</TableCell>
                      <TableCell>{activity.category}</TableCell>
                      <TableCell className="text-right">
                        {activity.additional}
                      </TableCell>
                      <TableCell className="text-right">
                        {activity.quantity}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Production Card */}
          <Card
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => router.push("/eggs/production")}
          >
            <CardHeader>
              <CardTitle>Production</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Record and track egg production</p>
              <Button className="w-full mt-4">Manage Production</Button>
            </CardContent>
          </Card>

          {/* Sales Card */}
          <Card
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => router.push("/eggs/sales")}
          >
            <CardHeader>
              <CardTitle>Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Record and manage egg sales</p>
              <Button className="w-full mt-4">Manage Sales</Button>
            </CardContent>
          </Card>

          {/* Customers Card */}
          <Card
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => router.push("/eggs/customers")}
          >
            <CardHeader>
              <CardTitle>Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Manage customers and view balances</p>
              <Button className="w-full mt-4">Manage Customers</Button>
            </CardContent>
          </Card>
        </div>
      </FlockRequired>
    </div>
  );
}
