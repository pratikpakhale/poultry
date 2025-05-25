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

type Mortality = { date: string | Date; count: number; reason: string };
type Purchase = { date: string | Date; quantity: number; rate: number };
type Sale = { date: string | Date; quantity: number; rate: number };

export default function BirdManagement() {
  const router = useRouter();
  const { selectedFlock } = useFlocks();
  const [isLoading, setIsLoading] = useState(false);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  // Fetch mortalities, purchases and sales for the recent activity section
  const fetchRecentActivity = useCallback(async () => {
    if (!selectedFlock) return;

    setIsLoading(true);

    // Fetch recent bird mortalities
    const mortalitiesResponse = await getAll("birdMortality", {
      flock: selectedFlock._id,
      limit: 10,
    });

    // Fetch recent bird purchases
    const purchasesResponse = await getAll("birdPurchase", {
      flock: selectedFlock._id,
      limit: 10,
    });

    // Fetch recent bird sales
    const salesResponse = await getAll("birdSale", {
      flock: selectedFlock._id,
      limit: 10,
    });

    const mortalities = mortalitiesResponse?.data || [];
    const purchases = purchasesResponse?.data || [];
    const sales = salesResponse?.data || [];

    const combinedActivity = [
      ...mortalities.map((m: Mortality) => ({
        date: new Date(m.date),
        category: "Mortality",
        additional: "Loss",
        quantity: Number(m.count),
      })),
      ...purchases.map((p: Purchase) => ({
        date: new Date(p.date),
        category: "Purchase",
        additional: `₹${p.rate}/bird`,
        quantity: Number(p.quantity),
      })),
      ...sales.map((s: Sale) => ({
        date: new Date(s.date),
        category: "Sale",
        additional: `₹${s.rate}/bird`,
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
        <h1 className="text-2xl font-bold mb-6">Bird Management</h1>

        {/* Current Inventory Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col justify-between p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Total Birds</div>
                <div className="text-2xl font-bold mt-1">
                  {selectedFlock
                    ? selectedFlock.quantity - selectedFlock.mortality
                    : 0}
                </div>
              </div>
              <div className="flex flex-col justify-between p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">
                  Mortality Rate
                </div>
                <div className="text-2xl font-bold mt-1">
                  {selectedFlock && selectedFlock.quantity
                    ? (
                        (selectedFlock.mortality / selectedFlock.quantity) *
                        100
                      ).toFixed(1) + "%"
                    : "0%"}
                </div>
              </div>
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
          {/* Mortality Card */}
          <Card
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => router.push("/birds/mortality")}
          >
            <CardHeader>
              <CardTitle>Mortality</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Record and track bird mortality</p>
              <Button className="w-full mt-4">Manage Mortality</Button>
            </CardContent>
          </Card>

          {/* Purchase Card */}
          <Card
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => router.push("/birds/buy")}
          >
            <CardHeader>
              <CardTitle>Purchases</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Record and manage bird purchases</p>
              <Button className="w-full mt-4">Manage Purchases</Button>
            </CardContent>
          </Card>

          {/* Sales Card */}
          <Card
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => router.push("/birds/sell")}
          >
            <CardHeader>
              <CardTitle>Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Record and manage bird sales</p>
              <Button className="w-full mt-4">Manage Sales</Button>
            </CardContent>
          </Card>
        </div>
      </FlockRequired>
    </div>
  );
}
