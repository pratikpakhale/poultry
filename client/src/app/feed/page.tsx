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
import { getAll } from "@/lib/api";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface Material {
  _id: string;
  name: string;
  type: string;
  quantity: number;
  unit: string;
}

interface ActivityItem {
  id: string;
  date: Date;
  type: string;
  details: string;
}

export default function FeedManagement() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  const fetchMaterials = useCallback(async () => {
    const res = await getAll("material");
    setMaterials(res.data);
  }, []);

  const fetchRecentActivity = useCallback(async () => {
    setIsLoading(true);

    // Fetch productions
    const productionsResponse = await getAll("feedProduction", {
      populate: "formula",
      limit: 5,
    });

    // Fetch purchases
    const purchasesResponse = await getAll("feedPurchase", {
      populate: "material",
      limit: 5,
    });

    // Fetch deductions
    const deductionsResponse = await getAll("feedSale", {
      populate: "material",
      limit: 5,
    });

    const productions = productionsResponse?.data || [];
    const purchases = purchasesResponse?.data || [];
    const deductions = deductionsResponse?.data || [];

    // Combine and sort by date (newest first)
    const combinedActivity = [
      ...productions.map((p: any) => ({
        date: new Date(p.date),
        type: "Production",
        details: p.formula?.name || "Unknown Formula",
        id: p._id,
      })),
      ...purchases.map((p: any) => ({
        date: new Date(p.date),
        type: "Purchase",
        details: p.material?.name || "Unknown Material",
        id: p._id,
      })),
      ...deductions.map((d: any) => ({
        date: new Date(d.date),
        type: "Deduction",
        details: d.material?.name || "Unknown Material",
        id: d._id,
      })),
    ];

    combinedActivity.sort((a, b) => b.date.getTime() - a.date.getTime());
    setRecentActivity(combinedActivity.slice(0, 5));
    setIsLoading(false);
  }, []);

  const fetchAll = () => {
    fetchMaterials();
    fetchRecentActivity();
  };

  useEffect(() => {
    fetchAll();
  }, [fetchMaterials, fetchRecentActivity]);

  return (
    <>
      <header className="border-b">
        <h1 className="px-4 py-4 text-xl font-semibold">Feed Management</h1>
      </header>

      <div className="p-4">
        {/* Materials Inventory Overview Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Current Inventory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.map((material) => (
                  <TableRow key={material._id}>
                    <TableCell>{material.name}</TableCell>
                    <TableCell>{material.type}</TableCell>
                    <TableCell className="text-right">
                      {material.quantity} {material.unit}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
                    <TableHead>Type</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivity.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>{format(activity.date, "MMM dd")}</TableCell>
                      <TableCell>{activity.type}</TableCell>
                      <TableCell>{activity.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Inventory Card */}
          <Card
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => router.push("/feed/inventory")}
          >
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <p>View and manage feed materials inventory</p>
              <Button className="w-full mt-4">Manage Inventory</Button>
            </CardContent>
          </Card>

          {/* Production Card */}
          <Card
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => router.push("/feed/production")}
          >
            <CardHeader>
              <CardTitle>Production</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Record and track feed production</p>
              <Button className="w-full mt-4">Manage Production</Button>
            </CardContent>
          </Card>

          {/* Expenses Card */}
          <Card
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => router.push("/feed/expenses")}
          >
            <CardHeader>
              <CardTitle>Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Record purchases and feed expenses</p>
              <Button className="w-full mt-4">Manage Expenses</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
